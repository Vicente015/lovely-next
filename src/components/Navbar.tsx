import { MenuIcon, PlusIcon, SearchIcon } from 'lucide-preact';

const NavBar = () => (
  <header class="sticky top-0 left-0 bg-light-2 bg-opacity-30 backdrop-filter text-black backdrop-blur-md p-4 flex flex-row justify-between items-center">
    <div class="flex gap-2">
      <PlusIcon />
      <SearchIcon />
    </div>
    <h1 class="text-xl font-bold">Lovely</h1>
    <div>
      <MenuIcon />
    </div>
  </header>
);

export default NavBar;
