import './globals.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso'
import { Home } from './pages/Home/index.js'
import { NotFound } from './pages/_404.js'
import { MenuIcon, PlusIcon, SearchIcon } from 'lucide-preact'
import DocumentPreview from './components/DocumentPreview'
import NavBar from './components/Navbar'

export function App() {
  return (
    <LocationProvider>
      <NavBar />
      <main class="w-full mb-8 scroll-smooth max-w-[90ch] lg:max-w-[100ch] m-auto rounded-md min-h-screen bg-light-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <DocumentPreview key={index}/>
          ))}
        </div>
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

export async function prerender(data) {
  return await ssr(<App {...data} />)
}
