import { ChevronLeft, EllipsisVertical, Menu } from 'lucide-preact';

export default function DocumentPage() {
  return (
    <div>
      <header>
        class={'sticky top-0 left-0 bg-light-2 bg-opacity-30 backdrop-filter backdrop-blur-md p-4 flex flex-row justify-between items-center'}
        <div class={'flex gap-2'}>
          <ChevronLeft />
        </div>
        <h1 class={'text-xl font-bold'}>
          Lorem ipsum
        </h1>
        <div>
          <EllipsisVertical />
          <Menu />
        </div>
      </header>
    </div>
  )
}
