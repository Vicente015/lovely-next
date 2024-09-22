import { type ComponentChildren } from 'preact'
import Toolbar from '../../components/ToolBar'
import { useContext } from 'preact/hooks'
import { StoreContext } from '../../contexts/Store'
import { ChevronLeftIcon, EllipsisVerticalIcon, MenuIcon, PanelLeftDashedIcon } from 'lucide-preact'
import { useLocation } from 'preact-iso'
import { type Document } from '../../utils/parseDocument'

// todo: separate navbar component
const NavBar = ({ title, path }: { title: string, path: string }) => {
  const router = useLocation()

  const handleBack = () => { router.route('../') }

  return (
    <nav class='sticky left-0 top-0 h-[3rem] flex flex-row items-center justify-between bg-light-2 bg-opacity-30 px-7 py-2 text-black backdrop-blur-md backdrop-filter'>
      <section class='flex items-center gap-2'>
        <button type='button' className='m-0 h-6 w-6 cursor-pointer border-none bg-transparent p-0 text-black' onClick={handleBack}>
          <ChevronLeftIcon className='h-auto w-auto' />
        </button>
        <PanelLeftDashedIcon className='h-6 w-6' />
      </section>

      <section className='flex flex-col gap-1 text-center leading-[0]'>
        <span class='text-lg font-bold'>{title}</span>
        <span className='text-neutral-600'>{path}</span>
      </section>

      <section class='flex flex-row items-center gap-4'>
        <EllipsisVerticalIcon className='h-6 w-6 cursor-pointer' />
        <MenuIcon className='h-6 w-6 cursor-pointer' />
      </section>
    </nav>
  )
}

const TextSection = ({ children }: { children: ComponentChildren }) => (
  <p class='mb-4 text-2xl text-neutral-600 leading-tight'>
    {children}
  </p>
)

function DocumentView ({ document }: { document: Document }) {
  const title = document.title
  const path = document.humanPath ?? ''
  const paragraphs = document.description.split('\n')

  return (
    <>
      <NavBar title={title} path={path} />
      <div class='mx-auto max-w-2xl p-6'>
        <h1 class='line-clamp-2 mb-4 text-pretty text-3xl text-neutral-950 font-bold font-antique' autoFocus contentEditable>
          {title}
        </h1>
        <div className='font-lora text-balance' contentEditable>
          {paragraphs.map((paragraph, index) => (
            <TextSection key={index}>
              {paragraph}
            </TextSection>
          ))}
        </div>
      </div>
      <Toolbar />
    </>
  )
}

export default function DocumentPage ({ id }: { id: string }) {
  const store = useContext(StoreContext)
  if (!store) throw new Error('no store')

  // todo: get document from human path
  const document = store.documents.value.get(id)

  const NotFound = () => (
    <div>
      No existe este documento!
    </div>
  )

  return (
    document
      ? <DocumentView document={document} />
      : <NotFound />
  )
}
