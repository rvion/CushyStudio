import type { WidgetUI } from './WidgetUI'
import type * as R from '../Widget'

/**
 * DI stands for dependency injection
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * */
export let WidgetDI = {
    WidgetUI: 0 as any as typeof WidgetUI,
    Widget_color: 0 as any as typeof R.Widget_color,
    Widget_str: 0 as any as typeof R.Widget_str,
    Widget_strOpt: 0 as any as typeof R.Widget_strOpt,
    Widget_prompt: 0 as any as typeof R.Widget_prompt,
    Widget_promptOpt: 0 as any as typeof R.Widget_promptOpt,
    Widget_seed: 0 as any as typeof R.Widget_seed,
    Widget_int: 0 as any as typeof R.Widget_int,
    Widget_float: 0 as any as typeof R.Widget_float,
    Widget_bool: 0 as any as typeof R.Widget_bool,
    Widget_inlineRun: 0 as any as typeof R.Widget_inlineRun,
    Widget_intOpt: 0 as any as typeof R.Widget_intOpt,
    Widget_floatOpt: 0 as any as typeof R.Widget_floatOpt,
    Widget_markdown: 0 as any as typeof R.Widget_markdown,
    Widget_custom: 0 as any as typeof R.Widget_custom,
    Widget_size: 0 as any as typeof R.Widget_size,
    Widget_matrix: 0 as any as typeof R.Widget_matrix,
    Widget_loras: 0 as any as typeof R.Widget_loras,
    Widget_image: 0 as any as typeof R.Widget_image,
    Widget_imageOpt: 0 as any as typeof R.Widget_imageOpt,
    Widget_selectOneOrCustom: 0 as any as typeof R.Widget_selectOneOrCustom,
    Widget_selectMany: 0 as any as typeof R.Widget_selectMany,
    Widget_selectManyOrCustom: 0 as any as typeof R.Widget_selectManyOrCustom,
    Widget_selectOne: 0 as any as typeof R.Widget_selectOne,
    Widget_list: 0 as any as typeof R.Widget_list,
    Widget_group: 0 as any as typeof R.Widget_group,
    Widget_groupOpt: 0 as any as typeof R.Widget_groupOpt,
    Widget_choice: 0 as any as typeof R.Widget_choice,
    Widget_choices: 0 as any as typeof R.Widget_choices,
    Widget_enum: 0 as any as typeof R.Widget_enum,
    Widget_enumOpt: 0 as any as typeof R.Widget_enumOpt,
    Widget_listExt: 0 as any as typeof R.Widget_listExt,
    Widget_orbit: 0 as any as typeof R.Widget_orbit,
}
