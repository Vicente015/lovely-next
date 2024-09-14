import * as ContextMenu from '@radix-ui/react-context-menu'
import { ClipboardPaste, Copy, Link } from 'lucide-preact'

const ContextMenuDemo = () => {
  return (
    <ContextMenu.Root >
      <ContextMenu.Trigger className='block w-[300px] select-none border-2 border-white rounded border-dashed py-[45px] text-center text-[15px] text-white'>
        Right-click here.
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className='min-w-[22px] overflow-hidden rounded-md bg-black p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'
          sideOffset={5}
          align='end'

        >
          <ContextMenu.Item className='group text-violet11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1'>
            Hipoerviculo{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              <Link size={12} />
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item className='group text-violet11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1'>
            Copiar{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              <Copy size={12} />
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item className='group text-violet11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1'>
            Pegar{' '}
            <div className='text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-5 group-data-[highlighted]:text-white'>
              <ClipboardPaste size={12} />
            </div>
          </ContextMenu.Item>

        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>

  )
}

export default ContextMenuDemo
