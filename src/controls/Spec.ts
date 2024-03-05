import type { IWidget } from './IWidget'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'

export interface ISpec<W extends IWidget = IWidget> {
    $Widget: W
    $Type: W['type']
    $Input: W['$Input']
    $Serial: W['$Serial']
    $Output: W['$Output']
    type: W['type']
    config: W['$Input']
}

export class Spec<W extends IWidget = IWidget> {
    $Widget!: W
    $Type!: W['type']
    $Input!: W['$Input']
    $Serial!: W['$Serial']
    $Output!: W['$Output']

    constructor(
        //
        public readonly type: W['type'],
        public readonly config: W['$Input'],
        /** if specified, bypass the instanciation completely */
        public widget?: W,
    ) {}

    /** wrap widget spec to list stuff */
    list = <const T extends Spec>(config: Omit<Widget_list_config<T>, 'element'> = {}) =>
        new Spec<Widget_list<this>>('list', {
            element: this,
        })

    optional = <const T extends Spec>(startActive: boolean = false) =>
        new Spec<Widget_optional<this>>('optional', {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
}
