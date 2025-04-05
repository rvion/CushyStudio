/* eslint-disable @typescript-eslint/no-namespace */
import type { Field_bool } from '../../csuite/fields/bool/FieldBool'
import type { Field_choices } from '../../csuite/fields/choices/FieldChoices'
import type { Field_color } from '../../csuite/fields/color/FieldColor'
import type { Field_date } from '../../csuite/fields/date/FieldDate'
import type { Field_enum } from '../../csuite/fields/enum/FieldEnum'
import type { Field_group } from '../../csuite/fields/group/FieldGroup'
import type { Field_image } from '../../csuite/fields/image/FieldImage'
import type { Field_list } from '../../csuite/fields/list/FieldList'
import type { Field_markdown } from '../../csuite/fields/markdown/FieldMarkdown'
import type { Field_matrix } from '../../csuite/fields/matrix/FieldMatrix'
import type { Field_number } from '../../csuite/fields/number/FieldNumber'
import type { Field_optional } from '../../csuite/fields/optional/FieldOptional'
import type { Field_orbit } from '../../csuite/fields/orbit/FieldOrbit'
import type { Field_seed } from '../../csuite/fields/seed/FieldSeed'
import type { Field_selectMany } from '../../csuite/fields/selectMany/FieldSelectMany'
import type { Field_selectOne } from '../../csuite/fields/selectOne/FieldSelectOne'
import type { Field_shared } from '../../csuite/fields/shared/FieldShared'
import type { Field_size } from '../../csuite/fields/size/FieldSize'
import type { Field_string } from '../../csuite/fields/string/FieldString'
import type { Field } from '../../csuite/model/Field'
import type { Field_prompt } from '../../prompt/FieldPrompt'
import type { WidgetsCatalog } from './RenderCatalog'
import type { RenderProps } from './RenderProps'
import type { RenderRule } from './RenderRule'
import type { FC } from 'react'

declare global {
   namespace RENDERER {
      // what is passed to `uiui` in the config
      type UIConf<FIELD extends Field> = RenderProps<FIELD> | RenderRule<Z.AnyField>[]

      // props given to <field.UI ... /> (not including field)
      type FieldRenderArgs<FIELD extends Field> = RenderProps<FIELD>
   }

   interface Window {
      // renderer entrypoint that should be injected once for every project;
      // src/csuite-cushy/presenters/Renderer.tsx in cushy
      RENDERER: {
         Render: FC<{ field: Field } & RENDERER.FieldRenderArgs<any>>
      }
   }

   namespace CATALOG {
      type widgets = WidgetsCatalog
      /** closed union to help typescript proove variance by checking all branches */

      type AllFields = {
         optional: typeof Field_optional
         str: typeof Field_string
         group: typeof Field_group
         selectOne: typeof Field_selectOne
         selectMany: typeof Field_selectMany
         bool: typeof Field_bool
         choices: typeof Field_choices
         color: typeof Field_color
         date: typeof Field_date
         enum: typeof Field_enum
         image: typeof Field_image
         list: typeof Field_list
         markdown: typeof Field_markdown
         matrix: typeof Field_matrix
         number: typeof Field_number
         orbit: typeof Field_orbit
         seed: typeof Field_seed
         shared: typeof Field_shared
         size: typeof Field_size
         prompt: typeof Field_prompt
      }

      type AllFieldTypes =
         | 'optional'
         | 'str'
         | 'group'
         | 'selectOne'
         | 'selectMany'
         | 'bool'
         | 'choices'
         | 'color'
         | 'date'
         | 'enum'
         | 'image'
         | 'list'
         | 'markdown'
         | 'matrix'
         | 'number'
         | 'orbit'
         | 'seed'
         | 'shared'
         | 'size'
         | 'prompt'
   }
}
