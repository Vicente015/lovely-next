import { useContext } from 'preact/hooks'
import WelcomeMessage from '../components/WelcomeMessage'
import { StoreContext } from '../contexts/Store'
import DocumentPreview from '../components/DocumentPreview'
import { MenuIcon, PlusIcon, SearchIcon } from 'lucide-preact'
import { Avatar } from '../components/Avatar'
import { EarthstarContext } from '../contexts/Earthstar'
import { AskModal } from '../components/AskModal'
import { createNameId } from 'mnemonic-id'
import { type Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { type ChangeEvent } from 'preact/compat'

// todo: navbar component composable

const NavBar = ({ query }: { query: Signal<string> }) => {
  const earthstar = useContext(EarthstarContext)
  const store = useContext(StoreContext)
  const showSearchbar = useSignal(false)

  const handleCreate = async () => {
    if (!store || !earthstar || !earthstar.identity.value || !store.store.value) throw new Error('no no')
    await store.createDocument({
      path: createNameId(),
      content: '# title\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, quisquam iusto rerum inventore nihil assumenda placeat similique quo, eaque distinctio excepturi consequatur deserunt nulla, provident incidunt vero fugit rem! Odio!'
    })
  }

  const handleInputChange = (event: ChangeEvent) => {
    query.value = (event.target as HTMLInputElement)?.value
  }

  return (
    <nav class='sticky left-0 top-0 h-auto flex flex-row items-start gap-2 bg-light-2 bg-opacity-30 px-7 py-4 text-black backdrop-blur-md backdrop-filter'>
      <div class='flex items-center gap-2'>
        <button
          type='button' className='cursor-pointer b-none bg-transparent text-black'
          onClick={() => { void handleCreate() }}
        >
          <PlusIcon />
        </button>
        <button
          type='button' className='cursor-pointer b-none bg-transparent text-black'
          onClick={() => { showSearchbar.value = !showSearchbar.value }}
        >
          <SearchIcon />
        </button>
      </div>
      <div className='m-auto flex flex-col items-center justify-end gap-4 text-center'>
        <h1 class='m-0 text-xl font-bold'>Lovely</h1>
        {showSearchbar.value && (
          <div className='mx-4 flex flex-row items-center gap-2 rounded-lg bg-light-3 px-2 py-1 focus-within:ring-2 focus-within:ring-accent'>
            <SearchIcon className='p1' />
            <input
              className='m-0 h-full w-full b-0 bg-transparent p-0 text-black outline-none'
              type='text' value={query.value} onKeyDown={handleInputChange}
            />
          </div>
        )}
      </div>
      <div class='flex flex-row items-center gap-2'>
        <Avatar name={earthstar?.identity.value ? earthstar.identity.value.name : ''} />
        <MenuIcon className='cursor-not-allowed' />
      </div>
    </nav>
  )
}

export function HomePage () {
  const earthstar = useContext(EarthstarContext)
  const store = useContext(StoreContext)
  const documents = store?.documents.value
  const query = useSignal('')
  const queriedDocuments = useComputed(() => store?.documents.value.filter(
    (document) => document.title.toLowerCase().includes(query.value.toLowerCase())
  ))

  const hasDocuments = !!(documents && documents.size > 0)
  const noIdentity = earthstar?.identity.value === false

  useSignalEffect(() => {
    console.debug(
      'debug',
      query.value, queriedDocuments.value
    )
  })

  return (
    <>
      <NavBar query={query} />
      {hasDocuments && (
        <main className='grid grid-cols-1 m-auto mb-12 mt-4 max-w-[75ch] gap-6 px-8 transition-all md:grid-cols-4 sm:grid-cols-2 lg:max-w-[85ch] md:p-0 sm:px-6'>
          {query.value
            ? queriedDocuments.value?.toArray().map(([key, value], index) => (
              <DocumentPreview key={index} document={value} />
            ))
            : documents.toArray().map(([key, value], index) => (
              <DocumentPreview key={index} document={value} />
            ))}
        </main>
      )}
      {!hasDocuments && (
        <section className='grid h-xl place-items-center'>
          <WelcomeMessage />
        </section>
      )}
      {noIdentity && (
        <AskModal type='identity' />
      )}
    </>
  )
}
