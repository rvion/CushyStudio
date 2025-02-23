import type { Field } from './Field'

export type Klass<FIELD extends Field> = { new (...args: any[]): FIELD }
