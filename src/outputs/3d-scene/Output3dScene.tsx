import type { MediaCustomL } from '../../models/MediaCustom'

// import * as drei from '@react-three/drei'
// import * as fiber from '@react-three/fiber'
import { observer } from 'mobx-react-lite'

// import * as react from 'react'
// import { createElement } from 'react'
// import { Fragment } from 'react/jsx-runtime'
// import * as three from 'three'
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { CushyErrorBoundarySimpleUI } from '../../controls/shared/CushyErrorBoundarySimple'
import { StepL } from '../../models/Step'
import { MessageErrorUI } from '../../panels/MessageUI'
// @ts-ignore
import { jsx, jsxs } from '../../utils/custom-jsx/jsx-runtime'
import { OutputPreviewWrapperUI } from '../OutputPreviewWrapperUI'

export const Output3dScenePreviewUI = observer(function Output3dScenePreviewUI_(p: {
    step?: Maybe<StepL>
    output: MediaCustomL
}) {
    const st = cushy
    const size = st.historySize
    const sizeStr = st.historySizeStr
    return (
        <OutputPreviewWrapperUI size={size} output={p.output}>
            <div
                tw={['bg-blue-500 text-black', 'text-center w-full font-bold']}
                style={{ lineHeight: sizeStr, fontSize: `${size / 3}px` }}
            >
                {p.output.view?.def.preview(p.output.data.params) ?? '❓'}
            </div>
        </OutputPreviewWrapperUI>
    )
})

export const Output3dSceneUI2 = observer(function Output3dSceneUI2_(p: {
    //
    step?: Maybe<StepL>
    output: MediaCustomL
}) {
    const view = p.output.view
    if (view == null) {
        console.log(`[🤠] script:`, p.output.script)
        console.log(`[🤠] relPath:`, p.output.relPath)
        return (
            <MessageErrorUI
                markdown={`impossible to load custom view\n\`\`\`\n${JSON.stringify(p.output.data, null, 3)}\n\`\`\`\``}
            />
        )
    }
    return (
        <div tw='flex-1 relative'>
            <div tw='absolute top-0 opacity-35 pointer-events-none z-50'>
                <div tw='text-xs'>{JSON.stringify(p.output.data.params)}</div>
                <div tw='text-xs'>{JSON.stringify({ viewID: p.output.data.viewID })}</div>
            </div>
            <CushyErrorBoundarySimpleUI>
                {view.def.render(p.output.data.params)}
                {/* <react.Suspense fallback={<div tw='loading loading-spinner' />}>
                    <RenderSceneUI //
                        code={p.output.data.code ?? ''}
                        data={p.output.data.params ?? {}}
                    />
                </react.Suspense> */}
            </CushyErrorBoundarySimpleUI>
        </div>
    )
})

export const RenderSceneUI = observer(function RenderSceneUI_(p: { render: (params: Record<string, any>) => JSX.Element }) {
    return 1
})
// export const RenderSceneUI = observer(function RenderSceneUI_(p: {
//     //
//     // code: string
//     // data: Record<string, any>
// }) {
//     console.log(`[🤠] url2===`, JSON.stringify(p.data, null, 3))
//     console.log(p.code)
//     return
//     return new Function(
//         // injet libs
//         'p',
//         'data',
//         // 'Fragment',
//         // 'jsx',
//         // 'jsxs',
//         // 'createElement',
//         [
//             //
//             `const fn = ${p.code}`,
//             `const UI = () => fn(p, data)`,
//             `return createElement(UI)`,
//         ].join('\n'),
//     )(
//         { drei, fiber, three, react, OBJLoader, MTLLoader } /* deps */,
//         p.data /* custom props */,
//         /* react stuff */
//         Fragment,
//         jsx,
//         jsxs,
//         createElement,
//     )
// })
