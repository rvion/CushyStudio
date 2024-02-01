import { observer } from 'mobx-react-lite'
import { Widget_cmprompt } from './WidgetPromptV2'
import { CushyMirrorTheme } from './theme/CushyMirrorTheme'

import { Tree } from '@lezer/common'
import CodeMirror from '@uiw/react-codemirror'
import { isObservableProp, makeAutoObservable } from 'mobx'
import { useMemo } from 'react'
import { parser } from './grammar/grammar.parser'
import { mycustomlanguage } from './grammar/grammar.xxx'
import { generatePromptCombinations } from './compiler/promptsplit'

class CMPromptState {
    constructor(public widget: Widget_cmprompt) {
        makeAutoObservable(this)
    }

    // -------------------------
    get text() { return this.widget.serial.val ?? '' } // prettier-ignore
    set text(val: string) { this.widget.serial.val = val } // prettier-ignore
    setText = (text: string) => {
        console.log(`[👙] `, text)
        this.text = text
        console.log(`[👙] this.debug=`, this.debugView)
    }

    // -------------------------
    get parsedTree(): Maybe<Tree> {
        console.log(`[👙]`, parser.parse(this.text))
        return parser.parse(this.text)
    }

    // -------------------------
    get debugView() {
        if (this.parsedTree === null) return null
        console.log(`[👙] evaluating 🔶`)
        let OUT: string[] = []
        let self = this
        let depth = 0
        this.parsedTree!.iterate({
            leave(nodeType) {
                depth--
            },
            enter(nodeType) {
                depth++
                OUT.push(
                    [
                        `${new Array(depth - 1).fill('|   ').join('')}| ${nodeType.name}`,
                        nodeType.name === 'Identifier' ? JSON.stringify(self.text.slice(nodeType.from, nodeType.to)) : '',
                        `(${nodeType.from} -> ${nodeType.to})`,
                    ].join(' '),
                )
            },
        })
        return OUT.join('\n')
    }

    // -------------------------
    get compiled(): string[] {
        return generatePromptCombinations(this.text!)
    }
}

// UI
export const WidgetCMPromptUI = observer(function WidgetStringUI_(p: { widget: Widget_cmprompt }) {
    const widget = p.widget
    const val = widget.result
    const uist = useMemo(() => new CMPromptState(widget), [])
    return (
        <div tw='flex flex-col'>
            editor:
            <CodeMirror
                value={uist.text}
                theme={CushyMirrorTheme}
                onChange={uist.setText}
                height='200px'
                extensions={[mycustomlanguage()]}
                // onUpdate={(view) => {
                //     const text = view.state.doc.toString()
                //     state.text = text
                // }}
            />
            debug:
            <pre tw='virtualBorder text-sm bg-base-200'>{uist.debugView}</pre>
            output:
            <pre tw='virtualBorder text-sm bg-base-200'>{uist.compiled.join('\n')}</pre>
        </div>
    )
})
