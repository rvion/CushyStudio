import * as R from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { Message } from 'src/rsuite/shims'
import { exhaust } from '../../utils/misc/ComfyUtils'
import { WidgetPromptUI } from '../../widgets/prompter/WidgetPromptUI'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetInlineRunUI } from './WidgetInlineRunUI'
import { WidgetChoiceUI } from './WidgetChoiceUI'
import { WidgetChoicesUI } from './WidgetChoicesUI'
import { WidgetColorUI } from './WidgetColorUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetGroupUI } from './WidgetIGroupUI'
import { WidgetListUI } from './WidgetListUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetMardownUI } from './WidgetMarkdownUI'
import { WidgetCustomUI } from './WidgetCustomUI'
import { WidgetMatrixUI } from './WidgetMatrixUI'
import { WidgetNumOptUI } from './WidgetNumOptUI'
import { WidgetNumUI } from './WidgetNumUI'
import { WidgetSeedUI } from './WidgetSeedUI'
import { WidgetSelectImageUI } from './WidgetSelectImageUI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'
import { WigetSizeUI } from './WidgetSizeUI'
import { WidgetStrUI } from './WidgetStrUI'
import { WidgetDI } from './WidgetUI.DI'
import { WidgetListExtUI } from './WidgetListExtUI'

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
// prettier-ignore
export const WidgetUI = observer(function WidgetUI_(p: { widget: R.Widget; focus?: boolean }) {
    const widget = p.widget
    if (widget == null) return <>NULL</>
    if (widget instanceof R.Widget_seed)               return <WidgetSeedUI        widget={widget} />
    if (widget instanceof R.Widget_int)                return <WidgetNumUI         widget={widget} />
    if (widget instanceof R.Widget_intOpt)             return <WidgetNumOptUI      widget={widget} />
    if (widget instanceof R.Widget_float)              return <WidgetNumUI         widget={widget} />
    if (widget instanceof R.Widget_floatOpt)           return <WidgetNumOptUI      widget={widget} />
    if (widget instanceof R.Widget_str)                return <WidgetStrUI         widget={widget} />
    if (widget instanceof R.Widget_strOpt)             return <WidgetStrUI         widget={widget} />
    if (widget instanceof R.Widget_image)              return <WidgetSelectImageUI widget={widget} />
    if (widget instanceof R.Widget_imageOpt)           return <WidgetSelectImageUI widget={widget} />
    if (widget instanceof R.Widget_list)               return <WidgetListUI        widget={widget} />
    if (widget instanceof R.Widget_listExt)            return <WidgetListExtUI     widget={widget} />
    if (widget instanceof R.Widget_group)              return <WidgetGroupUI       widget={widget} />
    if (widget instanceof R.Widget_groupOpt)           return <WidgetGroupUI       widget={widget} />
    if (widget instanceof R.Widget_size)               return <WigetSizeUI         widget={widget} />
    if (widget instanceof R.Widget_enum)               return <WidgetEnumUI        widget={widget} />
    if (widget instanceof R.Widget_enumOpt)            return <WidgetEnumUI        widget={widget} />
    if (widget instanceof R.Widget_matrix)             return <WidgetMatrixUI      widget={widget} />
    if (widget instanceof R.Widget_bool)               return <WidgetBoolUI        widget={widget} />
    if (widget instanceof R.Widget_inlineRun)          return <WidgetInlineRunUI   widget={widget} />
    if (widget instanceof R.Widget_prompt)             return <WidgetPromptUI      widget={widget} />
    if (widget instanceof R.Widget_promptOpt)          return <WidgetPromptUI      widget={widget} />
    if (widget instanceof R.Widget_loras)              return <WidgetLorasUI       widget={widget} />
    if (widget instanceof R.Widget_color)              return <WidgetColorUI       widget={widget} />
    if (widget instanceof R.Widget_selectOne)          return <WidgetSelectOneUI   widget={widget} />
    if (widget instanceof R.Widget_choice)             return <WidgetChoiceUI      widget={widget} />
    if (widget instanceof R.Widget_choices)            return <WidgetChoicesUI     widget={widget} />
    if (widget instanceof R.Widget_markdown)           return <WidgetMardownUI     widget={widget} />
    if (widget instanceof R.Widget_custom)             return <WidgetCustomUI      widget={widget} />
    if (widget instanceof R.Widget_selectMany)         return <>TODO</>
    if (widget instanceof R.Widget_selectManyOrCustom) return <>TODO</>
    if (widget instanceof R.Widget_selectOneOrCustom)  return <>TODO</>

    exhaust(widget)
    console.log(`🔴`, (widget as any).type, widget)
    return <Message type='error' showIcon>
        <div>{(widget as any).type}</div>
        <div>{(widget as any).constructor.name}</div>
        <div>{typeof (widget as any)}</div>
        not supported
     </Message>
})

WidgetDI.WidgetUI = WidgetUI
