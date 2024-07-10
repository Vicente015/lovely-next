import {
  IdentityKeypair,
  Peer,
  RuntimeDriverUniversal,
  ShareKeypair,
  ValidationError,
} from '@earthstar/earthstar'
import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { StorageDriverIndexedDB } from '@earthstar/earthstar/browser'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { Suspense } from 'preact/compat'
import { signal } from '@preact/signals'
import { KeyringContext } from './Keyring.tsx'
import { SharesTable } from './Keyring.tsx'
import { IdentitiesTable } from './Keyring.tsx'

export type Earthstar = {
  peer: Peer
  identity: IdentityKeypair
  share: ShareKeypair
}

export const EarthstarContext = createContext<Earthstar | null>(null)

export function EarthstarProvider(
  props: { children: ComponentChildren },
) {
  if (!IS_BROWSER) {
    console.debug('not browser')
    return null
  }
  const keyring = useContext(KeyringContext)
  const peer = signal(
    new Peer({
      password: 'password',
      runtime: new RuntimeDriverUniversal(),
      storage: new StorageDriverIndexedDB(),
    }),
  )
  const [identity, setIdentity] = useState<IdentitiesTable | null>(null)
  const [share, setShare] = useState<SharesTable | null>(null)

  // todo: use tag as ids?? shortname by params
  const createIdentity = async (name = 'default') => {
    const newIdentity = await peer.value.createIdentity('vice')
    if (newIdentity instanceof ValidationError) {
      throw new Error(newIdentity.message)
    }
    const identity = {
      name,
      ...newIdentity,
    }
    await keyring?.identities.add(identity)
    return identity
  }

  const createShare = async (name = 'default') => {
    if (!identity) throw new Error('Identity needed')
    const newShare = await peer.value.createShare('main', false)
    if (newShare instanceof ValidationError) throw new Error(newShare.message)

    const share = {
      name,
      ...newShare,
    }
    await keyring?.shares.add(share)
    await peer.value.mintCap(share.tag, identity.tag, 'write')
    return share
  }

  useEffect(() => {
    async function getIdentity() {
      setIdentity(
        await keyring?.identities.get('default') ??
          await createIdentity(),
      )
    }
    async function getShare() {
      setShare(
        await keyring?.shares.get('default') ?? await createShare(),
      )
    }
    if (peer && !identity) getIdentity()
    if (peer && identity && !share) getShare()
  }, [keyring, identity])

  return (
    <Suspense fallback='loading...'>
      <EarthstarContext.Provider
        value={identity && peer && share
          ? {
            identity: identity as IdentitiesTable,
            peer: peer.value,
            share: share as SharesTable,
          }
          : null}
      >
        {props.children}
      </EarthstarContext.Provider>
    </Suspense>
  )
}
