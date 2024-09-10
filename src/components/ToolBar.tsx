import { ChevronDown, Link, PencilLine, Plus, Heading1, Heading2, Heading3, Type, Quote, List } from 'lucide-preact'
import { type ReactElement, type FC } from 'preact/compat'
import { useState, useEffect, useRef } from 'preact/hooks'

const createOptions = [
  { icon: <PencilLine size={18} />, text: 'Opción 1' },
  { icon: <Link size={18} />, text: 'Opción 2' },
  { icon: <List size={18} />, text: 'Opción 3' },
  { icon: <List size={18} />, text: 'Opción 4' }
]

const textOptions = [
  { icon: <Heading1 size={18} />, text: 'Header 1' },
  { icon: <Heading2 size={18} />, text: 'Header 2' },
  { icon: <Heading3 size={18} />, text: 'Header 3' },
  { icon: <Type size={18} />, text: 'Monespace' },
  { icon: <Quote size={18} />, text: 'Quote' },
  { icon: <List size={18} />, text: 'List' }
]

const Toolbar = () => {
  const [activeButton, setActiveButton] = useState<'pencil' | 'link' | null>(null)

  return (
    <div class='fixed bottom-0 left-0 w-full flex items-center justify-center gap-5 border-t border-gray-300 bg-light-100 p-4 backdrop-blur-sm'>
      <div class='flex items-center space-x-4'>
        <ToolbarDropdown icon={<Plus class='h-6 w-6 text-black' />} options={createOptions} />
        <ToolbarDropdown label='Normal' icon={<Type class='ml-6 h-6 w-6 text-black' />} options={textOptions} />
      </div>

      <div class='w-8' />

      <section class='flex items-center space-x-2'>
        <ToolbarButton
          isActive={activeButton === 'pencil'}
          onClick={() => { setActiveButton(activeButton === 'pencil' ? null : 'pencil') }}
        >
          <PencilLine class={`h-6 w-6 ${activeButton === 'pencil' ? 'text-yellow-400' : 'text-black'}`} />
        </ToolbarButton>
        <ToolbarButton
          isActive={activeButton === 'link'}
          onClick={() => { setActiveButton(activeButton === 'link' ? null : 'link') }}
        >
          <Link class={`h-6 w-6 ${activeButton === 'link' ? 'text-blue-400' : 'text-black'}`} />
        </ToolbarButton>
      </section>
    </div>
  )
}

interface DropdownProps {
  icon?: ReactElement
  label?: string
  options: typeof textOptions
}

const ToolbarDropdown: FC<DropdownProps> = ({ icon, label, options }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div class='relative' ref={dropdownRef}>
      <button
        onClick={() => { setIsOpen(!isOpen) }}
        class='flex cursor-pointer items-center justify-between rounded-lg border-none bg-transparent px-4 py-2 transition-colors duration-200 hover:bg-gray-100 focus:outline-none' >
        {icon}
        {label && <span class='ml-2 text-sm text-gray-600'>{label}</span>}
        <ChevronDown class='h-4 w-4 text-black' />
      </button>
      {isOpen && (
        <div class='dropdown-content absolute bottom-full grid grid-cols-2 mb-6 mt-2 w-62 gap-1 border border-gray-300 rounded-lg bg-white'>
          {options.map((option, index) => (
            <button
              key={index}
              class='w-full flex items-center rounded-md border-none bg-light-1 px-4 py-2 text-left text-dark hover:bg-gray-100 focus:outline-none'
              onClick={() => { setIsOpen(false) }}
            >
              <span class='mr-2'>{option.icon}</span>
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ToolbarButton: FC<ToolbarButtonProps> = ({ children, isActive, onClick }) => (
  <button
    class={`flex cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-2 transition-colors duration-200 hover:bg-gray-100 focus:outline-none ${isActive ? 'bg-gray-200' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
)

export default Toolbar
