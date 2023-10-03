import * as I from '@rsuite/icons'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/stackoverflow-dark.css'
import { useLayoutEffect, useRef } from 'react'
import { Panel } from 'rsuite'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)

export const TypescriptHighlightedCodeUI = (p: { code: string }) => {
    const ref = useRef(null)
    useLayoutEffect(() => {
        const e = ref.current
        if (e == null) return
        hljs.highlightElement(e)
    }, [ref, p.code])
    return (
        <code className='language-typescript text-xs' style={{ whiteSpace: 'pre-wrap' }} ref={ref}>
            {p.code}
        </code>
    )
}

export const JSONHighlightedCodeUI = (p: { code: string }) => {
    const ref = useRef(null)
    useLayoutEffect(() => {
        const e = ref.current
        if (e == null) return
        hljs.highlightElement(e)
    }, [ref, p.code])
    return (
        <code className='language-json text-xs' style={{ whiteSpace: 'pre-wrap' }} ref={ref}>
            {p.code}
        </code>
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
