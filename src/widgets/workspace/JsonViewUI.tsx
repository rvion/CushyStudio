import JsonView from '@uiw/react-json-view'
import { observer } from 'mobx-react-lite'

export const JsonViewUI = observer(function JsonViewUI_(p: { value?: Maybe<object> }) {
    // mobx hack to make the widget react to any change in the value
    JSON.stringify(p.value)
    return (
        <JsonView
            shortenTextAfterLength={100}
            style={_githubDarkTheme as any}
            value={p.value ?? {}} //example}
            enableClipboard={false}
        />
    )
})

const _githubDarkTheme = {
    '--w-rjv-font-family': 'monospace',
    '--w-rjv-color': '#79c0ff',
    '--w-rjv-key-string': '#79c0ff',
    '--w-rjv-background-color': '#0d1117',
    '--w-rjv-line-color': '#94949480',
    '--w-rjv-arrow-color': '#ccc',
    '--w-rjv-edit-color': 'var(--w-rjv-color)',
    '--w-rjv-info-color': '#7b7b7b',
    '--w-rjv-update-color': '#ebcb8b',
    '--w-rjv-copied-color': '#79c0ff',
    '--w-rjv-copied-success-color': '#28a745',
    '--w-rjv-curlybraces-color': '#8b949e',
    '--w-rjv-colon-color': '#c9d1d9',
    '--w-rjv-brackets-color': '#8b949e',
    '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
    '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',
    '--w-rjv-type-string-color': '#a5d6ff',
    '--w-rjv-type-int-color': '#79c0ff',
    '--w-rjv-type-float-color': '#79c0ff',
    '--w-rjv-type-bigint-color': '#79c0ff',
    '--w-rjv-type-boolean-color': '#ffab70',
    '--w-rjv-type-date-color': '#79c0ff',
    '--w-rjv-type-url-color': '#4facff',
    '--w-rjv-type-null-color': '#ff7b72',
    '--w-rjv-type-nan-color': '#859900',
    '--w-rjv-type-undefined-color': '#79c0ff',
}
