import { type Document, Path, type Store, isErr } from '@earthstar/earthstar'
import { type Signal, useSignal, useSignalEffect } from '@preact/signals'
import { type ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { EarthstarContext } from '../contexts/Earthstar'

interface StoreState {
  store: Signal<Store | null>
  documents: Signal<Record<string, Document>>
  createDocument: ({ path, content }: { path: string, content: string }) => Promise<boolean>
}

export const StoreContext = createContext<StoreState | null>(null)

export default function StoreProvider (
  props: { children: ComponentChildren }
) {
  const earthstar = useContext(EarthstarContext)
  const store = useSignal<Store | null>(null)
  const documents = useSignal<Record<string, Document>>({})
  // const documents = useSignal<Collection<string, Document>>(new Collection())
  const encoder = new TextEncoder()

  useSignalEffect(() => {
    const listener = store?.value?.willow
    if (!listener) return
    console.debug('listeners set')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debug = (args: any) => { console.debug('eventListener', args) }

    listener.addEventListener('entrypayloadset', debug)
    listener.addEventListener('entryingest', debug)
    listener.addEventListener('payloadingest', debug)
    listener.addEventListener('entryremove', debug)
    listener.addEventListener('payloadremove', debug)

    return () => {
      listener.removeEventListener('entrypayloadset', debug)
      listener.removeEventListener('entryingest', debug)
      listener.removeEventListener('payloadingest', debug)
      listener.removeEventListener('entryremove', debug)
      listener.removeEventListener('payloadremove', debug)
    }
  })

  async function loadDocuments () {
    if (!store.value) return
    const documentsArray = await Array.fromAsync(store.value.documents())
    for (const document of documentsArray) {
      console.debug('loadDocuments document', document)
      documents.value = {
        ...documents.value,
        [document.path.format('base32')]: document
      }
    }
    console.debug('loaded documents', documentsArray)
  }

  async function createDocument ({ path, content }: { path: string, content: string }) {
    if (!store.value) throw new Error('Store needed')
    if (!earthstar?.identity.value) throw new Error('Identity needed')
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
