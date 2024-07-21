import { type ComponentChildren, type FunctionComponent, createContext } from 'preact'
import { Dexie, type EntityTable } from 'dexie'
import { type IdentityKeypair, type ShareKeypair } from '@earthstar/earthstar'

const DB_NAME = 'keyring'

type IdentitiesTable = IdentityKeypair & {
  name: string
}

type SharesTable = ShareKeypair & {
  name: string
}

interface PeerTable {
  id: string
  password: string
}

type DexieDatabase = Dexie & {
  identities: EntityTable<IdentitiesTable, 'name'>
  shares: EntityTable<SharesTable, 'name'>
  peer: EntityTable<PeerTable, 'id'>
}

const db = new Dexie(DB_NAME) as DexieDatabase
// todo: change index to auto incremental?
// so we can get the first by .get(1)
db.version(1).stores({
  identities: '++name',
  shares: '++name',
  peer: '++id,&password'
})

export const KeyringContext = createContext<DexieDatabase>(db)

export const KeyringProvider = (
  props: { children: ComponentChildren | FunctionComponent | Element }
) => {
  return (
    <KeyringContext.Provider value={db}>
      {props.children}
    </KeyringContext.Provider>
  )
}

export type { DexieDatabase, IdentitiesTable, SharesTable, PeerTable }
