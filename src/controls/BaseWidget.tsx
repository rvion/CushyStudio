import type { IconName } from '../icons/icons'
import type { ITreeElement } from '../panels/libraryUI/tree/TreeEntry'
import type { Channel, ChannelId } from './Channel'
import type { Form } from './Form'
import type { ISpec } from './ISpec'
import type { CovariantFC } from './utils/CovariantFC'
import type { FC, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { TreeWidget } from '../panels/libraryUI/tree/nodes/TreeWidget'
import { makeAutoObservableInheritance } from '../utils/mobx-store-inheritance'
import { $WidgetSym, type IWidget } from './IWidget'
import { getActualWidgetToDisplay } from './shared/getActualWidgetToDisplay'
import { Widget_ToggleUI } from './shared/Widget_ToggleUI'
import { WidgetErrorsUI } from './shared/WidgetErrorsUI'
import { WidgetHeaderContainerUI } from './shared/WidgetHeaderContainerUI'
import { WidgetLabelCaretUI } from './shared/WidgetLabelCaretUI'
import { type WidgetLabelContainerProps, WidgetLabelContainerUI } from './shared/WidgetLabelContainerUI'
import { WidgetLabelIconUI } from './shared/WidgetLabelIconUI'
import { WidgetWithLabelUI } from './shared/WidgetWithLabelUI'
import { normalizeProblem, type Problem } from './Validation'
import { isWidgetGroup, isWidgetOptional } from './widgets/WidgetUI.DI'

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

    UIToggle = (p?: { className?: string }) => <Widget_ToggleUI widget={this} {...p} />
    UIErrors = () => <WidgetErrorsUI widget={this} />
    UILabelCaret = () => <WidgetLabelCaretUI widget={this} />
    UILabelIcon = () => <WidgetLabelIconUI widget={this} />
    UILabelContainer = (p: WidgetLabelContainerProps) => <WidgetLabelContainerUI {...p} />
    UIHeaderContainer = (p: { children: ReactNode }) => (
        <WidgetHeaderContainerUI widget={this}>{p.children}</WidgetHeaderContainerUI>
    )

    // abstract readonly id: string
    asTreeElement(key: string): ITreeElement<{ widget: IWidget; key: string }> {
        return {
            key: (this as any).id,
            ctor: TreeWidget as any,
            props: { key, widget: this as any },
        }
    }

    /** shorthand access to config */
    get config(): this['spec']['config'] {
        return this.spec.config
    }

    get animateResize() {
        return true
    }

    /**
     * return true when widget has no child
     * return flase when widget has one or more child
     * */
    get hasNoChild(): boolean {
        return this.subWidgets.length === 0
    }

    collapseAllChildren = () => {
        for (const _item of this.subWidgets) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = getActualWidgetToDisplay(_item)
            if (item.serial.collapsed) continue
            const isCollapsible = item.isCollapsible
            if (isCollapsible) item.setCollapsed(true)
        }
    }
    expandAllChildren = () => {
        for (const _item of this.subWidgets) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = getActualWidgetToDisplay(_item)
            item.setCollapsed(undefined)
        }
    }

    // change management ------------------------------------------------
    /**
     * every component should be able to be restet and must implement
     * the reset function
     * 2024-05-24 rvion: we could have some generic reset function that
     * | simply do a this.setValue(this.defaultValue)
     * | but it feels like a wrong implementation 🤔
     * | it's simpler  though
     * 🔶 some widget like `WidgetPrompt` would not work with such logic
     * */
    abstract reset(): void
    abstract readonly hasChanges: boolean

    /**
     * 2024-05-24 rvion: do we want some abstract defaultValue() too ?
     * feels like it's going to be PITA to use for higher level objects 🤔
     * but also... why not...
     * 🔶 some widget like `WidgetPrompt` would not work with such logic
     * 🔶 some widget like `Optional` have no simple way to retrieve the default value
     */
    // abstract readonly defaultValue: this['spec']['$Value'] |

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

    abstract value: unknown

    /**
     * return a short string summary
     * expected to be overriden in child classes
     */
    get summary() {
        return JSON.stringify(this.value)
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

    /**
     * this method can be heavilly optimized
     * todo:
     *  - by storing the published value locally
     *  - by defining a getter on the _advertisedValues object of all parents
     *  - by only setting this getter up once.
     * */
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

    /** parent widget of this widget, if any */
    abstract readonly parent: IWidget | null

    /** default body UI */
    abstract readonly DefaultBodyUI: CovariantFC<any> | undefined

    /** the widget state that will be persisted UI */
    abstract serial: { collapsed?: boolean }

    get isHidden(): boolean {
        if (this.config.hidden != null) return this.config.hidden
        if (isWidgetGroup(this) && Object.keys(this.fields).length === 0) return true
        return false
    }

    /** whether the widget should be considered inactive */
    get isDisabled(): boolean {
        return isWidgetOptional(this) && !this.serial.active
    }

    get isCollapsed(): boolean {
        if (!this.isCollapsible) return false
        if (this.serial.collapsed != null) return this.serial.collapsed
        if (this.parent?.isDisabled) return true
        return false
    }

    /** if specified, override the default algorithm to decide if the widget should have borders */
    get isCollapsible(): boolean {
        // top level widget is not collapsible; we may want to revisit this decision
        // if (widget.parent == null) return false
        if (this.config.collapsed != null) return this.config.collapsed //
        if (!this.DefaultBodyUI) return false // 🔴 <-- probably a mistake here
        if (this.config.label === false) return false
        return true
    }

    /** if provided, override the default logic to decide if the widget need to be bordered */
    get border(): boolean {
        // avoif borders for the top level form
        if (this.parent == null) return false
        // if (this.parent.subWidgets.length === 0) return false
        // if app author manually specify they want no border, then we respect that
        if (this.config.border != null) return this.config.border
        // if the widget do NOT have a body => we do not show the border
        if (this.DefaultBodyUI == null) return false // 🔴 <-- probably a mistake here
        // default case when we have a body => we show the border
        return true
    }

    /** root form this widget has benn registered to */
    abstract readonly form: Form

    // FOLD ----------------------------------------------------
    setCollapsed(val?: boolean) {
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

    /** list of all subwidgets, without named keys */
    get subWidgets(): IWidget[] {
        return []
    }
    /** list of all subwidgets, without named keys */
    get subWidgetsWithKeys(): { key: string; widget: IWidget }[] {
        return []
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

    get icon(): Maybe<IconName> {
        const x = this.spec.config.icon as any // 🔴 TS BUG / PERF
        if (x == null) return null
        if (typeof x === 'string') return x as any // 🔴 TS BUG / PERF
        return x(this)
    }

    /** this function MUST be called at the end of every widget constructor */
    init(mobxOverrides: any) {
        // make the object deeply observable including this base class
        makeAutoObservableInheritance(this, mobxOverrides)

        const self = this as any as IWidget
        const config = self.config
        const serial = self.serial

        // run the config.onCreation if needed
        if (config.onCreate) {
            const oldKey = serial._creationKey
            const newKey = config.onCreate.evaluationKey ?? 'default'
            if (oldKey !== newKey) {
                config.onCreate(this)
                serial._creationKey = newKey
            }
        }

        // run the config.onInit if needed
        if (config.onInit) {
            config.onInit(this)
        }
    }
}
