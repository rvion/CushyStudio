import type { Widget_list, Widget_list_config } from '../fields/list/WidgetList'
import type { Widget_optional } from '../fields/optional/WidgetOptional'
import type { Widget_shared } from '../fields/shared/WidgetShared'
import type { BaseField } from '../model/BaseField'
import type { Channel, ChannelId, Producer } from '../model/Channel'
import type { IBlueprint } from '../model/IBlueprint'
import type { SList, SOptional } from './SimpleSpecAliases'

import { makeObservable } from 'mobx'

import { getCurrentForm_IMPL } from '../model/runWithGlobalForm'
import { objectAssignTsEfficient_t_pt } from '../utils/objectAssignTsEfficient'

// Simple Spec --------------------------------------------------------

export class SimpleBlueprint<out Field extends BaseField = BaseField> implements IBlueprint<Field> {
    $Field!: Field
    $Type!: Field['type']
    $Config!: Field['$Config']
    $Serial!: Field['$Serial']
    $Value!: Field['$Value']

    LabelExtraUI() {
        return null
    }

    // PubSub -----------------------------------------------------
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

    // -----------------------------------------------------
    Make<X extends BaseField>(type: X['type'], config: X['$Config']) {
        return new SimpleBlueprint(type, config)
    }

    constructor(
        //
        public readonly type: Field['type'],
        public readonly config: Field['$Config'],
    ) {
        makeObservable(this, { config: true })
    }

    /** wrap widget spec to list stuff */
    list(config: Omit<Widget_list_config<this>, 'element'> = {}): SList<this> {
        return new SimpleBlueprint<Widget_list<this>>('list', {
            ...config,
            element: this,
        })
    }

    optional(startActive: boolean = false): SOptional<this> {
        return new SimpleBlueprint<Widget_optional<this>>('optional', {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            // requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
    }

    shared(key: string): Widget_shared<this> {
        return getCurrentForm_IMPL().shared(key, this)
    }

    /** clone the spec, and patch the cloned config */
    withConfig(config: Partial<Field['$Config']>): SimpleBlueprint<Field> {
        const mergedConfig = objectAssignTsEfficient_t_pt(this.config, config)
        const cloned = new SimpleBlueprint<Field>(this.type, mergedConfig)
        // 🔴 Keep producers and reactions -> could probably be part of the ctor
        cloned.producers = this.producers
        cloned.reactions = this.reactions
        return cloned
    }

    /** clone the spec, and patch the cloned config to make it hidden */
    hidden(): SimpleBlueprint<Field> {
        return this.withConfig({ hidden: true })
    }
}
