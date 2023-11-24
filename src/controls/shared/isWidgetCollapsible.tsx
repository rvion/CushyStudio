import type * as R from 'src/controls/Widget'
import { WidgetDI } from '../widgets/WidgetUI.DI'

export function isWidgetCollapsible(req: R.Widget): boolean {
    const KLS = WidgetDI
    if (req instanceof KLS.Widget_markdown) return true
    if (req instanceof KLS.Widget_group) return true
    if (req instanceof KLS.Widget_groupOpt) return true
    if (req instanceof KLS.Widget_list) return true
    if (req instanceof KLS.Widget_listExt) return true
    if (req instanceof KLS.Widget_str && req.input.textarea) return true
    if (req instanceof KLS.Widget_prompt) return true
    if (req instanceof KLS.Widget_promptOpt) return true
    return false
}
