import 'highlight.js/styles/stackoverflow-light.css'

import React from 'react'

import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
// languages
import xml from 'highlight.js/lib/languages/xml'

import { cls } from './cls'
import { Panel } from 'rsuite'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)

export const TypescriptHighlightedCodeUI = (p: { code: string }) => {
    return (
        <Panel>
            <code
                className='language-typescript'
                style={{ fontFamily: 'monospace', fontSize: '1rem', whiteSpace: 'pre-wrap' }}
                ref={(e) => {
                    if (e == null) return
                    if (!(e instanceof HTMLElement)) return
                    hljs.highlightElement(e)
                }}
            >
                {p.code}
            </code>
        </Panel>
    )
}

export const HTMLtHighlightedCodeUI = (p: { code: string; className?: string }) => {
    return (
        <code
            className={cls('language-xml', p.className)}
            style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                whiteSpace: 'pre-wrap',
                display: 'block',
                padding: '.5rem',
            }}
            ref={(e) => {
                if (e == null) return
                if (!(e instanceof HTMLElement)) return
                hljs.highlightElement(e)
            }}
        >
            {p.code}
        </code>
    )
}
