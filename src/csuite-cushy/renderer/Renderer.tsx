import type { Field } from '../../csuite/model/Field'
import type { ReactNode } from 'react'

// const customRender = (field: Field, p: RENDERER.FieldRenderArgs<any>): ReactNode => {
//     // const { Widget, Wrapper, readonly, label, renderCtx, ...renderProps } = p
//     const { ctx, baseRenderer, ...renderProps } = p
//     // 🔶 shouldn't it be presenter from context instead?
//     // => yes, for now Field.Render provides it to this function (in a very brittle way) via p.baseRenderer
//     const renderer = p.baseRenderer ?? getGlobalRenderer()
//     return renderer.extends(ctx).render(field, renderProps as any)
// }

const CushyRender = (p: { field: Field; p: RENDERER.FieldRenderArgs<any> }): ReactNode => {
    return null
}

window.RENDERER = {
    Render: CushyRender,
}
