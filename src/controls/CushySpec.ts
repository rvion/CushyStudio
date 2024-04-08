import type { ISpec } from './ISpec'
import type { IWidget } from './IWidget'
import type { Requirements } from './Requirements'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { createElement } from 'react'

import { InstallRequirementsBtnUI } from './REQUIREMENTS/Panel_InstallRequirementsUI'
import { getCurrentForm_IMPL } from './shared/runWithGlobalForm'
import { isWidgetOptional } from './widgets/WidgetUI.DI'

export class Spec<Widget extends IWidget = IWidget> implements ISpec<Widget> {
    $Widget!: Widget
    $Type!: Widget['type']
    $Config!: Widget['$Config']
    $Serial!: Widget['$Serial']
    $Value!: Widget['$Value']

    LabelExtraUI = (p: { widget: Widget }) =>
        createElement(InstallRequirementsBtnUI, {
            active: isWidgetOptional(p.widget) ? p.widget.serial.active : true,
            requirements: this.requirements,
        })

    readonly requirements: Requirements[] = []

    addRequirements = (requirements: Maybe<Requirements | Requirements[]>) => {
        if (requirements == null) return this
        if (Array.isArray(requirements)) this.requirements.push(...requirements)
        else this.requirements.push(requirements)
        return this
    }

    Make = <X extends IWidget>(type: X['type'], config: X['$Config']) => new Spec(type, config)

    constructor(
        //
        public readonly type: Widget['type'],
        public readonly config: Widget['$Config'],
    ) {}

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<any>, 'element'> = {}): Spec<Widget_list<this>> =>
        new Spec<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = <const T extends Spec>(startActive: boolean = false) =>
        new Spec<Widget_optional<this>>('optional', {
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
    hidden = () => new Spec(this.type, { ...this.config, hidden: true })
}