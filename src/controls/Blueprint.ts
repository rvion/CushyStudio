import type { CovariantFC } from '../csuite'
import type { Widget_list, Widget_list_config } from '../csuite/fields/list/WidgetList'
import type { Widget_optional } from '../csuite/fields/optional/WidgetOptional'
import type { BaseField } from '../csuite/model/BaseField'
import type { IBlueprint } from '../csuite/model/IBlueprint'
import type { Requirements } from '../manager/REQUIREMENTS/Requirements'

import { createElement } from 'react'

import { isWidgetOptional } from '../csuite/fields/WidgetUI.DI'
import { Channel, type ChannelId, Producer } from '../csuite/model/Channel'
import { getCurrentForm_IMPL } from '../csuite/model/runWithGlobalForm'
import { objectAssignTsEfficient_t_pt } from '../csuite/utils/objectAssignTsEfficient'
import { InstallRequirementsBtnUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'

export class Blueprint<out Field extends BaseField = BaseField> implements IBlueprint<Field> {
    $Field!: Field
    $Type!: Field['type']
    $Config!: Field['$Config']
    $Serial!: Field['$Serial']
    $Value!: Field['$Value']

    LabelExtraUI: CovariantFC<{ widget: Field }> = (p: { widget: Field }) =>
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
        expr(self: Field['$Field']): any
        effect(arg: any, self: Field['$Field']): void
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

    addRequirements(requirements: Maybe<Requirements | Requirements[]>) {
        if (requirements == null) return this
        if (Array.isArray(requirements)) this.requirements.push(...requirements)
        else this.requirements.push(requirements)
        // this.🐌
        return this
    }

    Make<X extends BaseField>(type: X['type'], config: X['$Config']) {
        return new Blueprint(type, config)
    }

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

    /** clone the spec, and patch the cloned config */
    withConfig(config: Partial<Field['$Config']>): Blueprint<Field> {
        const mergedConfig = objectAssignTsEfficient_t_pt(this.config, config)
        const cloned = new Blueprint<Field>(this.type, mergedConfig)
        // 🔴 Keep producers and reactions -> could probably be part of the ctor
        cloned.producers = this.producers
        cloned.reactions = this.reactions
        return cloned
    }

    optional(startActive: boolean = false): X.XOptional<this> {
        return new Blueprint<Widget_optional<this>>('optional', {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            // requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
    }

    shared(key: string): X.Shared<this> {
        return getCurrentForm_IMPL().shared(key, this)
    }

    /** clone the spec, and patch the cloned config to make it hidden */
    hidden() {
        return this.withConfig({ hidden: true })
    }
}
