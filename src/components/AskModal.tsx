import { useContext, useState } from 'preact/hooks'
import { EarthstarContext } from '../contexts/Earthstar'
import { type JSX } from 'preact/jsx-runtime'
import { XIcon } from 'lucide-preact'
import { createNameId } from 'mnemonic-id'

type ModalType = 'identity' | 'share'

export function AskModal ({ type }: { type: ModalType }) {
  const earthstar = useContext(EarthstarContext)
  const [open, setOpen] = useState(true)

  const handleSubmit = async (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    // ? https://github.com/microsoft/TypeScript/issues/43797
    const data = new FormData(event.target as HTMLFormElement)
    console.debug('handleSubmit', data)
    await earthstar?.createPeer(data.get('password') as string)
    await earthstar?.createIdentity(data.get('name') as string)
    await earthstar?.createShare(createNameId({ delimiter: '' }))
  }

  const IdentityForm = () => (
    <form onSubmit={(event) => { void handleSubmit(event) }}>
      <h2 className='m-0 mb-4 text-center text-pretty'>Create your identity</h2>
      <div class='flex flex-col gap-4'>
        <section className='flex flex-col rounded-xl bg-light-1 p-3 shadow-sm focus:outline-accent focus:outline-offset-2'>
          <label for='name' className='text-xs text-dark-2'>Name</label>
          <input
            className='w-full w-full border-none bg-transparent text-base text-dark-5 font-normal focus:outline-none placeholder-dark-4/100'
            type='text' name='name' id='name' placeholder='vice' minlength={4} maxLength={4} required
          />
        </section>
        <section className='flex flex-col rounded-xl bg-light-1 p-3 shadow-sm focus:outline-accent focus:outline-offset-2'>
          <label for='password' className='text-xs text-dark-2'>Password</label>
          <input
            className='w-full w-full border-none bg-transparent text-base text-dark-5 font-normal focus:outline-none placeholder-dark-4/100'
            type='password' name='password' id='password' defaultValue='1234' minLength={8} required
          />
        </section>
        <button type='submit' class='cursor-pointer rounded-3xl border-none bg-accent py-2 text-lg text-white shadow-sm'>
          Submit
        </button>
      </div>
    </form>
  )

  return (
    <div class='fixed left-0 top-0 z-5 grid min-h-screen min-w-screen place-items-center bg-dark/20 shadow-xl'>
      <dialog
        className='w-sm rounded-3xl border-none bg-light-2 p-4 shadow-2xl'
        open={open}
      >
        <button class='ml-auto block cursor-pointer border-none bg-transparent text-black' onClick={() => { setOpen(false) }}>
          <XIcon />
        </button>
        <div class='p5 pt0'>
          <IdentityForm />
        </div>
      </dialog>
    </div>
  )
}
