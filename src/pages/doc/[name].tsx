import { useState } from 'preact/hooks'
import Toolbar from '../../components/ToolBar'

// + Para evitar la duplicidad de clases ...
const TextSection = ({ children }) => (
  <p class="line-clamp-8 mb-4 text-balance text-2xl text-neutral-600 leading-tight">
    {children}
  </p>
)

// - Provisional
const DocumentContent = ({ title, paragraphs }) => (
  <div class="mx-auto max-w-2xl p-6">
    <h1 class="line-clamp-2 mb-4 text-pretty text-3xl text-neutral-950 font-extrabold">
      {title}
    </h1>
    {paragraphs.map((paragraph, index) => (
      <TextSection key={index}>{paragraph}</TextSection>
    ))}
  </div>
)

export default function DocumentPage () {
  //! Lo dejo en true por defecto para poder debuggear bien
  const [showToolbar, setShowToolbar] = useState(true)

  // ? No recuerdo la logica que querias, no se si al hacer clic en un boton de la NavBar o con menu contextual.
  const toggleToolbar = () => {
    setShowToolbar(!showToolbar)
  }

  const title = 'Lorem Ipsum'
  const paragraphs = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore disputandum putant. Sed ut iis bonis erigimur, quae expectamus, sic laetamur iis, quae et terroribus cupiditatibusque detractis et omnium falsarum opinionum temeritate derepta certissimam se nobis ducem praebeat ad voluptatem. Sapientia enim est a Chrysippo praetermissum in.',
    'Omnes, fatendum est summum esse bonum iucunde vivere. Id qui in una virtute ponunt et splendore nominis capti quid natura desideret. Tum vero, si stabilem scientiam rerum tenebimus, servata illa, quae quasi titillaret sensus, ut ita dicam, et ad corpus nihil referatur.',
    'Ibidem homo acutus, cum illud ocurreret, si omnia deorsus et regione ferrentur et, ut dixi, ad lineam, numquam fore ut aliqua remaneret eadem vis in corpora. Quae quidem sapientes sequuntur duce natura tamquam videntes; alterum autem hoc posterius neglegentur.'
  ]

  return (
    <div class="p-4 text-black">
      <DocumentContent title={title} paragraphs={paragraphs} />
      {showToolbar && <Toolbar />}
    </div>
  )
}
