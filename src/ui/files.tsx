import { a__ } from './samples/a'
import { b__ } from './samples/b'

export const virtualFilesystem = {
    'a.ts': {
        name: 'a.ts',
        language: 'typescript',
        value: a__,
    },
    'b.ts': {
        name: 'b.ts',
        language: 'typescript',
        value: b__,
    },
    'c.ts': {
        name: 'c.ts',
        language: 'typescript',
        value: 'export const CC = 1',
    },
}
export type KnownFiles = keyof typeof virtualFilesystem
