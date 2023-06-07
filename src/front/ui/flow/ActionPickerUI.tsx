import type { StepL } from 'src/models/Step'

import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Popover, SelectPicker, Whisper } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'

export const ActionPickerUI = observer(function ActionPickerUI_(p: { step: StepL }) {
    const st = useSt()
    const step = p.step
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
                value={step.data.toolID}
                onChange={(v) => {
                    if (v == null) return
                    step.update({ toolID: v })
                }}
            />
            {/* SHOW TOOL CODE */}
            {step.tool.item?.data.codeTS && (
                <Whisper
                    enterable
                    placement='autoHorizontalStart'
                    speaker={
                        <Popover>
                            <TypescriptHighlightedCodeUI code={step.tool.item?.data.codeTS} />
                        </Popover>
                    }
                >
                    <IconButton size='sm' icon={<I.Code />} appearance='subtle' />
                </Whisper>
            )}
        </div>
    )
})

export const ActionSuggestionUI = observer(function ActionSuggestionUI_(p: { step: StepL }) {
    const st = useSt()
    const step = p.step
    if (step.tool.id != null) return null
    return (
        <div className='flex gap-1 items-baseline'>
            suggestions:
            {step.data.toolID == null
                ? st.toolsSorted.slice(0, 3 /* 🔴 */).map((a) => {
                      return (
                          <Button key={a.id} size='xs' appearance='ghost' onClick={() => step.update({ toolID: a.id })}>
                              <div>{a.data.name}</div>
                          </Button>
                      )
                  })
                : null}
        </div>
    )
})
