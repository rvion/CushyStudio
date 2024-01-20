import type { WidgetUI } from './WidgetUI'
import type * as R from '../Widget'
import type { Widget_choices } from '../widgets2/WidgetChoices'
import type { Widget_str } from '../widgets2/WidgetString'
import type { Widget_bool } from '../widgets2/WidgetBool'
import type { Widget_number } from '../widgets2/WidgetNumber'
import type { Widget_color } from '../widgets2/WidgetColor'
import type { Widget_group } from './WidgetIGroupUI'
import type { Widget_optional } from '../widgets2/WidgetOptional'

/**
 * DI stands for dependency injection
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * */
export let WidgetDI = {
    WidgetUI: 0 as any as typeof WidgetUI,
    Widget_optional: 0 as any as typeof Widget_optional,
    Widget_color: 0 as any as typeof Widget_color,
    Widget_str: 0 as any as typeof Widget_str,
    Widget_prompt: 0 as any as typeof R.Widget_prompt,
    Widget_promptOpt: 0 as any as typeof R.Widget_promptOpt,
    Widget_seed: 0 as any as typeof R.Widget_seed,
    Widget_number: 0 as any as typeof Widget_number,
    Widget_bool: 0 as any as typeof Widget_bool,
    Widget_inlineRun: 0 as any as typeof R.Widget_inlineRun,
    Widget_markdown: 0 as any as typeof R.Widget_markdown,
    Widget_custom: 0 as any as typeof R.Widget_custom,
    Widget_size: 0 as any as typeof R.Widget_size,
    Widget_matrix: 0 as any as typeof R.Widget_matrix,
    Widget_loras: 0 as any as typeof R.Widget_loras,
    Widget_image: 0 as any as typeof R.Widget_image,
    Widget_imageOpt: 0 as any as typeof R.Widget_imageOpt,
    Widget_selectMany: 0 as any as typeof R.Widget_selectMany,
    Widget_selectOne: 0 as any as typeof R.Widget_selectOne,
    Widget_list: 0 as any as typeof R.Widget_list,
    Widget_group: 0 as any as typeof Widget_group,
    Widget_choices: 0 as any as typeof Widget_choices,
    Widget_enum: 0 as any as typeof R.Widget_enum,
    Widget_enumOpt: 0 as any as typeof R.Widget_enumOpt,
    Widget_listExt: 0 as any as typeof R.Widget_listExt,
    Widget_orbit: 0 as any as typeof R.Widget_orbit,
}
