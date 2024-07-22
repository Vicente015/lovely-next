import { useContext } from 'preact/hooks'
import WelcomeMessage from '../components/WelcomeMessage'
import { StoreContext } from '../contexts/Store'
import DocumentPreview from '../components/DocumentPreview'
import { MenuIcon, PlusIcon, SearchIcon } from 'lucide-preact'
import { Avatar } from '../components/Avatar'
import { EarthstarContext } from '../contexts/Earthstar'
import { Path } from '@earthstar/earthstar'
import { AskModal } from '../components/AskModal'

const encoder = new TextEncoder()

// todo: navbar component composable
const NavBar = () => {
  const earthstar = useContext(EarthstarContext)
  const store = useContext(StoreContext)

  const handleCreate = async () => {
    console.debug(store?.store.value)
    if (!store || !earthstar || !earthstar.identity.value || !store.store.value) throw new Error('no no')
    const created = await store?.store.value?.set({
      identity: earthstar?.identity.value.tag,
      path: Path.fromStrings('example'),
      payload: encoder.encode('# title\ndescription')
    })
    console.debug('created', created, store.store.value, earthstar.identity.value)
  }

  console.debug('document', store?.documents.value)

  return (
    <nav class='sticky left-0 top-0 flex flex-row items-center justify-between bg-light-2 bg-opacity-30 py-1 text-black backdrop-blur-md backdrop-filter'>
      <div class='flex gap-2'>
        <button
          type='button' className='cursor-pointer b-none bg-transparent text-black'
          onClick={() => { void handleCreate() }}
        >
          <PlusIcon />
        </button>
        <SearchIcon />
      </div>
      <h1 class='text-xl font-bold'>Lovely</h1>
      <div class='flex flex-row items-center gap-2'>
        <Avatar name={earthstar?.identity.value?.name ?? ''} />
        <MenuIcon />
      </div>
    </nav>
  )
}

export function HomePage () {
  const earthstar = useContext(EarthstarContext)
  const store = useContext(StoreContext)

  return (
    <>
      <NavBar />
      {store?.documents.value && store?.documents.value.size > 0
        ? <main
          className='grid grid-cols-1 m-auto mb-12 mt-4 max-w-[75ch] gap-6 px-8 transition-all md:grid-cols-4 sm:grid-cols-2 lg:max-w-[85ch] md:p-0 sm:px-6'
        >
          {store.documents.value.map((document, index) => (
            <DocumentPreview key={index} document={document} />
          ))}
        </main>
        : <div className='grid h-xl place-items-center'>
          <WelcomeMessage />
        </div>
      }
      {!earthstar?.identity.value && (
        <AskModal type='identity' />
      )}

    </>
  )
}
