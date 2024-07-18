import { useContext } from 'preact/hooks'
import { EarthstarContext } from '../contexts/Earthstar'

type ModalType = 'identity' | 'share'

export function AskModal ({ type }: { type: ModalType }) {
  const earthstar = useContext(EarthstarContext)

  const handleIdentity = () => {

  }

  const IdentityForm = () => (
    <form onSubmit={handleIdentity}>
      <h2 className='text-center text-pretty'>Create your identity</h2>
      <section className='flex flex-col rounded-lg bg-light-3 px-2 py-4'>
        <label for='name' className='text-sm text-dark-5'>Name</label>
        <input type="text" name="name" id="name" placeholder='John' min={4} max={4} className='w-full w-full border-none bg-transparent text-black' />
      </section>
    </form>
  )

  return (
    <dialog
      className='max-w-[75ch] rounded-3xl border-none bg-light-1 p-8'
      open
    >
      <IdentityForm />
    </dialog>
  )
}
