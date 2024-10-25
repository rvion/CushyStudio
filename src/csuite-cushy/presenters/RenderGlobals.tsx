import type { Field } from '../../csuite/model/Field'
import type { WidgetsCatalog } from './RenderCatalog'
import type { DisplayConf, RuleOrConf } from './Renderer'
import type { FC } from 'react'

export type CatalogVariants<N extends CATALOG.AllFieldTypes> = any

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
   namespace RENDERER {
      interface FieldRenderArgs<out FIELD extends Field> extends DisplayConf<FIELD> {}
      type UIConf<FIELD extends Field> = RuleOrConf<FIELD>
   }

   interface Window {
      RENDERER: {
         Render: FC<{ field: Field; p: RENDERER.FieldRenderArgs<any> }>
      }
   }

   namespace CATALOG {
      type variants = { [k in AllFieldTypes]: CatalogVariants<k> }
      type widgets = WidgetsCatalog
      /** closed union to help typescript proove variance by checking all branches */
      type AllFieldTypes =
         | 'optional'
         | 'str'
         | 'group'
         | 'selectOne'
         | 'selectMany'
         | 'bool'
         | 'button'
         | 'choices'
         | 'color'
         | 'custom'
         | 'date'
         | 'date'
         | 'plaindate'
         | 'datetimezoned'
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
