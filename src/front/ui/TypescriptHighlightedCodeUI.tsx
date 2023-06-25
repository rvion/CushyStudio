import * as I from '@rsuite/icons'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/stackoverflow-dark.css'
import { useLayoutEffect, useRef } from 'react'
import { Panel } from 'rsuite'

hljs.registerLanguage('typescript', typescript)

export const TypescriptHighlightedCodeUI = (p: { code: string }) => {
    const ref = useRef(null)
    useLayoutEffect(() => {
        const e = ref.current
        if (e == null) return
        hljs.highlightElement(e)
    }, [ref])
    return (
        // <Panel
        //     collapsible
        //     shaded
        //     header={
        //         <div>
        //             <I.Code /> Code
        //         </div>
        //     }
        // >
        <code className='language-typescript text-xs' style={{ whiteSpace: 'pre-wrap' }} ref={ref}>
            {p.code}
        </code>
        // </Panel>
    )
}

// export const HTMLtHighlightedCodeUI = (p: { code: string; className?: string }) => {
//     return (
//         <code
//             className={cls('language-xml', p.className)}
//             style={{
//                 fontFamily: 'monospace',
//                 fontSize: '1rem',
//                 whiteSpace: 'pre-wrap',
//                 display: 'block',
//                 padding: '.5rem',
//             }}
//             ref={(e) => {
//                 if (e == null) return
//                 if (!(e instanceof HTMLElement)) return
//                 hljs.highlightElement(e)
//             }}
//         >
//             {p.code}
//         </code>
//     )
// }
