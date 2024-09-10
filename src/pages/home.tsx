import { useContext, useMemo } from 'preact/hooks'
import WelcomeMessage from '../components/WelcomeMessage'
import { StoreContext } from '../contexts/Store'
import DocumentPreview from '../components/DocumentPreview'
import { MenuIcon, PlusIcon, SearchIcon } from 'lucide-preact'
import { Avatar } from '../components/Avatar'
import { EarthstarContext } from '../contexts/Earthstar'
import { AskModal } from '../components/AskModal'
import { createNameId } from 'mnemonic-id'

// todo: navbar component composable
const NavBar = () => {
  const earthstar = useContext(EarthstarContext)
  const store = useContext(StoreContext)

  const handleCreate = async () => {
    if (!store || !earthstar || !earthstar.identity.value || !store.store.value) throw new Error('no no')
    const generatedPath = createNameId()
    console.debug('new path', generatedPath)
    await store.createDocument({
      path: generatedPath,
      content: '# title\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, quisquam iusto rerum inventore nihil assumenda placeat similique quo, eaque distinctio excepturi consequatur deserunt nulla, provident incidunt vero fugit rem! Odio!'
    })
  }

  return (
    <nav class='sticky left-0 top-0 h-[3rem] flex flex-row items-center justify-between bg-light-2 bg-opacity-30 px-7 py-2 text-black backdrop-blur-md backdrop-filter'>
      <div class='flex gap-2'>
        <button
          type='button' className='cursor-pointer b-none bg-transparent text-black'
          onClick={() => { void handleCreate() }}
        >
          <PlusIcon />
        </button>
        <SearchIcon className='cursor-not-allowed' />
      </div>
      <h1 class='text-xl font-bold'>Lovely</h1>
      <div class='flex flex-row items-center gap-2'>
        <Avatar name={earthstar?.identity.value?.name ?? ''} />
        <MenuIcon className='cursor-not-allowed' />
      </div>
    </nav>
  )
}

export function HomePage () {
  const earthstar = useContext(EarthstarContext)
  const store = useContext(StoreContext)

  console.debug('document in home', store?.documents.value)
  const documents = useMemo(() => {
    const storeValue = store?.documents.value
    return storeValue ? Object.entries(store.documents.value) : []
  }, [store?.documents.value])

  return (
    <>
      <NavBar />
      {
        documents.length > 0
          ? <main
            className='grid grid-cols-1 m-auto mb-12 mt-4 max-w-[75ch] gap-6 px-8 transition-all md:grid-cols-4 sm:grid-cols-2 lg:max-w-[85ch] md:p-0 sm:px-6'
          >
            {documents.map(([, value], index) => (
              <DocumentPreview key={index} document={value} />
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
