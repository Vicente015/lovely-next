import './globals.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso'
import { Home } from './pages/Home/index.js'
import { NotFound } from './pages/_404.js'
import { MenuIcon, PlusIcon, SearchIcon } from 'lucide-preact'

const NavBar = () => (
  <header
    class='sticky left-0 top-0 flex flex-row items-center justify-between bg-light-2 bg-opacity-30 p-4 backdrop-blur-md backdrop-filter'
  >
    <div class='flex gap-2'>
      <PlusIcon />
      <SearchIcon />
    </div>
    <h1 class='text-xl font-bold'>
      Lovely
    </h1>
    <div>
      <MenuIcon />
    </div>
  </header>
)

export function App () {
  return (
    <LocationProvider>
      <NavBar />
      <main class='m-auto mb-8 max-w-[90ch] min-h-screen w-full scroll-smooth rounded-md bg-light-2 font-systemui lg:max-w-[100ch]'>
        <Router>
          <Route path="/" component={Home} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  )
}

if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app'))
}

export async function prerender (data) {
  return await ssr(<App {...data} />)
}
