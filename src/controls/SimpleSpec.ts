import type { ISpec } from './ISpec'
import type { IWidget } from './IWidget'
import type { Widget_list, Widget_list_config } from './widgets/list/WidgetList'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { Channel, type ChannelId, type Producer } from './Channel'
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
    ) {}

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<this>, 'element'> = {}): SimpleSpec<Widget_list<this>> =>
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
