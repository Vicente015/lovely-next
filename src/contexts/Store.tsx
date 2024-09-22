import { type Document as EarthstarDocument, Path, type Store, isErr } from '@earthstar/earthstar'
import { type Signal, useSignal, useSignalEffect } from '@preact/signals'
import { type ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { EarthstarContext } from '../contexts/Earthstar'
import { Map as ImmutableMap } from 'immutable'
import parseDocument, { type Document } from '../utils/parseDocument'

interface StoreState {
  store: Signal<Store | null>
  documents: Signal<ImmutableMap<string, Document>>
  createDocument: ({ path, content }: { path: string, content: string }) => Promise<boolean>
}

export const StoreContext = createContext<StoreState | null>(null)

export default function StoreProvider (
  props: { children: ComponentChildren }
) {
  const earthstar = useContext(EarthstarContext)
  const store = useSignal<Store | null>(null)

  const originalDocuments = useSignal<ImmutableMap<string, EarthstarDocument>>(ImmutableMap())
  const documents = useSignal<ImmutableMap<string, Document>>(ImmutableMap())

  async function loadDocuments () {
    if (!store.value) return
    const documentsArray = await Array.fromAsync(store.value.documents())
    const newOriginals = ImmutableMap(
      documentsArray.map((document) => [document.path.format('base32'), document])
    )
    originalDocuments.value = newOriginals

    const temporalMap = new Map<string, Document>()
    for (const [path, document] of newOriginals) {
      const parsedDocument = await parseDocument(document)
      temporalMap.set(path, parsedDocument)
    }
    const newDocuments = ImmutableMap(temporalMap.entries())
    documents.value = newDocuments
  }

  async function createDocument ({ path, content }: { path: string, content: string }) {
    if (!store.value) throw new Error('Store needed')
    if (!earthstar?.identity.value) throw new Error('Identity needed')
    const encoder = new TextEncoder()
    const identityTag = earthstar?.identity.value.tag
    const result = await store.value.set({
      identity: identityTag,
      path: Path.fromStrings(path),
      payload: encoder.encode(content)
    })
    if (result.kind === 'success') {
      void loadDocuments()
      return true
    }
    return false
  }

  useSignalEffect(() => {
    async function getDefaultStore () {
      if (!earthstar || !earthstar.share.value || store.value) return
      const shareTag = earthstar.share.value.tag
      const newStore = await earthstar.peer.value?.getStore(shareTag)
      if (newStore === undefined) throw new Error('store is undefined')
      if (isErr(newStore)) throw newStore
      store.value = newStore

      console.debug('loaded store', newStore, 'for tag', shareTag)
    }
    void getDefaultStore()
  })

  useSignalEffect(() => {
    void loadDocuments()
  })

  return (
    <StoreContext.Provider
      value={{ store, documents, createDocument }}
    >
      {props.children}
    </StoreContext.Provider>
  )
}
