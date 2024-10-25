import type { KyselyTables } from './db/TYPES.gen'

import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

// ---------------------------------------------------------------
const dialect = new SqliteDialect({
   // database: SQLite(DB_RELATIVE_PATH, { nativeBinding: 'node_modules/better-sqlite3/build/Release/better_sqlite3.node' }),
   database: new SQLite(':memory:', {
      nativeBinding: 'node_modules/better-sqlite3/build/Release/better_sqlite3.node',
   }),
})

export const kysely = new Kysely<KyselyTables>({
   dialect,
})

// DEBUG: // db
// DEBUG: const x = kysely
// DEBUG:     .selectFrom('media_image') //
// DEBUG:     .where('tags', 'like', '%cat%')
// DEBUG:     .selectAll()
// DEBUG:     .compile()
// DEBUG:
// DEBUG: console.log(`[🤠] x=`, x)
// DEBUG:
// DEBUG: // ---------------------------------------------------------------
// DEBUG: // https://kysely.dev/docs/recipes/splitting-query-building-and-execution
// DEBUG: const db2 = new Kysely<KyselyTables>({
// DEBUG:     dialect: {
// DEBUG:         createAdapter: () => new SqliteAdapter(),
// DEBUG:         createDriver: () => new DummyDriver(),
// DEBUG:         createIntrospector: (db) => new SqliteIntrospector(db),
// DEBUG:         createQueryCompiler: () => new SqliteQueryCompiler(),
// DEBUG:     },
// DEBUG: })
// DEBUG:
// DEBUG: const KK = db2.selectFrom('media_3d_displacement')
// DEBUG:
// DEBUG: const x2 = db2
// DEBUG:     .selectFrom('media_image') //
// DEBUG:     .where('tags', 'like', '%cat%')
// DEBUG:     // .selectAll()
// DEBUG:     .select((x) => x.fn.countAll<number>().as('count'))
// DEBUG:
// DEBUG: type T = InferResult<typeof x2>
// DEBUG: console.log(`[🤠] x2=`, x2)
// DEBUG:
