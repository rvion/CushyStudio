import type { Field_bool } from '../../csuite/fields/bool/FieldBool'
import type { Field_choices } from '../../csuite/fields/choices/FieldChoices'
import type { Field_color } from '../../csuite/fields/color/FieldColor'
import type { Field_custom } from '../../csuite/fields/custom/FieldCustom'
import type { Field_date } from '../../csuite/fields/date/FieldDate'
import type { Field_enum } from '../../csuite/fields/enum/FieldEnum'
import type { Field_group } from '../../csuite/fields/group/FieldGroup'
import type { Field_image } from '../../csuite/fields/image/FieldImage'
import type { Field_link } from '../../csuite/fields/link/FieldLink'
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
import type { DisplaySlots } from './RenderSlots'
import type { FieldUIConf } from './RenderTypes'
import type { FC } from 'react'

export type CatalogVariants<N extends CATALOG.AllFieldTypes> = any

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
   namespace RENDERER {
      type UIConf<FIELD extends Field> = FieldUIConf<FIELD>
      interface FieldRenderArgs<out FIELD extends Field> extends DisplaySlots<FIELD> {
         rule?: FieldUIConf<FIELD>
      }
   }

   interface Window {
      RENDERER: {
         Render: FC<{ field: Field } & RENDERER.FieldRenderArgs<any>>
      }
   }

   namespace CATALOG {
      type variants = { [k in AllFieldTypes]: CatalogVariants<k> }
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
         custom: typeof Field_custom
         date: typeof Field_date
         enum: typeof Field_enum
         image: typeof Field_image
         link: typeof Field_link
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
         | 'custom'
         | 'date'
         | 'enum'
         | 'image'
         | 'link'
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
