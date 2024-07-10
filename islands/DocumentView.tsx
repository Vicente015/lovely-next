import { useContext, useEffect } from 'preact/hooks'
import { EarthstarContext, EarthstarProvider } from '../context/Earthstar.tsx'
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js'
import { Document, Path, ValidationError } from '@earthstar/earthstar'
import { KeyringProvider } from '../context/Keyring.tsx'
import DocumentPreview from '../components/DocumentPreview.tsx'
import { useStore } from '../hooks/useStore.ts'

const Content = () => {
  const earthstar = useContext(EarthstarContext)
  if (!earthstar) return <></>
  const { documents } = useStore(earthstar)

  useEffect(() => {
    async function getStore() {
      if (!earthstar?.share) return

      const store = await earthstar?.peer.getStore(earthstar.share?.tag)
      if (store instanceof ValidationError) return
      await store.set({
        identity: earthstar.identity.tag,
        path: Path.fromStrings('index'),
        payload: new TextEncoder().encode('hello world'),
      })
    }
    getStore()
    console.debug('documents', documents)
  }, [earthstar])

  return (
    <main
      class={'max-w-[75ch] lg:max-w-[85ch] px-8 sm:px-6 md:p-0 m-auto mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 transition-all'}
    >
      {documents &&
        documents.map((document) => {
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
    <KeyringProvider>
      <EarthstarProvider>
        <Content />
      </EarthstarProvider>
    </KeyringProvider>
  )
}
