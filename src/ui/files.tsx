import { sample1 } from './sample1'

export const virtualFilesystem = {
    'a.ts': {
        name: 'a.ts',
        language: 'typescript',
        value: sample1,
    },
    'b.ts': {
        name: 'b.ts',
        language: 'typescript',
        value: 'export const BB = 1',
    },
    'c.ts': {
        name: 'c.ts',
        language: 'typescript',
        value: 'export const CC = 1',
    },
}
export type KnownFiles = keyof typeof virtualFilesystem
