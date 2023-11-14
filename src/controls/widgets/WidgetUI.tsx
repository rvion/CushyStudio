import * as R from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { Message } from 'rsuite'
import { exhaust } from '../../utils/misc/ComfyUtils'
import { WidgetPromptUI } from '../../widgets/prompter/WidgetPromptUI'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetChoiceUI } from './WidgetChoiceUI'
import { WidgetChoicesUI } from './WidgetChoicesUI'
import { WidgetColorUI } from './WidgetCololrUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetGroupUI } from './WidgetIGroupUI'
import { WidgetListUI } from './WidgetListUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetMardownUI } from './WidgetMarkdownUI'
import { WidgetMatrixUI } from './WidgetMatrixUI'
import { WidgetNumOptUI } from './WidgetNumOptUI'
import { WidgetNumUI } from './WidgetNumUI'
import { WidgetSeedUI } from './WidgetSeedUI'
import { WidgetSelectImageUI } from './WidgetSelectImageUI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'
import { WigetSizeUI } from './WidgetSizeUI'
import { WidgetStrUI } from './WidgetStrUI'

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
// prettier-ignore
export const WidgetUI = observer(function WidgetUI_(p: { req: R.Widget; focus?: boolean }) {
    const req = p.req
    if (req == null) return <>NULL</>
    if (req instanceof R.Widget_seed)               return <WidgetSeedUI        req={req} />
    if (req instanceof R.Widget_int)                return <WidgetNumUI         req={req} />
    if (req instanceof R.Widget_intOpt)             return <WidgetNumOptUI      req={req} />
    if (req instanceof R.Widget_float)              return <WidgetNumUI         req={req} />
    if (req instanceof R.Widget_floatOpt)           return <WidgetNumOptUI      req={req} />
    if (req instanceof R.Widget_str)                return <WidgetStrUI         req={req} />
    if (req instanceof R.Widget_strOpt)             return <WidgetStrUI         req={req} />
    if (req instanceof R.Widget_image)              return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Widget_imageOpt)           return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Widget_list)               return <WidgetListUI        req={req} />
    if (req instanceof R.Widget_group)              return <WidgetGroupUI       req={req} />
    if (req instanceof R.Widget_groupOpt)           return <WidgetGroupUI       req={req} />
    if (req instanceof R.Widget_size)               return <WigetSizeUI         req={req} />
    if (req instanceof R.Widget_enum)               return <WidgetEnumUI        req={req} />
    if (req instanceof R.Widget_enumOpt)            return <WidgetEnumUI        req={req} />
    if (req instanceof R.Widget_matrix)             return <WidgetMatrixUI      req={req} />
    if (req instanceof R.Widget_bool)               return <WidgetBoolUI        req={req} />
    if (req instanceof R.Widget_prompt)             return <WidgetPromptUI      req={req} />
    if (req instanceof R.Widget_promptOpt)          return <WidgetPromptUI      req={req} />
    if (req instanceof R.Widget_loras)              return <WidgetLorasUI       req={req} />
    if (req instanceof R.Widget_color)              return <WidgetColorUI       req={req} />
    if (req instanceof R.Widget_selectOne)          return <WidgetSelectOneUI   req={req} />
    if (req instanceof R.Widget_choice)             return <WidgetChoiceUI      req={req} />
    if (req instanceof R.Widget_choices)            return <WidgetChoicesUI     req={req} />
    if (req instanceof R.Widget_markdown)           return <WidgetMardownUI     req={req} />
    if (req instanceof R.Widget_selectMany)         return <>TODO</>
    if (req instanceof R.Widget_selectManyOrCustom) return <>TODO</>
    if (req instanceof R.Widget_selectOneOrCustom)  return <>TODO</>

    exhaust(req)
    console.log(`🔴`, (req as any).type, req)
    return <Message type='error' showIcon>
        <div>{(req as any).type}</div>
        <div>{(req as any).constructor.name}</div>
        <div>{typeof (req as any)}</div>
        not supported
     </Message>
})
