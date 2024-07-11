import './globals.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso'
import { NotFound } from './pages/_404.js'
import NavBar from './components/Navbar'
import DocumentPage from './pages/doc/[name]'
import { HomePage } from './pages/home'

export function App () {
  return (
    <LocationProvider>
      <main class="m-auto max-w-[90ch] min-h-screen w-full scroll-smooth rounded-md bg-light-2 lg:max-w-[100ch]">
        <NavBar />
        <Router>
          <Route path="/" component={HomePage} />
          <Route default component={NotFound} />
          <Route component={DocumentPage} path='/doc/*' />
        </Router>
      </main>
    </LocationProvider>
  )
}

if (typeof window !== 'undefined') {
  // @ts-expect-error Needs types
  hydrate(<App />, document.getElementById('app'))
}

// @ts-expect-error Needs types
export async function prerender (data) {
  return await ssr(<App {...data} />)
}
