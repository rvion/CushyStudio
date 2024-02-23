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
import { WidgetOptional_BlockUI, WidgetOptional_LineUI } from './optional/WidgetOptionalUI'
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
import { WidgetShared_BlockUI, WidgetShared_LineUI } from './shared/WidgetSharedUI'
import { Widget_size } from './size/WidgetSize'
import { WigetSize_BlockUI, WigetSize_LineUI } from './size/WidgetSizeUI'
import { Widget_string } from './string/WidgetString'
import { WidgetStringUI } from './string/WidgetStringUI'
import { WidgetDI } from './WidgetUI.DI'

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */

export const WidgetUI = (
    widget: IWidget,
): {
    WidgetLineUI?: FC<{ widget: any }>
    WidgetBlockUI?: FC<{ widget: any }>
} => {
    if (widget == null) return {}

    if (widget instanceof Widget_shared) return { WidgetLineUI: WidgetShared_LineUI, WidgetBlockUI: WidgetShared_BlockUI }
    if (widget instanceof Widget_seed) return { WidgetLineUI: WidgetSeedUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_number) return { WidgetLineUI: WidgetNumberUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_string) return { WidgetLineUI: WidgetStringUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_optional) return { WidgetLineUI: WidgetOptional_LineUI, WidgetBlockUI: WidgetOptional_BlockUI }
    if (widget instanceof Widget_image) return { WidgetLineUI: WidgetSelectImageUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_list) return { WidgetLineUI: WidgetList_LineUI, WidgetBlockUI: WidgetListUI }
    if (widget instanceof Widget_listExt) return { WidgetLineUI: WidgetList_LineUI, WidgetBlockUI: WidgetListExtUI }
    if (widget instanceof Widget_group) return { WidgetLineUI: WidgetGroup_LineUI, WidgetBlockUI: WidgetGroup_BlockUI }
    if (widget instanceof Widget_size) return { WidgetLineUI: WigetSize_LineUI, WidgetBlockUI: WigetSize_BlockUI }
    if (widget instanceof Widget_enum) return { WidgetLineUI: WidgetEnumUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_matrix) return { WidgetLineUI: WidgetMatrixUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_bool) return { WidgetLineUI: WidgetBoolUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_inlineRun) return { WidgetLineUI: WidgetInlineRunUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_prompt) return { WidgetLineUI: WidgetPrompt_LineUI, WidgetBlockUI: WidgetPromptUI }
    if (widget instanceof Widget_loras) return { WidgetLineUI: WidgetLorasUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_color) return { WidgetLineUI: WidgetColorUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_selectOne) return { WidgetLineUI: WidgetSelectOneUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_choices) return { WidgetLineUI: WidgetChoices_LineUI, WidgetBlockUI: WidgetChoicesUI }
    if (widget instanceof Widget_markdown) return { WidgetLineUI: undefined, WidgetBlockUI: WidgetMardownUI }
    if (widget instanceof Widget_custom) return { WidgetLineUI: WidgetCustomUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_selectMany) return { WidgetLineUI: WidgetSelectManyUI, WidgetBlockUI: undefined }
    if (widget instanceof Widget_orbit) return { WidgetLineUI: WidgetOrbitUI, WidgetBlockUI: undefined }

    // exhaust(widget)
    console.log(`🔴`, (widget as any).type, widget)
    return {}
}

WidgetDI.WidgetUI = WidgetUI
