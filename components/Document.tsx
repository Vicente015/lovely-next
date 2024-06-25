export default function Document() {
  return (
    <a
      role={"article"}
      href={`/document/prueba`}
      class={"sharp-fold bg-light-1 p-5 rounded-3xl shadow-md shadow-light-3 hover:shadow-light-4"}
    >
      <h2
        class={"text-neutral-950 line-clamp-2 text-pretty text-xl font-extrabold leading-none mb-2"}
      >
        Documento
      </h2>
      <p
        class={"text-neutral-600 text-balance line-clamp-[8] leading-tight"}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde dolore
        consectetur excepturi optio facere odio modi voluptatibus, iure soluta
        porro obcaecati mollitia nulla iste necessitatibus iusto sapiente maxime
        eaque provident. Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Incidunt facere omnis explicabo tenetur veniam. Aspernatur
        praesentium aliquid, perferendis quae optio accusantium architecto
        perspiciatis tempore consectetur pariatur nihil fuga deleniti
        blanditiis!
      </p>
    </a>
  );
}
