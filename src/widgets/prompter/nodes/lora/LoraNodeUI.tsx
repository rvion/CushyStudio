import type { LoraNode } from './LoraNode'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { observer } from 'mobx-react-lite'
import { Popover, Whisper } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { LoraBoxUI } from './LoraBoxUI'

export const LoraNodeUI = observer(function LoraNodeUI_(p: { node: LoraNode }) {
    const node = p.node
    const [editor] = useLexicalComposerContext()
    const def = node.loraDef
    const st = useSt()

    const loraMetadata = st.configFile.value?.loraPrompts?.[def.name]
    const associatedText = loraMetadata?.text ?? ''
    // const associatedUrl = loraMetadata?.url ?? ''

    return (
        <Whisper enterable placement='bottom' speaker={<Popover></Popover>}>
            <span
                //
                style={{ border: '1px solid #747474' }}
                className='text-blue-400 rv-tooltip-container p-1'
            >
                {def.name}:{def.strength_model}:{def.strength_clip} ✨
                {associatedText ? `+ "${associatedText}"` : <span tw='text-red-500'>no associated text</span>}
            </span>
            <LoraBoxUI def={def} onDelete={() => editor.update(() => node.remove())} />
        </Whisper>
    )
})
