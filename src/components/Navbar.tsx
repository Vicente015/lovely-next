import { MenuIcon, PlusIcon, SearchIcon } from 'lucide-preact'

const NavBar = () => (
  <header class="sticky left-0 top-0 flex flex-row items-center justify-between bg-light-2 bg-opacity-30 py-1 text-black backdrop-blur-md backdrop-filter">
    <div class="flex gap-2">
      <PlusIcon />
      <SearchIcon />
    </div>
    <h1 class="text-xl font-bold">Lovely</h1>
    <div>
      <MenuIcon />
    </div>
  </header>
)

export default NavBar
