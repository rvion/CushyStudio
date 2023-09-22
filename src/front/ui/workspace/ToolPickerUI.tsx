import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, Popover, SelectPicker, Whisper } from 'rsuite'
import { DraftL } from 'src/models/Draft'
import { useSt } from '../../FrontStateCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'

export const ToolPickerUI = observer(function ToolPickerUI_(p: { draft: DraftL }) {
    const st = useSt()
    const draft = p.draft
    const tools = st.toolsSorted
    return (
        <div>
            {/*  */}
            <SelectPicker
                //
                data={tools}
                size='sm'
                labelKey='name'
                valueKey='id'
                value={draft.data.toolID}
                onChange={(v) => {
                    if (v == null) return
                    draft.update({ toolID: v })
                }}
            />
            {/* SHOW TOOL CODE */}
            {draft.tool.item?.data.codeTS && (
                <Whisper
                    enterable
                    placement='autoVerticalStart'
                    speaker={
                        <Popover>
                            <TypescriptHighlightedCodeUI code={draft.tool.item?.data.codeTS} />
                        </Popover>
                    }
                >
                    <IconButton size='sm' icon={<I.Code />} appearance='subtle' />
                </Whisper>
            )}
        </div>
    )
})
