import * as I from '@rsuite/icons'
import * as R from 'src/controls/InfoRequest'

import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'
import { Tooltip, Whisper } from 'rsuite'
import { WidgetPromptUI } from '../../../prompter/WidgetPromptUI'
import { exhaust } from '../../../utils/ComfyUtils'
import { useDraft } from '../useDraft'
import { ErrorBoundaryFallback } from '../utils/ErrorBoundary'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetItemsOptUI } from './WidgetItemsOptUI'
import { WidgetItemsUI } from './WidgetItemsUI'
import { WidgetListUI } from './WidgetListUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetMatrixUI } from './WidgetMatrixUI'
import { WidgetNumOptUI } from './WidgetNumOptUI'
import { WidgetNumUI } from './WidgetNumUI'
import { WidgetSelectImageUI } from './WidgetSelectImageUI'
import { WidgetStrOptUI } from './WidgetStrOptUI'
import { WidgetStrUI } from './WidgetStrUI'
import { WigetSizeUI } from './WidgetSizeUI'

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    req: R.Requestable
    rootKey: string
    vertical?: boolean
}) {
    const { rootKey, req } = p
    const draft = useDraft()
    let tooltip: Maybe<string>
    let label: Maybe<string>
    // const fullPath = p.path.join('/')
    label = req.input.label ?? rootKey
    tooltip = req.input.tooltip
    // if (fullPath !== label) tooltip = `${fullPath} ${tooltip ?? ''}`
    return (
        <div
            // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
            className={
                p.vertical //
                    ? 'flex flex-col items-baseline'
                    : 'flex flex-row gap-2 items-baseline'
            }
            key={rootKey}
        >
            <div
                className={
                    p.vertical //
                        ? 'min-w-max shrink-0'
                        : 'min-w-max shrink-0 text-right'
                }
            >
                {tooltip && (
                    <Whisper placement='topStart' speaker={<Tooltip>{tooltip}</Tooltip>}>
                        <I.InfoOutline className='mr-2 cursor-pointer' />
                    </Whisper>
                )}
                {label}
            </div>
            <ErrorBoundary
                FallbackComponent={ErrorBoundaryFallback}
                onReset={(details) => {
                    /* 🔴 */
                }}
            >
                <WidgetUI req={req} />
            </ErrorBoundary>
        </div>
    )
})

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
export const WidgetUI = observer(function WidgetUI_(p: { req: R.Requestable; focus?: boolean }) {
    const req = p.req
    // widgets
    if (req instanceof R.Requestable_int) return <WidgetNumUI req={req} />
    if (req instanceof R.Requestable_intOpt) return <WidgetNumOptUI req={req} />
    if (req instanceof R.Requestable_float) return <WidgetNumUI req={req} />
    if (req instanceof R.Requestable_floatOpt) return <WidgetNumOptUI req={req} />
    if (req instanceof R.Requestable_str) return <WidgetStrUI req={req} />
    if (req instanceof R.Requestable_strOpt) return <WidgetStrOptUI req={req} />
    if (req instanceof R.Requestable_image) return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Requestable_imageOpt) return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Requestable_list) return <WidgetListUI req={req} />
    if (req instanceof R.Requestable_group) return <WidgetItemsUI req={req} />
    if (req instanceof R.Requestable_groupOpt) return <WidgetItemsOptUI req={req} />
    if (req instanceof R.Requestable_size) return <WigetSizeUI req={req} />
    if (req instanceof R.Requestable_enum) return <WidgetEnumUI req={req} />
    if (req instanceof R.Requestable_enumOpt) return <WidgetEnumUI req={req} />
    if (req instanceof R.Requestable_matrix) return <WidgetMatrixUI req={req} />
    if (req instanceof R.Requestable_bool) return <WidgetBoolUI req={req} />
    if (req instanceof R.Requestable_boolOpt) return <WidgetBoolUI req={req} />
    if (req instanceof R.Requestable_prompt) return <WidgetPromptUI req={req} />
    if (req instanceof R.Requestable_promptOpt) return <WidgetPromptUI req={req} />
    if (req instanceof R.Requestable_loras) return <WidgetLorasUI req={req} />
    if (req instanceof R.Requestable_selectMany) return <>TODO</>
    if (req instanceof R.Requestable_selectManyOrCustom) return <>TODO</>
    if (req instanceof R.Requestable_selectOne) return <>TODO</>
    if (req instanceof R.Requestable_selectOneOrCustom) return <>TODO</>

    exhaust(req)
    console.log(`🔴`, (req as any).type)
    return <div>{JSON.stringify(req)} not supported </div>
})
