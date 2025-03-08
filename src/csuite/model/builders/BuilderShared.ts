import type { PartialOmit } from '../../../types/Misc'
import type { Field } from '../Field'

import { Field_link } from '../../fields/link/FieldLink'
import { Field_shared } from '../../fields/shared/FieldShared'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

type Config<A extends CSchema, B extends CSchema> = PartialOmit<
   Field_link<A, B>['$config'],
   'share' | 'children'
>

export type BuilderSharedMixin = {
   with<const SA extends CSchema, SB extends CSchema>(
      injected: SA,
      children: (shared: SA['$field']) => SB,
      config?: Config<SA, SB>,
   ): Z.Link<SA, SB>
   linked<T extends Field>(field: T): Z.Shared<T>
}

const BuilderSharedImpl = (): BuilderSharedMixin =>
   defineSchemaBuilderMixin({
      /**
       * Allow to instanciate a field early, so you can re-use it in multiple places
       * or access it's instance to dynamically change some other field schema.
       *
       * @since 2024-06-27
       * @stability unstable
       */
      with<const SA extends CSchema, SB extends CSchema>(
         /** the schema of the field you'll want to re-use the in second part */
         injected: SA,
         children: (shared: SA['$field']) => SB,
         config: Config<SA, SB> = {},
      ): Z.Link<SA, SB> {
         return CSchema.new(Field_link<SA, SB>, { share: injected, children, ...config })
      },

      linked<T extends Field>(field: T): Z.Shared<T> {
         return CSchema.new(Field_shared<T>, { field })
      },
   })

export const BuilderSharedDescriptors = Object.getOwnPropertyDescriptors(BuilderSharedImpl())
