import { type Document } from '@earthstar/earthstar'
import { useComputed, useSignal, useSignalEffect } from '@preact/signals'

const decoder = new TextDecoder()

export default function DocumentPreview ({ document }: { document: Document }) {
  const content = useSignal('')
  const title = useComputed(() => content.value
    .split('\n')
    .find((p) => p.startsWith('# '))
  )

  useSignalEffect(() => {
    async function fetch () {
      content.value = decoder.decode(await document.payload?.bytes())
    }
    void fetch()
  })

  return (
    <a
      role='article'
      href={`/doc/${document.path.format('base32')}`}
      class='rounded-3xl bg-light-1 p-5 shadow-light-3 shadow-md hover:shadow-light-4'
    >
      <h2 class='line-clamp-2 mb-2 text-pretty text-xl text-neutral-950 font-extrabold leading-none'>
        {title}
      </h2>
      <p class='line-clamp-8 text-balance text-neutral-600 leading-tight'>
        {content}
      </p>
    </a>
  )
}
