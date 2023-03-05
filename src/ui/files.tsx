import { a__ } from './samples/a'
import { b__ } from './samples/b'
import { c__ } from './samples/c'

export const virtualFilesystem = {
    'a.ts': {
        name: 'a.ts',
        language: 'typescript',
        value: a__,
    },
    // 'b.ts': {
    //     name: 'b.ts',
    //     language: 'typescript',
    //     value: b__,
    // },
    // 'c.ts': {
    //     name: 'c.ts',
    //     language: 'typescript',
    //     value: c__,
    // },
}
export type KnownFiles = keyof typeof virtualFilesystem
