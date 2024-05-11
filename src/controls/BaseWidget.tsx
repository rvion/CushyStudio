import type { ISpec } from './ISpec'
import type { FC } from 'react'

import { observer } from 'mobx-react-lite'

import { Channel, ChannelId } from './Channel'
import { $WidgetSym, type IWidget } from './IWidget'
import { WidgetWithLabelUI } from './shared/WidgetWithLabelUI'
import { normalizeProblem, type Problem } from './Validation'

/** make sure the user-provided function will properly react to any mobx changes */
const ensureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
    if (fn == null) return null as T
    const isObserver = '$$typeof' in fn && fn.$$typeof === Symbol.for('react.memo')
    const FmtUI = (isObserver ? fn : observer(fn)) as T
    return FmtUI
}

// v3 (experimental) ---------------------------------------
export abstract class BaseWidget {
    abstract spec: ISpec

    $WidgetSym: typeof $WidgetSym = $WidgetSym

    /**
     * when this widget or one of its descendant publishes a value,
     * it will be stored here and possibly consumed by other descendants
     */
    _advertisedValues: Record<ChannelId, any> = {}

    /**
     * when consuming an advertised value, walk upward the parent chain, and look for
     * a value stored in the advsertised values
     */
    // 🚴🏠 -> consume / pull / receive / fetch / ... ?
    consume<T extends any>(chan: Channel<T> | ChannelId): Maybe<T> /* 🔸: T | $EmptyChannel */ {
        const channelId = typeof chan === 'string' ? chan : chan.id
        let at = this as any as IWidget | null
        while (at != null) {
            if (channelId in at._advertisedValues) return at._advertisedValues[channelId]
            at = at.parent
        }
        return null // $EmptyChannel
    }

    /** true if errors.length > 0 */
    get hasErrors(): boolean {
        const errors = this.errors
        return errors.length > 0
    }

    /** all errors: base (built-in widget) + custom (user-defined in config) */
    get errors(): Problem[] {
        const SELF = this as any as IWidget
        const baseErrors = normalizeProblem(SELF.baseErrors)
        return [...baseErrors, ...this.customErrors]
    }

    get customErrors(): Problem[] {
        const SELF = this as any as IWidget
        if (SELF.config.check == null)
            return [
                /* { message: 'No check function provided' } */
            ]
        const res = SELF.config.check(this)
        return normalizeProblem(res)
        // return [...normalizeProblem(res), { message: 'foo' }]
    }

    // BUMP ----------------------------------------------------
    bumpSerial(this: IWidget) {
        this.form.serialChanged(this)
    }

    // 💬 2024-03-15 rvion: use this regexp to quickly review manual serial set patterns
    // | `serial\.[a-zA-Z_]+(\[[a-zA-Z_]+\])? = `
    bumpValue(this: IWidget) {
        this.serial.lastUpdatedAt = Date.now() as Timestamp
        this.form.valueChanged(this)
        /** in case the widget config contains a custom callback, call this one too */
        this.config.onValueChange?.(this.value, this)
        this.publishValue() // 🔴  should probably be a reaction rather than this
    }

    publishValue(this: IWidget) {
        const producers = this.spec.producers
        if (producers.length === 0) return

        // Create and store values for every producer
        const producedValues: Record<ChannelId, any> = {}
        for (const producer of producers) {
            const channelId = typeof producer.chan === 'string' ? producer.chan : producer.chan.id
            producedValues[channelId] = producer.produce(this)
        }
        // Assign values to every parent widget in the hierarchy
        let at = this as any as IWidget | null
        while (at != null) {
            Object.assign(at._advertisedValues, producedValues)
            at = at.parent
        }
    }

    // FOLD ----------------------------------------------------
    setCollapsed(this: IWidget, val?: boolean) {
        if (this.serial.collapsed === val) return
        this.serial.collapsed = val
        this.form.serialChanged(this)
    }

    toggleCollapsed(this: IWidget) {
        this.serial.collapsed = !this.serial.collapsed
        this.form.serialChanged(this)
    }

    // UI ----------------------------------------------------
    ui(this: IWidget): JSX.Element {
        return <WidgetWithLabelUI isTopLevel key={this.id} widget={this} rootKey='_' />
    }

    defaultHeader(this: IWidget): JSX.Element | undefined {
        if (this.DefaultHeaderUI == null) return
        return <this.DefaultHeaderUI widget={this} />
    }

    defaultBody(this: IWidget): JSX.Element | undefined {
        if (this.DefaultBodyUI == null) return
        return <this.DefaultBodyUI widget={this} />
    }

    header(this: IWidget): JSX.Element | undefined {
        const HeaderUI =
            'header' in this.config //
                ? ensureObserver(this.config.header)
                : this.DefaultHeaderUI
        if (HeaderUI == null) return
        return <HeaderUI widget={this} />
    }

    body(this: IWidget): JSX.Element | undefined {
        const BodyUI =
            'body' in this.config //
                ? ensureObserver(this.config.body)
                : this.DefaultBodyUI
        if (BodyUI == null) return
        return <BodyUI widget={this} />
    }

    // --------------------------------------------------------------------------------
    // 🔶 the 5 getters bellow are temporary hacks to make shared keep working
    // until every shared usage has been migrated

    /** getter that resolve to `this.spec.producers` */
    get producers() {
        return this.spec.producers
    }
    /** getter that resolve to `this.spec.publish` */
    get publish() {
        return this.spec.publish
    }
    /** getter that resolve to `this.spec.subscribe` */
    get subscribe() {
        return this.spec.subscribe
    }
    /** getter that resolve to `this.spec.reactions` */
    get reactions() {
        return this.spec.reactions
    }
    /** getter that resolve to `this.spec.addReaction` */
    get addReaction() {
        return this.spec.addReaction
    }
}
