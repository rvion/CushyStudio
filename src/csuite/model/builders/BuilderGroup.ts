import type { NO_PROPS } from '../../types/NO_PROPS'
import type { FieldConstructor } from '../FieldConstructor'
import type { SchemaDict } from '../SchemaDict'

import { Field_group, type Field_group_config } from '../../fields/group/FieldGroup'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

// prettier-ignore
export type BuilderGroupMixin = {
   group<T extends SchemaDict>(config?: Field_group_config<T>): Z.Record<T>;
   fields<T extends SchemaDict>(items: T | (() => T), config?: Omit<Field_group_config<T>, "items">): Z.Record<T>;
   empty(config?: Field_group_config<NO_PROPS>): Z.Empty;
   row<T extends SchemaDict>(items: T | (() => T), config?: Omit<Field_group_config<T>, "items">): Z.Record<T>;
   column<T extends SchemaDict>(items: T | (() => T), config?: Omit<Field_group_config<T>, "items">): Z.Record<T>;
}

const BuilderGroupImpl = (): BuilderGroupMixin =>
   defineSchemaBuilderMixin({
      /** see also: `fields` for a more practical api */
      group<T extends SchemaDict>(config: Field_group_config<T> = {}): Z.Record<T> {
         // 💬 2025-02-03 rvion:
         // the cast here is just so we can pretend at the type level that the class have the MAGICFIELDS
         // defined at construction (whici it does via manual Object.defineProperty in the constructor!)
         const CTOR = Field_group as FieldConstructor<Field_group<T>>
         const groupSchema = CSchema.new(CTOR, config)

         // make sure lazy lambdas are only executed once.
         const items = groupSchema.config.items
         if (typeof items === 'function')
            groupSchema.config.items = (): T => {
               const subSchema = items()
               groupSchema.config.items = subSchema
               return subSchema
            }

         return groupSchema as Z.Record<T>
      },

      fields<T extends SchemaDict>(
         items: T | (() => T),
         config: Omit<Field_group_config<T>, 'items'> = {},
      ): Z.Record<T> {
         return this.group({ items, ...config })
      },

      empty(config: Field_group_config<NO_PROPS> = {}): Z.Empty {
         return this.group(config)
      },

      /** @deprecated */
      row<T extends SchemaDict>(
         items: T | (() => T),
         config: Omit<Field_group_config<T>, 'items'> = {},
      ): Z.Record<T> {
         return this.fields(items, config)
      },

      /** @deprecated */
      column<T extends SchemaDict>(
         items: T | (() => T),
         config: Omit<Field_group_config<T>, 'items'> = {},
      ): Z.Record<T> {
         return this.fields(items, config)
      },
   })

export const BuilderGroupDescriptors: Record<string, PropertyDescriptor> =
   Object.getOwnPropertyDescriptors(BuilderGroupImpl())
