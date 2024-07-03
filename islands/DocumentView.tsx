import { useContext, useEffect } from 'preact/hooks'
import { EarthstarContext, EarthstarProvider } from '../context/Earthstar.tsx'
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js'
import { Document, Path, ValidationError } from '@earthstar/earthstar'
import { KeyringProvider } from '../context/Keyring.tsx'
import DocumentPreview from '../components/DocumentPreview.tsx'
const decoder = new TextDecoder()

const Content = () => {
  const earthstar = useContext(EarthstarContext)
  const documents = useSignal<Document[] | null>(null)

  useEffect(() => {
    async function getStore() {
      if (!earthstar?.share) return
      if (earthstar.share && earthstar.identity) {
        console.debug('minted cap')
        const cap = await earthstar.peer.mintCap(
          earthstar.share.tag,
          earthstar.identity.tag,
          'write',
        )
      }
      const store = await earthstar?.peer.getStore(earthstar.share?.tag)
      if (store instanceof ValidationError) return
      await store.set({
        identity: earthstar.identity.tag,
        path: Path.fromStrings('index'),
        payload: new TextEncoder().encode('hello world'),
      })
      const storeDocuments = await Array.fromAsync(store?.documents())
      documents.value = await Promise.all(
        storeDocuments.map(async (document) => ({
          ...document,
          content: decoder.decode(await document.payload?.bytes()),
        })),
      )
    }
    getStore()
    console.debug('documents', documents.value)
  }, [earthstar])

  return (
    <main
      class={'max-w-[75ch] lg:max-w-[85ch] px-8 sm:px-6 md:p-0 m-auto mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 transition-all'}
    >
      {documents.value &&
        documents.value.map((document) => {
          const content = document.content
          const title = document.path.asStrings()?.join('/') ?? 'Title'
          const description = content

          return <DocumentPreview name={title} description={description} />
        })}
    </main>
  )
}

export function DocumentView() {
  return (
    <EarthstarProvider>
      <Content />
    </EarthstarProvider>
  )
}
