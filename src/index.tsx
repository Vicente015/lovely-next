import './globals.css'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso'
import { lazy, Suspense } from 'preact/compat'
import { NotFound } from './pages/_404.js'
import DocumentPage from './pages/doc/[name]'
import { HomePage } from './pages/home'
import StoreProvider from './contexts/Store'

// eslint-disable-next-line @typescript-eslint/promise-function-async
const EarthstarProvider = lazy(() => import('./contexts/Earthstar/Provider'))

function AppContent () {
  return (
    <Router>
      <Route path='/' component={HomePage} />
      <Route path='/doc/:id' component={DocumentPage} />
      <Route default component={NotFound} />
    </Router>
  )
}

export function App () {
  return (
    <LocationProvider>
      <div className='bg-light-2'>
        <Suspense fallback='Loading...'>
          <EarthstarProvider>
            <StoreProvider>
              <div class='m-auto h-full max-w-[90ch] min-h-screen w-full scroll-smooth rounded-md'>
                <AppContent />
              </div>
            </StoreProvider>
          </EarthstarProvider>
        </Suspense>
      </div>
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
