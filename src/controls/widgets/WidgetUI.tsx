import * as R from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { Message } from 'src/rsuite/shims'
import { exhaust } from '../../utils/misc/ComfyUtils'
import { WidgetPromptUI } from '../../widgets/prompter/WidgetPromptUI'
import { Widget_choices } from './choices/WidgetChoices'
import { WidgetChoicesUI } from './choices/WidgetChoicesUI'
import { Widget_string } from './string/WidgetString'
import { WidgetStringUI } from './string/WidgetStringUI'
import { Widget_bool } from './bool/WidgetBool'
import { WidgetBoolUI } from './bool/WidgetBoolUI'
import { WidgetColorUI, Widget_color } from '../widgets2/WidgetColor'
import { WidgetCustomUI } from './WidgetCustomUI'
import { WidgetEnumUI, Widget_enum } from '../widgets2/WidgetEnumUI'
import { WidgetGroupUI, Widget_group } from '../widgets2/WidgetIGroup'
import { WidgetInlineRunUI } from './WidgetInlineRunUI'
import { WidgetListExtUI } from './WidgetListExtUI'
import { WidgetListUI } from './list/WidgetListUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetMardownUI } from './WidgetMarkdownUI'
import { WidgetMatrixUI } from './WidgetMatrixUI'
import { WidgetNumUI, Widget_number } from '../widgets2/WidgetNumber'
import { WidgetOrbitUI, Widget_orbit } from '../widgets2/WidgetOrbit'
import { WidgetSeedUI } from './WidgetSeedUI'
import { WidgetSelectImageUI } from './WidgetSelectImageUI'
import { WidgetSelectManyUI } from './WidgetSelectManyUI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'
import { WigetSizeUI } from './WidgetSizeUI'
import { WidgetDI } from './WidgetUI.DI'
import { WidgetOptionalUI, Widget_optional } from '../widgets2/WidgetOptional'
import { Widget_list } from './list/WidgetList'

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
// prettier-ignore
export const WidgetUI = observer(function WidgetUI_(p: {
    //
    widget: R.Widget;
    focus?: boolean
}) {
    const widget = p.widget
    if (widget == null) return <>NULL</>
    if (widget instanceof R.Widget_seed)       return <WidgetSeedUI        widget={widget} />
    if (widget instanceof Widget_number)       return <WidgetNumUI         widget={widget} />
    if (widget instanceof Widget_string)       return <WidgetStringUI      widget={widget} />
    if (widget instanceof Widget_optional)     return <WidgetOptionalUI    widget={widget} />
    if (widget instanceof R.Widget_image)      return <WidgetSelectImageUI widget={widget} />
    if (widget instanceof Widget_list)         return <WidgetListUI        widget={widget} />
    if (widget instanceof R.Widget_listExt)    return <WidgetListExtUI     widget={widget} />
    if (widget instanceof Widget_group)        return <WidgetGroupUI       widget={widget} />
    if (widget instanceof R.Widget_size)       return <WigetSizeUI         widget={widget} />
    if (widget instanceof Widget_enum)         return <WidgetEnumUI        widget={widget} />
    if (widget instanceof R.Widget_matrix)     return <WidgetMatrixUI      widget={widget} />
    if (widget instanceof Widget_bool)         return <WidgetBoolUI        widget={widget} />
    if (widget instanceof R.Widget_inlineRun)  return <WidgetInlineRunUI   widget={widget} />
    if (widget instanceof R.Widget_prompt)     return <WidgetPromptUI      widget={widget} />
    if (widget instanceof R.Widget_loras)      return <WidgetLorasUI       widget={widget} />
    if (widget instanceof Widget_color)        return <WidgetColorUI       widget={widget} />
    if (widget instanceof R.Widget_selectOne)  return <WidgetSelectOneUI   widget={widget} />
    if (widget instanceof Widget_choices)      return <WidgetChoicesUI     widget={widget} />
    if (widget instanceof R.Widget_markdown)   return <WidgetMardownUI     widget={widget} />
    if (widget instanceof R.Widget_custom)     return <WidgetCustomUI      widget={widget} />
    if (widget instanceof R.Widget_selectMany) return <WidgetSelectManyUI  widget={widget} />
    if (widget instanceof Widget_orbit)        return <WidgetOrbitUI       widget={widget} />

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
