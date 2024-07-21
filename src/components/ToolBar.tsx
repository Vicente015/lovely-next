import { ChevronDown, Link, PencilLine, Plus } from 'lucide-preact'

const Toolbar = () => (
  <div class='fixed bottom-0 left-0 w-full flex items-center justify-center gap-5 border-t-12 border-red-500 bg-light-300/60% p-5 space-x-4'>
    <section class='flex items-center space-x-2'>
      <div class='flex items-center'>
        <Plus class='h-8 w-8 text-black' />
        <ChevronDown class='text-black' />
      </div>
    </section>

    <section class='flex items-center space-x-2'>
      <div class='flex items-center'>
        <p class='text-black font-bold'>Normal</p>
        <ChevronDown class='text-black' />
      </div>
    </section>

    <section>
      <ToolbarButton>
        <PencilLine class='w- h-6 text-black' />
      </ToolbarButton>
      <ToolbarButton>
        <Link class='h-6 w-6 text-black' />
      </ToolbarButton>
    </section>
  </div>
)

const ToolbarButton = ({ children }) => (
  <button class='cursor-pointer border-none bg-transparent focus:outline-none'>
    {children}
  </button>
)

export default Toolbar
