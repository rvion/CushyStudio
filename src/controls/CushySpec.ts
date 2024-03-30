import type { IWidget } from './IWidget'
import type { Requirements } from './Requirements'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { getCurrentForm_IMPL } from './shared/runWithGlobalForm'
import { ISpec } from './Spec'

export class CushySpec<W extends IWidget = IWidget> implements ISpec<W> {
    $Widget!: W
    $Type!: W['type']
    $Config!: W['$Config']
    $Serial!: W['$Serial']
    $Value!: W['$Value']

    addRequirements = (requirements: Maybe<Requirements | Requirements[]>) => {
        return this
    }

    Make = <X extends IWidget>(type: X['type'], config: X['$Config']) => new CushySpec(type, config)

    constructor(
        //
        public readonly type: W['type'],
        public readonly config: W['$Config'],
    ) {
        // 💬 2024-03-11 rvion: this was added to properly support "shared" specs;
        //          | but it turns out we can just live without any shared spec,
        //          | and only work with instanciated Widget_shared directly
        // ⏸️ /** if specified, bypass the instanciation completely */
        // ⏸️ public widget?: W,
    }

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<any>, 'element'> = {}): CushySpec<Widget_list<this>> =>
        new CushySpec<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = <const T extends CushySpec>(startActive: boolean = false) =>
        new CushySpec<Widget_optional<this>>('optional', {
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
    hidden = () => new CushySpec(this.type, { ...this.config, hidden: true })
}
