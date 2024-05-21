import type { Channel, ChannelId, Producer } from './Channel'
import type { ISpec } from './ISpec'
import type { IWidget } from './IWidget'
import type { SList, SOptional } from './SimpleSpecAliases'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { makeObservable } from 'mobx'

import { getCurrentForm_IMPL } from './shared/runWithGlobalForm'

// Simple Spec --------------------------------------------------------

export class SimpleSpec<W extends IWidget = IWidget> implements ISpec<W> {
    $Widget!: W
    $Type!: W['type']
    $Config!: W['$Config']
    $Serial!: W['$Serial']
    $Value!: W['$Value']

    LabelExtraUI = (p: {}) => null

    // PubSub -----------------------------------------------------
    producers: Producer<any, W['$Widget']>[] = []
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: W['$Widget']) => T): this {
        this.producers.push({ chan, produce })
        return this
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: W['$Widget']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    reactions: {
        expr: (self: W['$Widget']) => any
        effect: (arg: any, self: W['$Widget']) => void
    }[] = []
    addReaction<T>(
        //
        expr: (self: W['$Widget']) => T,
        effect: (arg: T, self: W['$Widget']) => void,
    ): this {
        this.reactions.push({ expr, effect })
        return this
    }

    // -----------------------------------------------------
    Make = <X extends IWidget>(type: X['type'], config: X['$Config']) => new SimpleSpec(type, config)

    constructor(
        //
        public readonly type: W['type'],
        public readonly config: W['$Config'],
    ) {
        makeObservable(this, { config: true })
    }

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<this>, 'element'> = {}): SList<this> =>
        new SimpleSpec<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = (startActive: boolean = false): SOptional<this> =>
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

    /** clone the spec, and patch the cloned config */
    withConfig = (config: Partial<W['$Config']>): SimpleSpec<W> => {
        const mergedConfig = { ...this.config, ...config }
        const cloned = new SimpleSpec<W>(this.type, mergedConfig)
        // 🔴 Keep producers and reactions -> could probably be part of the ctor
        cloned.producers = this.producers
        cloned.reactions = this.reactions
        return cloned
    }

    hidden = (): SimpleSpec<W> => this.withConfig({ hidden: true })
}
