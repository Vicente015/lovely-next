import { MenuIcon, PlusIcon, SearchIcon } from 'npm:lucide-preact'
import { DocumentView } from '../islands/DocumentView.tsx'

const Header = () => (
  <header
    class={'sticky top-0 left-0 bg-light-2 bg-opacity-30 backdrop-filter backdrop-blur-md p-4 flex flex-row justify-between items-center'}
  >
    <div class={'flex gap-2'}>
      <PlusIcon />
      <SearchIcon />
    </div>
    <h1 class={'text-xl font-bold'}>
      Lovely
    </h1>
    <div>
      <MenuIcon />
    </div>
  </header>
)

export default function Home() {
  return (
    <div
      class={'w-full mb-8 scroll-smooth max-w-[90ch] lg:max-w-[100ch] m-auto rounded-md'}
    >
      <Header />
      <DocumentView />
    </div>
  )
}
