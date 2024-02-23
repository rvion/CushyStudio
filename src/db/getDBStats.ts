import { statSync } from 'fs'

import { DB_RELATIVE_PATH } from './DB_CONFIG'
import { LiveDB } from './LiveDB'

export const getDBStats = async (db: LiveDB) => {
    const stmt = db.db.prepare(`select name from sqlite_master where type='table'`)
    const tables = stmt.all() as { name: string }[]

    console.log(`[🕵️‍♂️] DB STATS`)
    for (const table of tables) {
        const count = db._getCount(table.name)
        console.log(`[🕵️‍♂️] ${count.toString().padStart(10, ' ')} ${table.name}`)
    }

    const fileSize = statSync(DB_RELATIVE_PATH).size
    console.log(`[🕵️‍♂️] db file on disk: ${formatSize(fileSize)}`)
}

export const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`

    const kb = size / 1024
    if (kb < 1024) return `${kb.toFixed(2)} KB`

    const mb = kb / 1024
    if (mb < 1024) return `${mb.toFixed(2)} MB`

    const gb = mb / 1024
    if (gb < 1024) return `${gb.toFixed(2)} GB`

    const tb = gb / 1024
    if (tb < 1024) return `${tb.toFixed(2)} TB`

    const pb = tb / 1024
    if (pb < 1024) return `${pb.toFixed(2)} PB`

    return `${pb.toFixed(2)} PB`
}
