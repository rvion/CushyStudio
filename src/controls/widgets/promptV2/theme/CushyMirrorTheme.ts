// 🟢
import { tags as t } from '@lezer/highlight'
import { createTheme } from '@uiw/codemirror-themes'

/* TODO: hook it up my theme system */
export const CushyMirrorTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#ffffff',
        backgroundImage: '',
        foreground: '#75baff',
        caret: '#5d00ff',
        selection: '#036dd626',
        selectionMatch: '#036dd626',
        lineHighlight: '#8a91991a',
        gutterBackground: '#fff',
        gutterForeground: '#8a919966',
    },
    styles: [
        { tag: t.punctuation, color: 'red' },
        { tag: t.comment, color: '#787b8099' },
        { tag: t.variableName, color: '#0080ff' },
        { tag: t.heading1, color: '#5c6166', class: 'bg-green-200' },
        { tag: [t.string, t.special(t.brace)], color: 'pink' },
        { tag: t.number, color: '#5c6166' },
        { tag: t.bool, color: '#5c6166' },
        { tag: t.null, color: '#5c6166' },
        { tag: t.keyword, color: '#5c6166' },
        { tag: t.operator, color: '#5c6166' },
        { tag: t.className, color: '#5c6166' },
        { tag: t.definition(t.typeName), color: '#5c6166' },
        { tag: t.typeName, color: '#5c6166' },
        { tag: t.angleBracket, color: '#5c6166' },
        { tag: t.tagName, color: '#5c6166' },
        { tag: t.attributeName, color: '#5c6166' },
    ],
})
