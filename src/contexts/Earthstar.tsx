import {
  type SharesTable,
  type IdentitiesTable
  , KeyringContext
} from './Keyring'
import { type Signal, useSignal, useSignalEffect } from '@preact/signals'
import { isErr, Peer, RuntimeDriverUniversal, ValidationError } from '@earthstar/earthstar'
import { StorageDriverIndexedDB } from '@earthstar/earthstar/browser'
import { useContext } from 'preact/hooks'
import { type ComponentChildren, createContext } from 'preact'

export interface EarthstarState {
  identity: Signal<IdentitiesTable | null | false>
  share: Signal<SharesTable | null>
  peer: Signal<Peer | null>
  createIdentity: (shortname: string) => Promise<IdentitiesTable>
  createShare: (shortname: string) => Promise<SharesTable>
  createPeer: (password: string, existing?: boolean) => Promise<Peer>
}

export const EarthstarContext = createContext<EarthstarState | null>(null)

export function EarthstarProvider (
  props: { children: ComponentChildren }
) {
  const keyring = useContext(KeyringContext)
  const peer = useSignal<Peer | null>(null)
  const identity = useSignal<IdentitiesTable | null | false>(null)
  const share = useSignal<SharesTable | null>(null)

  console.debug('earthstar initialized')

  // todo: think about ways to store the password // compatibility with passkeys?!
  const createPeer = async (password: string, existing = false) => {
    if (peer.value) throw new Error('Peer already exists')
    const newPeer = new Peer({
      password,
      runtime: new RuntimeDriverUniversal(),
      storage: new StorageDriverIndexedDB()
    })
    if (!existing) await keyring.peer.add({ password })
    peer.value = newPeer
    return newPeer
  }

  const createIdentity = async (shortname: string) => {
    if (!peer.value) throw new Error('Peer needed')
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
    return newIdentity
  }

  const addExistingIdentity = async (existingIdentity: IdentitiesTable) => {
    if (peer.value === null) throw new Error('Peer needed')
    await peer.value.addExistingIdentity({ secretKey: existingIdentity.secretKey, tag: existingIdentity.tag })
    identity.value = existingIdentity
    return identity
  }

  // todo: Can only contain numbers and lowercase letters and must start with a letter.
  // min/max: 4 characters
  // todo: Support communal shares
  const createShare = async (shortname: string) => {
    if (!peer.value) throw new Error('Peer needed')
    if (!identity.value) throw new Error('Identity needed')
    const peerShare = await peer.value.createShare(shortname, false)
    if (peerShare instanceof ValidationError) throw new Error(peerShare.message)

    const newShare: SharesTable = {
      name: shortname,
      ...peerShare
    }

    await keyring.shares.add(newShare)
    console.debug('mintCap',
      newShare.tag,
      identity.value.tag
    )
    const cap = await peer.value.mintCap(newShare.tag, identity.value.tag, 'write')

    if (isErr(cap)) throw cap
    share.value = newShare
    return newShare
  }

  const addExistingShare = async (existingShare: SharesTable) => {
    if (!peer.value) throw new Error('Peer needed')
    if (!identity.value) throw new Error('Identity needed')
    await peer.value.addExistingShare({ secretKey: existingShare.secretKey, tag: existingShare.tag })
    share.value = existingShare
  }

  useSignalEffect(() => {
    async function setDefaultValues () {
      const keyringPeer = (await keyring.peer.toArray()).at(0)
      if (!keyringPeer) return
      await createPeer(keyringPeer.password, true)
      console.debug('loaded peer', keyringPeer)

      const keyringIdentity = (await keyring.identities.toArray()).at(0)
      if (!keyringIdentity) {
        identity.value = false
        return
      }
      await addExistingIdentity(keyringIdentity)
      console.debug('loaded identity', identity.value)

      const keyringShare = (await keyring.shares.toArray()).at(0)
      if (!keyringShare) {
        await createShare('default')
      } else {
        await addExistingShare(keyringShare)
      }
    }
    void setDefaultValues()
  })

  return (
    <EarthstarContext.Provider
      value={{ share, createIdentity, createPeer, createShare, identity, peer }}
    >
      {props.children}
    </EarthstarContext.Provider>
  )
}
