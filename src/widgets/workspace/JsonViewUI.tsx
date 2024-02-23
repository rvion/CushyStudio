import JsonView from '@uiw/react-json-view'
// import JsonViewEditor from '@uiw/react-json-view/editor'
import { lightTheme } from '@uiw/react-json-view/light'
// import { darkTheme } from '@uiw/react-json-view/dark'
// import { nordTheme } from '@uiw/react-json-view/esm/theme/nord'
// import { githubLightTheme } from '@uiw/react-json-view/esm/theme/github.light'
// import { githubDarkTheme } from '@uiw/react-json-view/esm/theme/github.dark'
// import { vscodeTheme } from '@uiw/react-json-view/esm/theme/vscode'
// import { gruvboxTheme } from '@uiw/react-json-view/esm/theme/gruvbox'
// import { monokaiTheme } from '@uiw/react-json-view/esm/theme/monokai'
// import { basicTheme } from '@uiw/react-json-view/esm/theme/basic'
// import { TriangleArrow } from '@uiw/react-json-view/triangle-arrow'
// import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow'
import { observer } from 'mobx-react-lite'

import { useSt } from 'src/state/stateContext'

export const JsonViewUI = observer(function JsonViewUI_(p: { value?: Maybe<object> }) {
    const st = useSt()
    JSON.stringify(p.value)
    return (
        <JsonView
            shortenTextAfterLength={100}
            style={st.themeMgr.theme === 'light' ? lightTheme : (_githubDarkTheme as any)}
            value={p.value ?? {}} //example}
            enableClipboard={false}
        />
    )
})

const avatar = 'https://i.imgur.com/MK3eW3As.jpg'
const longArray = new Array(1000).fill(1)
const example = {
    avatar,
    string: 'Lorem ipsum dolor sit amet',
    integer: 42,
    float: 114.514,
    bigint: 10086n,
    null: null,
    undefined,
    timer: 0,
    date: new Date('Tue Sep 13 2022 14:07:44 GMT-0500 (Central Daylight Time)'),
    array: [19, 100.86, 'test', NaN, Infinity],
    nestedArray: [
        [1, 2],
        [3, 4],
    ],
    object: {
        'first-child': true,
        'second-child': false,
        'last-child': null,
    },
    longArray,
    string_number: '1234',
}

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
