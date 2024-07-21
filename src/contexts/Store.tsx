import { type Document, type Store, type Path, isErr } from '@earthstar/earthstar'
import { type Signal, useSignal, useSignalEffect } from '@preact/signals'
import { type ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { EarthstarContext } from '../contexts/Earthstar'
import { Collection } from '@discordjs/collection'

interface StoreState {
  store: Signal<Store | null>
  documents: Signal<Collection<Path, Document>>
}

export const StoreContext = createContext<StoreState | null>(null)

export default function StoreProvider (
  props: { children: ComponentChildren }
) {
  const earthstar = useContext(EarthstarContext)
  const store = useSignal<Store | null>(null)
  const documents = useSignal<Collection<Path, Document>>(new Collection())

  useSignalEffect(() => {
    console.debug('create store called')
    async function getDefaultStore () {
      if (!earthstar || !earthstar.share.value) return
      const newStore = await earthstar.peer.value?.getStore(earthstar.share.value.tag)
      if (newStore === undefined) throw new Error('store is undefined')
      if (isErr(newStore)) throw newStore
      console.debug('loaded store', newStore)
      store.value = newStore

      const documentsArray = await Array.fromAsync(store.value.documents())
      for (const document of documentsArray) {
        documents.value.set(document.path, document)
      }
    }
    void getDefaultStore()
  })

  return (
    <StoreContext.Provider
      value={{ store, documents }}
    >
      {props.children}
    </StoreContext.Provider>
  )
}
