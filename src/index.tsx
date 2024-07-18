import './globals.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso'
import { NotFound } from './pages/_404.js'
import NavBar from './components/Navbar'
import DocumentPage from './pages/doc/[name]'
import { HomePage } from './pages/home'
import { EarthstarContext, EarthstarProvider } from './contexts/Earthstar'
import { useContext } from 'preact/hooks'
import { AskModal } from './components/AskModal'

function AppContent () {
  const earthstar = useContext(EarthstarContext)

  if (!earthstar?.peer.value) {
    return (
      <AskModal type='identity' />
    )
  }

  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path='/doc/*' component={DocumentPage} />
      <Route default component={NotFound} />
    </Router>
  )
}

export function App () {
  return (
    <LocationProvider>
      <main class="m-auto max-w-[90ch] min-h-screen w-full scroll-smooth rounded-md bg-light-2 lg:max-w-[100ch]">
        <NavBar />
        <EarthstarProvider>
          <AppContent />
        </EarthstarProvider>
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
