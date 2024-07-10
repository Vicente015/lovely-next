import {
  Document,
  ShareTag,
  Store,
  ValidationError,
} from '@earthstar/earthstar'
import { Earthstar } from '../context/Earthstar.tsx'
import { useEffect, useState } from 'preact/hooks'

export type CustomDocument = Document & {
  content: string
}

const decoder = new TextDecoder()

export function useStore(context: Earthstar) {
  const [store, setStore] = useState<Store | null>(null)
  const [documents, setDocuments] = useState<CustomDocument[]>([])

  const getAllDocuments = async (currentStore: Store) => {
    if (!store) throw new Error('Store needed')

    const documents = await Array.fromAsync(currentStore.documents())
    const decodedDocuments = await Promise.all(
      documents.map(async (document) => ({
        ...document,
        content: decoder.decode(await document.payload?.bytes()),
      })),
    )
    setDocuments(decodedDocuments)
    return decodedDocuments
  }
  const getStore = async () => {
    if (!context.share) throw new Error('Share needed')
    const store = await context.peer.getStore(context.share.tag)
    if (store instanceof ValidationError) {
      console.error(store)
      throw new Error('Invalid store')
    }
    setStore(store)
    return store
  }

  useEffect(() => {
    const initializeStoreAndDocuments = async () => {
      if (!store) {
        const newStore = await getStore()
        if (newStore) await getAllDocuments(newStore)
      } else {
        await getAllDocuments(store)
      }
      initializeStoreAndDocuments()
    }
  }, [context, store])

  return { documents, store }
}
