import { type ComponentChildren } from 'preact'
import Toolbar from '../../components/ToolBar'
import { useContext } from 'preact/hooks'
import { StoreContext } from '../../contexts/Store'
import { type Document, type Path } from '@earthstar/earthstar'
import { useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { ChevronLeftIcon, EllipsisVerticalIcon, MenuIcon, PanelLeftDashedIcon } from 'lucide-preact'

const decoder = new TextDecoder()

const NavBar = ({ title }: { title: string }) => {
  return (
    <nav class='sticky left-0 top-0 flex flex-row items-center justify-between bg-light-2 bg-opacity-30 py-1 text-black backdrop-blur-md backdrop-filter'>
      <div class='flex gap-2'>
        <ChevronLeftIcon />
        <PanelLeftDashedIcon />
      </div>
      <span>{title}</span>
      <div class='flex flex-row items-center gap-2'>
        <EllipsisVerticalIcon />
        <MenuIcon />
      </div>
    </nav>
  )
}

const TextSection = ({ children }: { children: ComponentChildren }) => (
  <p class='mb-4 text-2xl text-neutral-600 leading-tight'>
    {children}
  </p>
)

function DocumentView ({ document }: { document: Document }) {
  const content = useSignal([''])

  useSignalEffect(() => {
    async function fetch () {
      if (!document?.payload) return
      content.value = decoder.decode(await document.payload.bytes()).split('\n')
    }
    void fetch()
  })

  const title = useComputed(() => content.value.find(p => p.startsWith('# ')))
  const paragraphs = useComputed(() => {
    content.value.shift()
    return content.value
  })

  return (
    <>
      <NavBar title={title.value ?? 'Untitled'} />
      <div class='mx-auto max-w-2xl p-6'>
        <h1 class='line-clamp-2 mb-4 text-pretty text-3xl text-neutral-950 font-bold font-antique' autoFocus contentEditable>
          {title}
        </h1>
        <div className='text-balance font-transitional' contentEditable>
          {paragraphs.value.map((paragraph, index) => (
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

export default function DocumentPage ({ id }: { id: Path }) {
  const store = useContext(StoreContext)

  const document = store?.documents.value.get(id)

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
