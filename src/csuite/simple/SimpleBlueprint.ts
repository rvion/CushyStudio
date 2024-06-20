import type { Widget_list, Widget_list_config } from '../fields/list/WidgetList'
import type { Widget_optional } from '../fields/optional/WidgetOptional'
import type { Widget_shared } from '../fields/shared/WidgetShared'
import type { BaseField } from '../model/BaseField'
import type { Channel, ChannelId, Producer } from '../model/Channel'
import type { IBlueprint } from '../model/IBlueprint'
import type { SList, SOptional } from './SimpleSpecAliases'

import { makeObservable } from 'mobx'

import { getCurrentForm_IMPL } from '../model/runWithGlobalForm'

// Simple Spec --------------------------------------------------------

export class SimpleBlueprint<W extends BaseField = BaseField> implements IBlueprint<W> {
    $Field!: W
    $Type!: W['type']
    $Config!: W['$Config']
    $Serial!: W['$Serial']
    $Value!: W['$Value']

    LabelExtraUI = (p: {}) => null

    // PubSub -----------------------------------------------------
    producers: Producer<any, W['$Field']>[] = []
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: W['$Field']) => T): this {
        this.producers.push({ chan, produce })
        return this
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: W['$Field']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    reactions: {
        expr: (self: W['$Field']) => any
        effect: (arg: any, self: W['$Field']) => void
    }[] = []
    addReaction<T>(
        //
        expr: (self: W['$Field']) => T,
        effect: (arg: T, self: W['$Field']) => void,
    ): this {
        this.reactions.push({ expr, effect })
        return this
    }

    // -----------------------------------------------------
    Make = <X extends BaseField>(type: X['type'], config: X['$Config']) => new SimpleBlueprint(type, config)

    constructor(
        //
        public readonly type: W['type'],
        public readonly config: W['$Config'],
    ) {
        makeObservable(this, { config: true })
    }

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<this>, 'element'> = {}): SList<this> =>
        new SimpleBlueprint<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = (startActive: boolean = false): SOptional<this> =>
        new SimpleBlueprint<Widget_optional<this>>('optional', {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            // requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })

    shared = (key: string): Widget_shared<this> => getCurrentForm_IMPL().shared(key, this)

    /** clone the spec, and patch the cloned config */
    withConfig = (config: Partial<W['$Config']>): SimpleBlueprint<W> => {
        const mergedConfig = { ...this.config, ...config }
        const cloned = new SimpleBlueprint<W>(this.type, mergedConfig)
        // 🔴 Keep producers and reactions -> could probably be part of the ctor
        cloned.producers = this.producers
        cloned.reactions = this.reactions
        return cloned
    }

    hidden = (): SimpleBlueprint<W> => this.withConfig({ hidden: true })
}
