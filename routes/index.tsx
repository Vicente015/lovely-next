import { MenuIcon, PlusIcon, SearchIcon } from "npm:lucide-preact";
import Document from "../components/Document.tsx";

const Header = () => (
  <header
    class={"sticky top-0 left-0 bg-light-2 bg-opacity-30 backdrop-filter backdrop-blur-md p-4 flex flex-row justify-between items-center"}
  >
    <div class={"flex gap-2"}>
      <PlusIcon />
      <SearchIcon />
    </div>
    <h1 class={"text-xl font-bold"}>
      Papel
    </h1>
    <div>
      <MenuIcon />
    </div>
  </header>
);

const documents = Array(24).fill(0);

const Main = () => (
  <main
    class={"max-w-[75ch] lg:max-w-[85ch] px-8 sm:px-6 md:p-0 m-auto mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 transition-all"}
  >
    {documents.map(() => <Document />)}
  </main>
);

export default function Home() {
  return (
    <div
      class={"w-full mb-8 scroll-smooth max-w-[90ch] lg:max-w-[100ch] m-auto rounded-md"}
    >
      <Header />
      <Main />
    </div>
  );
}
