import type { ISpec } from './ISpec'
import type { IWidget } from './IWidget'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { getCurrentForm_IMPL } from './shared/runWithGlobalForm'

// Simple Spec --------------------------------------------------------

export class SimpleSpec<W extends IWidget = IWidget> implements ISpec<W> {
    $Widget!: W
    $Type!: W['type']
    $Config!: W['$Config']
    $Serial!: W['$Serial']
    $Value!: W['$Value']

    LabelExtraUI = (p: {}) => null

    Make = <X extends IWidget>(type: X['type'], config: X['$Config']) => new SimpleSpec(type, config)

    constructor(
        //
        public readonly type: W['type'],
        public readonly config: W['$Config'],
    ) {}

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<any>, 'element'> = {}): SimpleSpec<Widget_list<this>> =>
        new SimpleSpec<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = <const T extends SimpleSpec>(startActive: boolean = false) =>
        new SimpleSpec<Widget_optional<this>>('optional', {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            // requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })

    shared = (key: string): Widget_shared<this> => getCurrentForm_IMPL().shared(key, this)

    /** clone the spec, and patch the cloned config to make it hidden */
    hidden = () => new SimpleSpec(this.type, { ...this.config, hidden: true })
}
