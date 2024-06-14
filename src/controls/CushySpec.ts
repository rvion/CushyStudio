import type { Requirements } from '../manager/REQUIREMENTS/Requirements'
import type { BaseWidget } from './BaseWidget'
import type { XList, XOptional } from './FormBuilder'
import type { ISpec } from './ISpec'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { createElement } from 'react'

import { InstallRequirementsBtnUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'
import { Channel, type ChannelId, Producer } from './Channel'
import { getCurrentForm_IMPL } from './context/runWithGlobalForm'
import { isWidgetOptional } from './widgets/WidgetUI.DI'

export class Spec<Widget extends BaseWidget = BaseWidget> implements ISpec<Widget> {
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

    producers: Producer<any, Widget['$Widget']>[] = []
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: Widget['$Widget']) => T): this {
        this.producers.push({ chan, produce })
        return this
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: Widget['$Widget']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    reactions: {
        expr: (self: Widget['$Widget']) => any
        effect: (arg: any, self: Widget['$Widget']) => void
    }[] = []
    addReaction<T>(
        //
        expr: (self: Widget['$Widget']) => T,
        effect: (arg: T, self: Widget['$Widget']) => void,
    ): this {
        this.reactions.push({ expr, effect })
        return this
    }

    // Requirements (CushySpecifc)
    readonly requirements: Requirements[] = []

    addRequirements = (requirements: Maybe<Requirements | Requirements[]>) => {
        if (requirements == null) return this
        if (Array.isArray(requirements)) this.requirements.push(...requirements)
        else this.requirements.push(requirements)
        return this
    }

    Make = <X extends BaseWidget>(type: X['type'], config: X['$Config']) => new Spec(type, config)

    constructor(
        //
        public readonly type: Widget['type'],
        public readonly config: Widget['$Config'],
    ) {}

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<any>, 'element'> = {}): XList<this> =>
        new Spec<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = (startActive: boolean = false): XOptional<this> =>
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
