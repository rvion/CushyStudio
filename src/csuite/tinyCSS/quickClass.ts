import { createHash } from 'crypto'
import { customAlphabet, nanoid } from 'nanoid'
import { type CSSProperties } from 'react'

import { addRule } from './compileOrRetrieveClassName'

const mkClassName = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

const cache: Record<string, string> = {}

export const compileOrRetrieveClassName = (appearance: CSSProperties): string => {
    const vals = JSON.stringify(appearance)
    const hash = createHash('md5').update(vals).digest('hex')
    if (hash in cache) return cache[hash]!

    const className = 'box-' + mkClassName()
    // console.log(`[🌈] `, `.${hash}`, appearance)
    const cssBlock = Object.entries(appearance)
        .map(([key, val]) => {
            // console.log(`[🌈] ---`, key, val)
            if (val == null) return ''
            return `${key}: ${val};`
        })
        .join('\n')

    addRule(`.${className}`, cssBlock)
    cache[hash] = className

    return className
}
