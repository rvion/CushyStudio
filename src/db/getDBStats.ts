import type { LiveDB } from './LiveDB'

import { statSync } from 'fs'

import { formatSize } from '../csuite/utils/formatSize'
import { DB_RELATIVE_PATH } from './DB_CONFIG'

export type DBStats = { [key: string]: { count: number; size: number } }

export const getDBStats = (db: LiveDB): DBStats => {
   const stmt = db.db.prepare(`select name from sqlite_master where type='table'`)
   const tables = stmt.all() as { name: string }[]

   const dbStats: { [key: string]: { count: number; size: number } } = {}

   console.log(`[🕵️‍♂️] DB STATS`)
   for (const table of tables) {
      const count = db._getCount(table.name)
      const size = db._getSize(table.name)
      console.log(`[🕵️‍♂️] ${count.toString().padStart(10, ' ')} ${table.name} (${size})`)
      dbStats[table.name] = { count, size }
   }

   const fileSize = statSync(DB_RELATIVE_PATH).size
   console.log(`[🕵️‍♂️] db file on disk: ${formatSize(fileSize)}`)

   return dbStats
}
