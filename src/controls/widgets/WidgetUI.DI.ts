import type { WidgetUI } from './WidgetUI'

import type * as R from '../Widget'

import type { Widget_choices } from './choices/WidgetChoices'
import type { Widget_string } from './string/WidgetString'
import type { Widget_bool } from './bool/WidgetBool'
import type { Widget_number } from './number/WidgetNumber'
import type { Widget_color } from './color/WidgetColor'
import type { Widget_group } from './group/WidgetGroup'
import type { Widget_optional } from './optional/WidgetOptional'
import type { Widget_orbit } from './orbit/WidgetOrbit'
import type { Widget_enum } from './enum/WidgetEnum'
import type { Widget_list } from './list/WidgetList'
import type { Widget_listExt } from './listExt/WidgetListExt'
import type { Widget_prompt } from './prompt/WidgetPrompt'
import type { Widget_size } from './size/WidgetSize'
import type { Widget_image } from './image/WidgetImage'
import type { Widget_custom } from './custom/WidgetCustom'

/**
 * DI (Dependency Injection)
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * */
export let WidgetDI = {
    WidgetUI: 0 as any as typeof WidgetUI,
    Widget_optional: 0 as any as typeof Widget_optional,
    Widget_color: 0 as any as typeof Widget_color,
    Widget_string: 0 as any as typeof Widget_string,
    Widget_prompt: 0 as any as typeof Widget_prompt,
    Widget_seed: 0 as any as typeof R.Widget_seed,
    Widget_number: 0 as any as typeof Widget_number,
    Widget_bool: 0 as any as typeof Widget_bool,
    Widget_inlineRun: 0 as any as typeof R.Widget_inlineRun,
    Widget_markdown: 0 as any as typeof R.Widget_markdown,
    Widget_custom: 0 as any as typeof Widget_custom,
    Widget_size: 0 as any as typeof Widget_size,
    Widget_matrix: 0 as any as typeof R.Widget_matrix,
    Widget_loras: 0 as any as typeof R.Widget_loras,
    Widget_image: 0 as any as typeof Widget_image,
    Widget_selectMany: 0 as any as typeof R.Widget_selectMany,
    Widget_selectOne: 0 as any as typeof R.Widget_selectOne,
    Widget_list: 0 as any as typeof Widget_list,
    Widget_group: 0 as any as typeof Widget_group,
    Widget_choices: 0 as any as typeof Widget_choices,
    Widget_enum: 0 as any as typeof Widget_enum,
    Widget_listExt: 0 as any as typeof Widget_listExt,
    Widget_orbit: 0 as any as typeof Widget_orbit,
}
