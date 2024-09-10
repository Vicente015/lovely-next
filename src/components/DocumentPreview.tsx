import { type Document } from '@earthstar/earthstar'
import { useComputed, useSignal, useSignalEffect } from '@preact/signals'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter'

const decoder = new TextDecoder()

export default function DocumentPreview ({ document }: { document: Document }) {
  const content = useSignal('')
  const title = useComputed(() =>
    capitalizeFirstLetter(content.value
      .split('\n')
      .find((p) => p.startsWith('# '))
      ?.replace('# ', '') ?? ''
    )
  )
  const description = useComputed(() => capitalizeFirstLetter(
    content.value.split('\n').at(1) ?? '')
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
      class='rounded-2xl bg-light-1 px-5 py-6 shadow-light-3 shadow-md hover:shadow-light-4'
    >
      <h2 class='line-clamp-2 m-0 mb-2 p-0 text-balance text-pretty text-xl text-neutral-950 font-extrabold leading-none'>
        {title}
      </h2>
      <p class='line-clamp-6 m-0 break-all p-0 text-justify text-neutral-600 leading-tight'>
        {description}
      </p>
    </a>
  )
}
