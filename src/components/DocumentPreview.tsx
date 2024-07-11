export default function DocumentPreview () {
  return (
    <a
      role="article"
      href={'/doc/prueba'}
      class="rounded-3xl bg-light-1 p-5 shadow-light-3 shadow-md hover:shadow-light-4"
    >
      <h2 class="line-clamp-2 mb-2 text-pretty text-xl text-neutral-950 font-extrabold leading-none">
        Document
      </h2>
      <p class="line-clamp-8 text-balance text-neutral-600 leading-tight">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, ipsum deleniti doloremque minima earum esse quo porro animi ad quisquam libero, quasi rem iure ab error numquam dolor? Reiciendis, veniam.
      </p>
    </a>
  )
}
