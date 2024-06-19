import type { Requirements } from '../manager/REQUIREMENTS/Requirements'
import type { BaseField } from './BaseField'
import type { IBlueprint } from './IBlueprint'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { createElement } from 'react'

import { InstallRequirementsBtnUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'
import { Channel, type ChannelId, Producer } from './Channel'
import { getCurrentForm_IMPL } from './context/runWithGlobalForm'
import { isWidgetOptional } from './widgets/WidgetUI.DI'

export class Blueprint<Field extends BaseField = BaseField> implements IBlueprint<Field> {
    $Field!: Field
    $Type!: Field['type']
    $Config!: Field['$Config']
    $Serial!: Field['$Serial']
    $Value!: Field['$Value']

    LabelExtraUI = (p: { widget: Field }) =>
        createElement(InstallRequirementsBtnUI, {
            active: isWidgetOptional(p.widget) ? p.widget.serial.active : true,
            requirements: this.requirements,
        })

    producers: Producer<any, Field['$Field']>[] = []
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: Field['$Field']) => T): this {
        this.producers.push({ chan, produce })
        return this
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: Field['$Field']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    reactions: {
        expr: (self: Field['$Field']) => any
        effect: (arg: any, self: Field['$Field']) => void
    }[] = []
    addReaction<T>(
        //
        expr: (self: Field['$Field']) => T,
        effect: (arg: T, self: Field['$Field']) => void,
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

    Make = <X extends BaseField>(type: X['type'], config: X['$Config']) => new Blueprint(type, config)

    constructor(
        //
        public readonly type: Field['type'],
        public readonly config: Field['$Config'],
    ) {}

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<any>, 'element'> = {}): X.XList<this> =>
        new Blueprint<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = (startActive: boolean = false): X.XOptional<this> =>
        new Blueprint<Widget_optional<this>>('optional', {
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
    hidden = () => new Blueprint(this.type, { ...this.config, hidden: true })
}
