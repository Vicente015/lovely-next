import {
  IdentityKeypair,
  Path,
  Peer,
  RuntimeDriverUniversal,
  ShareKeypair,
  ShareTag,
  ValidationError,
} from '@earthstar/earthstar'
import { ComponentChildren, createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { StorageDriverIndexedDB } from '@earthstar/earthstar/browser'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { lazy, Suspense } from 'preact/compat'
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js'
import { KeyringContext } from './Keyring.tsx'
import { db } from '$std/media_types/_db.ts'
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
  const peer = useSignal(
    new Peer({
      password: 'password',
      runtime: new RuntimeDriverUniversal(),
      storage: new StorageDriverIndexedDB(),
    }),
  )
  const [identity, setIdentity] = useState<IdentitiesTable | null>(null)
  const [share, setShare] = useState<SharesTable | null>(null)

  const createDefaultIdentity = async () => {
    const newIdentity = await peer.value.createIdentity('vice')
    if (newIdentity instanceof ValidationError) return null
    const identity = {
      name: 'default',
      ...newIdentity,
    }
    await keyring?.identities.add(identity)
    return identity
  }

  const createDefaultShare = async () => {
    const newShare = await peer.value.createShare('main', false)
    if (newShare instanceof ValidationError) return null
    const share = {
      name: 'default',
      ...newShare,
    }
    await keyring?.shares.add(share)
    return share
  }

  useEffect(() => {
    async function get() {
      setIdentity(
        await keyring?.identities.get('default') ??
          await createDefaultIdentity(),
      )

      setShare(
        await keyring?.shares.get('default') ?? await createDefaultShare(),
      )
    }
    get()
  }, [keyring])

  return (
    <Suspense fallback='loading...'>
      <EarthstarContext.Provider
        value={{
          identity: identity as IdentitiesTable,
          peer: peer.value,
          share: share as SharesTable,
        }}
      >
        {props.children}
      </EarthstarContext.Provider>
    </Suspense>
  )
}
