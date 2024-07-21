import {
  type Peer
} from '@earthstar/earthstar'
import { createContext } from 'preact'
import { type Signal } from '@preact/signals'
import {
  type SharesTable,
  type IdentitiesTable
} from '../Keyring'

export interface EarthstarState {
  identity: Signal<IdentitiesTable | null>
  share: Signal<SharesTable | null>
  peer: Signal<Peer | null>
  createIdentity: (shortname: string) => Promise<IdentitiesTable>
  createShare: (shortname: string) => Promise<SharesTable>
  createPeer: (password: string, existing?: boolean) => Promise<Peer>
}

const EarthstarContext = createContext<EarthstarState | null>(null)

export default EarthstarContext
