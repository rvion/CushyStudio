import type { IWidget } from './IWidget'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { getCurrentForm_IMPL } from 'src/models/_ctx2'

export type SchemaDict = { [key: string]: ISpec }
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
    ) {
        // 2024-03-11 rvion: this was added to properly support "shared" specs;
        //          | but it turns out we can just live without any shared spec,
        //          | and only work with instanciated Widget_shared directly
        // ⏸️ /** if specified, bypass the instanciation completely */
        // ⏸️ public widget?: W,
    }

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

    shared = (key: string): Widget_shared<this> => getCurrentForm_IMPL().shared(key, this)

    /** clone the spec, and patch the cloned config to make it hidden */
    hidden = () => new Spec(this.type, { ...this.config, hidden: true })
}
