export default function DocumentPreview(
  props: { name: string; description: string },
) {
  return (
    <a
      role={'article'}
      href={`/document/prueba`}
      class={'sharp-fold bg-light-1 p-5 rounded-3xl shadow-md shadow-light-3 hover:shadow-light-4'}
    >
      <h2
        class={'text-neutral-950 line-clamp-2 text-pretty text-xl font-extrabold leading-none mb-2'}
      >
        {props.name}
      </h2>
      <p
        class={'text-neutral-600 text-balance line-clamp-[8] leading-tight'}
      >
        {props.description}
      </p>
    </a>
  )
}
