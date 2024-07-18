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

type DexieDatabase = Dexie & {
  identities: EntityTable<IdentitiesTable, 'name'>
  shares: EntityTable<SharesTable, 'name'>
}

const db = new Dexie(DB_NAME) as DexieDatabase
db.version(1).stores({
  identities: '++name',
  shares: '++name'
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

export type { DexieDatabase, IdentitiesTable, SharesTable }
