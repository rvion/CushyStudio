import { type CSSProperties } from 'react'

import { customAlphabet } from 'nanoid'
import SparkMD5 from 'spark-md5'

import { addRule } from './compileOrRetrieveClassName'

const mkClassName = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

const cache: Record<string, string> = {}

export const compileOrRetrieveClassName = (appearance: CSSProperties): string => {
    const vals = JSON.stringify(appearance)
    const uid = SparkMD5.hash(vals)
    if (uid in cache) return cache[uid]!

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
    cache[uid] = className

    return className
}
