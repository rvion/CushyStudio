import type { StepL } from 'src/models/Step'

import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Popover, SelectPicker, Whisper } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { DraftL } from 'src/models/Draft'

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

export const ActionSuggestionUI = observer(function ActionSuggestionUI_(p: { draft: DraftL }) {
    const st = useSt()
    const step = p.draft
    if (step.tool.item.name !== '--') return null
    return (
        <div className='flex gap-1 items-baseline flex-wrap'>
            suggestions:
            {st.toolsSorted.slice(0, 8 /* 🔴 */).map((a) => {
                return (
                    <Button
                        //
                        key={a.id}
                        size='xs'
                        appearance='ghost'
                        onClick={() => step.update({ toolID: a.id })}
                    >
                        <div>{a.data.name}</div>
                    </Button>
                )
            })}
        </div>
    )
})
