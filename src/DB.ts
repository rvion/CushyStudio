import type { KyselyTables } from './db/TYPES.gen'

import SQLite from 'better-sqlite3'
import {
    DummyDriver,
    type InferResult,
    Kysely,
    SqliteAdapter,
    SqliteDialect,
    SqliteIntrospector,
    SqliteQueryCompiler,
} from 'kysely'

import { DB_RELATIVE_PATH } from './db/DB_CONFIG'

// ---------------------------------------------------------------
const dialect = new SqliteDialect({
    database: SQLite(DB_RELATIVE_PATH, { nativeBinding: 'node_modules/better-sqlite3/build/Release/better_sqlite3.node' }),
    // database: new SQLite(':memory:'),
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const dbxx = new Kysely<KyselyTables>({
    dialect,
})

// db
const x = dbxx
    .selectFrom('media_image') //
    .where('tags', 'like', '%cat%')
    .selectAll()
    .compile()

console.log(`[🤠] x=`, x)

// ---------------------------------------------------------------
// https://kysely.dev/docs/recipes/splitting-query-building-and-execution
const db2 = new Kysely<KyselyTables>({
    dialect: {
        createAdapter: () => new SqliteAdapter(),
        createDriver: () => new DummyDriver(),
        createIntrospector: (db) => new SqliteIntrospector(db),
        createQueryCompiler: () => new SqliteQueryCompiler(),
    },
})

const KK = db2.selectFrom('media_3d_displacement')

const x2 = db2
    .selectFrom('media_image') //
    .where('tags', 'like', '%cat%')
    // .selectAll()
    .select((x) => x.fn.countAll<number>().as('count'))

type T = InferResult<typeof x2>
console.log(`[🤠] x2=`, x2)
