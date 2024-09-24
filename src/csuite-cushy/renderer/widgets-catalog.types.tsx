import type { Field } from '../../csuite/model/Field'
import type { widgetsCatalog } from './widgets-catalog'
import type { Renderer } from 'marked'
import type { ReactNode } from 'react'

// import type { ReactNode } from 'react'

export type WidgetsCatalog = typeof widgetsCatalog
// type A = Parameters<Catalog['Field_select']['rsuite']>[0]

type VariantPropsDict<T extends { [k: string]: (p: any) => any }> = {
    [k in keyof T]?: Omit<Parameters<T[k]>[0], 'field'>
}

// type C = ParamDict<Catalog['Field_select']>
export type CatalogVariants<N extends CATALOG.AllFieldTypes> = any
// export type CatalogVariants<N extends CATALOG.AllFieldTypes> = N extends keyof WidgetsCatalog
//     ?
//           | (VariantPropsDict<WidgetsCatalog[N]> & { name?: keyof WidgetsCatalog[N] } & UsualWidgetProps & UsualWrapperProps)
//           | keyof WidgetsCatalog[N]
//           // ex: ui => <div>foo</div>
//           // TODO: ui => <ui.Rsuite rsuiteSelectProps={{ appearance: 'subtle'}} />
//           | ((ui: any) => ReactNode)
//     :
//           | ({ name?: '❌ NO CATALOG FOR THIS FIELD TYPE' } & UsualWidgetProps & UsualWrapperProps)
//           | '❌ NO CATALOG FOR THIS FIELD TYPE'

// type E = CatalogParams<'Field_select'>
// type F = CatalogParams<'group'>

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace RENDERER {
        interface FieldRenderArgs<out FIELD extends Field> {}

        // prettier-ignore
        //   type RendererConfig =
        //       & RendererArgsWidgets
        //       & UsualWrapperProps
        //       & UsualWidgetProps
    }

    interface Window {
        RENDERER: {
            render(field: Field, p: RENDERER.FieldRenderArgs<any>): ReactNode
            useRenderer(props?: RENDERER.FieldRenderArgs<any>): Renderer
        }
    }

    namespace CATALOG {
        type variants = { [k in AllFieldTypes]: CatalogVariants<k> }

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
