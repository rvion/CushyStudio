import type { BaseSchema } from './BaseSchema'
import type { Field } from './Field'

export type ISchema<out FIELD extends Field = Field> = BaseSchema<FIELD>
