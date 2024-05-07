import { statSync } from 'fs'
import { join } from 'pathe'

import { formatSize } from '../../db/getDBStats'

export async function _showESBUILDOutput(p: { prefix: string }) {
    for (const f of [p.prefix + '.js', p.prefix + '.meta.json']) {
        const size = statSync(join('@cushy/forms', f)).size
        console.log(`${f}: ${formatSize(size)} bytes`)
    }
}
