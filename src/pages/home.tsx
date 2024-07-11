import DocumentPreview from '../components/DocumentPreview'

export function HomePage () {
  return (
    <main
      class='grid grid-cols-1 m-auto mb-12 mt-4 max-w-[75ch] gap-6 px-8 transition-all md:grid-cols-4 sm:grid-cols-2 lg:max-w-[85ch] md:p-0 sm:px-6'
    >
      {Array.from({ length: 12 }).map((_, index) => (
          <DocumentPreview key={index} />
      ))}
    </main>
  )
}
