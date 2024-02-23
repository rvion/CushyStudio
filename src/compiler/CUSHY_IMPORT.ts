import * as fs from 'fs'
import * as mobx from 'mobx'
import { observer } from 'mobx-react-lite'
import __react from 'react'

// @ts-ignore
import { jsx, jsxs } from 'src/utils/custom-jsx/jsx-runtime'

export const CUSHY_IMPORT = (mod: string) => {
    console.log('🔴 mod', mod)
    if (mod === 'react') return __react
    if (mod === 'mobx') return mobx
    if (mod === 'fs') return fs
    if (mod === 'mobx-react-lite') return { observer: observer }
    if (mod === 'react/jsx-runtime') return { jsx, jsxs }
    throw new Error('unsupported import: ' + mod)
}
