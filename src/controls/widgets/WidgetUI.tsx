import type { IWidget } from '../IWidget'
import type { FC } from 'react'

import { exhaust } from '../../utils/misc/ComfyUtils'
import { Widget_bool } from './bool/WidgetBool'
import { WidgetBoolUI } from './bool/WidgetBoolUI'
import { Widget_inlineRun } from './button/WidgetInlineRun'
import { WidgetInlineRunUI } from './button/WidgetInlineRunUI'
import { Widget_choices } from './choices/WidgetChoices'
import { WidgetChoices_LineUI, WidgetChoicesUI } from './choices/WidgetChoicesUI'
import { Widget_color } from './color/WidgetColor'
import { WidgetColorUI } from './color/WidgetColorUI'
import { Widget_custom } from './custom/WidgetCustom'
import { WidgetCustomUI } from './custom/WidgetCustomUI'
import { Widget_enum } from './enum/WidgetEnum'
import { WidgetEnumUI } from './enum/WidgetEnumUI'
import { Widget_group } from './group/WidgetGroup'
import { WidgetGroup_BlockUI, WidgetGroup_LineUI } from './group/WidgetGroupUI'
import { Widget_image } from './image/WidgetImage'
import { WidgetSelectImageUI } from './image/WidgetImageUI'
import { Widget_list } from './list/WidgetList'
import { WidgetList_LineUI, WidgetListUI } from './list/WidgetListUI'
import { Widget_listExt } from './listExt/WidgetListExt'
import { WidgetListExtUI } from './listExt/WidgetListExtUI'
import { Widget_loras } from './loras/WidgetLora'
import { WidgetLorasUI } from './loras/WidgetLorasUI'
import { Widget_markdown } from './markdown/WidgetMarkdown'
import { WidgetMardownUI } from './markdown/WidgetMarkdownUI'
import { Widget_matrix } from './matrix/WidgetMatrix'
import { WidgetMatrixUI } from './matrix/WidgetMatrixUI'
import { Widget_number } from './number/WidgetNumber'
import { WidgetNumberUI } from './number/WidgetNumberUI'
import { Widget_optional } from './optional/WidgetOptional'
import { Widget_orbit } from './orbit/WidgetOrbit'
import { WidgetOrbitUI } from './orbit/WidgetOrbitUI'
import { Widget_prompt } from './prompt/WidgetPrompt'
import { WidgetPrompt_LineUI, WidgetPromptUI } from './prompt/WidgetPromptUI'
import { Widget_seed } from './seed/WidgetSeed'
import { WidgetSeedUI } from './seed/WidgetSeedUI'
import { Widget_selectMany } from './selectMany/WidgetSelectMany'
import { WidgetSelectManyUI } from './selectMany/WidgetSelectManyUI'
import { Widget_selectOne } from './selectOne/WidgetSelectOne'
import { WidgetSelectOneUI } from './selectOne/WidgetSelectOneUI'
import { Widget_shared } from './shared/WidgetShared'
import { Widget_size } from './size/WidgetSize'
import { WigetSize_BlockUI, WigetSize_LineUI } from './size/WidgetSizeUI'
import { Widget_string } from './string/WidgetString'
import { WidgetStringUI } from './string/WidgetStringUI'
import { WidgetDI } from './WidgetUI.DI'

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
// prettier-ignore
export const WidgetUI = (
    widget: IWidget,
): {
    WidgetHeaderUI?: FC<{ widget: any }>
    WidgetBodyUI?: FC<{ widget: any }>
} => {
    if (widget == null) return {}

    if (widget instanceof Widget_seed)        return { WidgetHeaderUI: WidgetSeedUI,          WidgetBodyUI: undefined }
    if (widget instanceof Widget_number)      return { WidgetHeaderUI: WidgetNumberUI,        WidgetBodyUI: undefined }
    if (widget instanceof Widget_string)      return { WidgetHeaderUI: WidgetStringUI,        WidgetBodyUI: undefined }
    if (widget instanceof Widget_image)       return { WidgetHeaderUI: WidgetSelectImageUI,   WidgetBodyUI: undefined }
    if (widget instanceof Widget_list)        return { WidgetHeaderUI: WidgetList_LineUI,     WidgetBodyUI: WidgetListUI }
    if (widget instanceof Widget_listExt)     return { WidgetHeaderUI: WidgetList_LineUI,     WidgetBodyUI: WidgetListExtUI }
    if (widget instanceof Widget_group)       return { WidgetHeaderUI: WidgetGroup_LineUI,    WidgetBodyUI: WidgetGroup_BlockUI }
    if (widget instanceof Widget_size)        return { WidgetHeaderUI: WigetSize_LineUI,      WidgetBodyUI: WigetSize_BlockUI }
    if (widget instanceof Widget_enum)        return { WidgetHeaderUI: WidgetEnumUI,          WidgetBodyUI: undefined }
    if (widget instanceof Widget_matrix)      return { WidgetHeaderUI: WidgetMatrixUI,        WidgetBodyUI: undefined }
    if (widget instanceof Widget_bool)        return { WidgetHeaderUI: WidgetBoolUI,          WidgetBodyUI: undefined }
    if (widget instanceof Widget_inlineRun)   return { WidgetHeaderUI: WidgetInlineRunUI,     WidgetBodyUI: undefined }
    if (widget instanceof Widget_prompt)      return { WidgetHeaderUI: WidgetPrompt_LineUI,   WidgetBodyUI: WidgetPromptUI }
    if (widget instanceof Widget_loras)       return { WidgetHeaderUI: WidgetLorasUI,         WidgetBodyUI: undefined }
    if (widget instanceof Widget_color)       return { WidgetHeaderUI: WidgetColorUI,         WidgetBodyUI: undefined }
    if (widget instanceof Widget_selectOne)   return { WidgetHeaderUI: WidgetSelectOneUI,     WidgetBodyUI: undefined }
    if (widget instanceof Widget_choices)     return { WidgetHeaderUI: WidgetChoices_LineUI,  WidgetBodyUI: WidgetChoicesUI }
    if (widget instanceof Widget_markdown)    return { WidgetHeaderUI: undefined,             WidgetBodyUI: WidgetMardownUI }
    if (widget instanceof Widget_custom)      return { WidgetHeaderUI: WidgetCustomUI,        WidgetBodyUI: undefined }
    if (widget instanceof Widget_selectMany)  return { WidgetHeaderUI: WidgetSelectManyUI,    WidgetBodyUI: undefined }
    if (widget instanceof Widget_orbit)       return { WidgetHeaderUI: WidgetOrbitUI,         WidgetBodyUI: undefined }

    // Non-UI form nodes
    if (widget instanceof Widget_optional)    return { WidgetHeaderUI: undefined,             WidgetBodyUI: undefined }
    if (widget instanceof Widget_shared)      return { WidgetHeaderUI: undefined,             WidgetBodyUI: undefined }
    // if (widget instanceof Widget_optional) return { WidgetLineUI: WidgetOptional_LineUI, WidgetBlockUI: WidgetOptional_BlockUI }
    // if (widget instanceof Widget_shared)      return { WidgetLineUI: WidgetShared_LineUI,   WidgetBlockUI: WidgetShared_BlockUI }

    // exhaust(widget)
    console.log(`🔴`, (widget as any).type, widget)
    return {}
}

WidgetDI.WidgetUI = WidgetUI
