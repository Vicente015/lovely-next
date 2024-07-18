import {
  type Peer,
  ValidationError
} from '@earthstar/earthstar'
import { type ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { signal } from '@preact/signals'
import {
  KeyringContext,
  type SharesTable,
  type IdentitiesTable
} from './Keyring'

export type EarthstarState = ReturnType<typeof useEarthstarState>

function useEarthstarState () {
  const keyring = useContext(KeyringContext)
  const peer = signal<Peer | null>(null)
  const identity = signal<IdentitiesTable | null>(null)
  const share = signal<SharesTable | null>(null)

  const createIdentity = async (shortname: string) => {
    if (peer.value === null) throw new Error('Peer needed')
    const peerIdentity = await peer.value.createIdentity(shortname)
    if (peerIdentity instanceof ValidationError) {
      throw new Error(peerIdentity.message)
    }
    const newIdentity: IdentitiesTable = {
      name: shortname,
      ...peerIdentity
    }
    await keyring.identities.add(newIdentity)
    identity.value = newIdentity
  }

  // todo: Can only contain numbers and lowercase letters and must start with a letter.
  // min/max: 4 characters
  // todo: Support communal shares
  const createShare = async (shortname: string) => {
    if (peer.value === null) throw new Error('Peer needed')
    if (identity.value === null) throw new Error('Identity needed')
    const peerShare = await peer.value.createShare(shortname, false)
    if (peerShare instanceof ValidationError) throw new Error(peerShare.message)

    const newShare: SharesTable = {
      name: shortname,
      ...peerShare
    }
    await keyring.shares.add(newShare)
    await peer.value.mintCap(newShare.tag, identity.value.tag, 'write')
    share.value = newShare
  }

  return { identity, share, peer, createIdentity, createShare }
}

export const EarthstarContext = createContext<EarthstarState | null>(null)

export function EarthstarProvider (
  props: { children: ComponentChildren }
) {
  return (
    <EarthstarContext.Provider
      value={useEarthstarState()}
    >
      {props.children}
    </EarthstarContext.Provider>
  )
}
