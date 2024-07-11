export default function DocumentPreview() {
  return (
    <a
      role="article"
      href={`/document/prueba`}
      class="bg-light-1 p-5 rounded-3xl shadow-md shadow-light-3 hover:shadow-light-4"
    >
      <h2 class="text-neutral-950 line-clamp-2 text-pretty text-xl font-extrabold leading-none mb-2">
        Document
      </h2>
      <p class="text-neutral-600 text-balance line-clamp-[8] leading-tight">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, ipsum deleniti doloremque minima earum esse quo porro animi ad quisquam libero, quasi rem iure ab error numquam dolor? Reiciendis, veniam.
      </p>
    </a>
  )
}
