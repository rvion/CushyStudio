import type { widgetsCatalog } from './widgets-catalog'

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
    namespace CATALOG {
        type variants = { [k in AllFieldTypes]: CatalogVariants<k> }

        /** closed union to help typescript proove that exhaustiveness */
        type AllFieldTypes =
            | 'optional'
            | 'str'
            | 'group'
            | 'selectOne'
            | 'selectMany'
            | 'file'
            | 'bool'
            | 'button'
            | 'choices'
            | 'color'
            | 'date'
            | 'date'
            | 'plaindate'
            | 'datetimezoned'
            | 'link'
            | 'list'
            | 'markdown'
            | 'matrix'
            | 'number'
            | 'seed'
            | 'shared'
            | 'size'
    }
}
