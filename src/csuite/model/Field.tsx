import type { Field_shared } from '../fields/shared/FieldShared'
import type { WidgetLabelContainerProps } from '../form/WidgetLabelContainerUI'
import type { WidgetWithLabelProps } from '../form/WidgetWithLabelUI'
import type { IconName } from '../icons/icons'
import type { TintExt } from '../kolor/Tint'
import type { ITreeElement } from '../tree/TreeEntry'
import type { ProplessFC } from '../types/ReactUtils'
import type { CovariantFC } from '../variance/CovariantFC'
import type { $FieldTypes } from './$FieldTypes'
import type { BaseSchema } from './BaseSchema'
import type { FieldSerial_CommonProperties } from './FieldSerial'
import type { Instanciable } from './Instanciable'
import type { Channel, ChannelId } from './pubsub/Channel'
import type { Producer } from './pubsub/Producer'
import type { Repository } from './Repository'
import type { Problem, Problem_Ext } from './Validation'

import { observer } from 'mobx-react-lite'
import { createElement, type FC, type ReactNode } from 'react'

import { CSuiteOverride } from '../ctx/CSuiteOverride'
import { getFieldSharedClass, isFieldGroup, isFieldOptional } from '../fields/WidgetUI.DI'
import { FormAsDropdownConfigUI } from '../form/FormAsDropdownConfigUI'
import { FormUI, type FormUIProps } from '../form/FormUI'
import { WidgetErrorsUI } from '../form/WidgetErrorsUI'
import { WidgetHeaderContainerUI } from '../form/WidgetHeaderContainerUI'
import { WidgetLabelCaretUI } from '../form/WidgetLabelCaretUI'
import { WidgetLabelContainerUI } from '../form/WidgetLabelContainerUI'
import { WidgetLabelIconUI } from '../form/WidgetLabelIconUI'
import { WidgetToggleUI } from '../form/WidgetToggleUI'
import { WidgetWithLabelUI } from '../form/WidgetWithLabelUI'
import { makeAutoObservableInheritance } from '../mobx/mobx-store-inheritance'
import { SimpleSchema } from '../simple/SimpleSchema'
import { potatoClone } from '../utils/potatoClone'
import { $FieldSym } from './$FieldSym'
import { autofixSerial_20240711 } from './autofix/autofixSerial_20240711'
import { type FieldId, mkNewFieldId } from './FieldId'
import { TreeEntry_Field } from './TreeEntry_Field'
import { normalizeProblem } from './Validation'

/** make sure the user-provided function will properly react to any mobx changes */
const ensureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
    if (fn == null) return null as T
    const isObserver = '$$typeof' in fn && fn.$$typeof === Symbol.for('react.memo')
    const FmtUI = (isObserver ? fn : observer(fn)) as T
    return FmtUI
}

export type KeyedField = { key: string; field: Field }

export interface Field<K extends $FieldTypes = $FieldTypes> {
    $Type: K['$Type'] /** type only properties; do not use directly; used to make typings good and fast */
    $Config: K['$Config'] /** type only properties; do not use directly; used to make typings good and fast */
    $Serial: K['$Serial'] /** type only properties; do not use directly; used to make typings good and fast */
    $Value: K['$Value'] /** type only properties; do not use directly; used to make typings good and fast */
    $Field: K['$Field'] /** type only properties; do not use directly; used to make typings good and fast */
}
//     👆 (merged at type-level here to avoid having extra real properties defined at runtime)

export abstract class Field<out K extends $FieldTypes = $FieldTypes> implements Instanciable<K['$Field']> {
    /**
     * unique Field instance ID;
     * each node in the form tree has one;
     * NOT persisted in serial.
     * change every time the field is instanciated
     */
    readonly id: FieldId

    /** wiget serial is the full serialized representation of that widget  */
    readonly serial: K['$Serial']

    /**
     * singleton repository for the project
     * allow access to global domain, as well as any other live field
     * and other shared resource
     */
    repo: Repository

    /** root of the field tree this field belongs to */
    root: Field

    /** parent field, (null when root) */
    parent: Field | null

    /** schema used to instanciate this widget */
    schema: BaseSchema<K['$Field']>

    constructor(
        /**
         * singleton repository for the project
         * allow access to global domain, as well as any other live field
         * and other shared resource
         */
        repo: Repository,
        /** root of the field tree this field belongs to */
        root: Field | null,
        /** parent field, (null when root) */
        parent: Field | null,
        /** schema used to instanciate this widget */
        schema: BaseSchema<K['$Field']>,
        serial?: K['$Serial'],
    ) {
        this.id = mkNewFieldId()
        this.repo = repo
        this.root = root ?? this
        this.parent = parent
        this.schema = schema
        this.serial = serial ?? { $: (this.constructor as any).type }
    }

    // static get mobxOverrideds() {
    //     throw new Error('`mobxOverrideds` should be overridden in subclass')
    // }

    // static get type(): Field['$Type'] {
    //     throw new Error('This method should be overridden in subclass')
    // }

    get type(): Field['$Type'] {
        return (this.constructor as any).type
    }

    /** wiget value is the simple/easy-to-use representation of that widget  */
    abstract value: K['$Value']

    /** own errors specific to this widget; must NOT include child errors */
    abstract readonly ownProblems: Problem_Ext

    /**
     * TODO later: make abstract to make sure we
     * have that on every single field + add field config option
     * to customize that. useful for tests.
     */
    randomize(): void {}

    /** field is already instanciated => probably used as a linked */
    instanciate(
        //
        repo: Repository,
        root: Field<any>,
        parent: Field | null,
        serial: any | null,
    ): Field_shared<this> {
        const FieldSharedClass = getFieldSharedClass()
        const schema = new SimpleSchema<Field_shared<this>>(FieldSharedClass, { field: this })
        return schema.instanciate(repo, root, parent, serial)
    }

    protected abstract setOwnSerial(serial: Maybe<K['$Serial']>): void

    /**
     * list of all functions to run at dispose time
     * allow for instance to register mobx disposers from reactions
     * and other similar stuff that may need to be cleaned up to
     * avoid memory leak.
     */
    protected disposeFns: (() => void)[] = []

    /**
     * lifecycle method, is called
     * TODO: 🔴
     * @since 2024-07-05
     */
    disposeTree(): void {
        this.disposeSelf()

        // dispose all children
        for (const sub of this.subFields) {
            sub.disposeTree()
        }
    }

    private disposeSelf(): void {
        // TODO:
        // - disable all publish
        // - disable all reactions
        // - mark as DELETED;  => makes most function throw an error if used

        // unregister from repo
        this.repo._unregisterField(this)

        // dispose all reactions/other long-running stuff
        for (const disposeFn of this.disposeFns) {
            disposeFn()
        }
    }

    /**
     * will be set to true after the first initialization
     * TODO: also use that to wait for whole tree to be patched before applying effects
     * */
    ready = false

    /** YOU PROBABLY DO NOT WANT TO OVERRIDE THIS */
    setSerial(serial: Maybe<K['$Serial']>): void {
        autofixSerial_20240711(serial)
        this.runInValueTransaction(() => {
            this.copyCommonSerialFields(serial)
            this.setOwnSerial(serial)
        })
    }

    private copyCommonSerialFields(s: Maybe<FieldSerial_CommonProperties>): void {
        if (s == null) return
        if (s._version != null) this.serial._version = s._version
        if (s.collapsed != null) this.serial.collapsed = s.collapsed
        if (s.custom != null) this.serial.custom = s.custom
        if (s.lastUpdatedAt != null) this.serial.lastUpdatedAt = s.lastUpdatedAt
    }

    /** unified api to allow setting serial from value */
    setValue(val: K['$Value']): void {
        this.value = val
    }

    RECONCILE<SCHEMA extends Instanciable>(p: {
        existingChild: Maybe<Field>
        correctChildSchema: SCHEMA
        /** the target child to clone/apply into child */
        targetChildSerial: Maybe<SCHEMA['$Serial']>
        /** must attach/register both
         *  - child into parent where it belongs
         *  - child.serial into parent.serial where it belongs  */
        attach(child: SCHEMA['$Field']): void
    }): void {
        let child = p.existingChild
        if (child != null && child.type === p.correctChildSchema.type) {
            child.setSerial(p.targetChildSerial)
        } else {
            if (child) child.disposeTree()
            child = p.correctChildSchema.instanciate(
                //
                this.repo,
                this.root,
                this,
                p.targetChildSerial,
            )
            // attach child to current serial
            p.attach(child)
        }
    }

    // ---------------------------------------------------------------------------------------------------
    /** default header UI */
    abstract readonly DefaultHeaderUI: CovariantFC<{ field: K['$Field'] }> | undefined

    /** default body UI */
    abstract readonly DefaultBodyUI: CovariantFC<{ field: K['$Field'] }> | undefined

    UIToggle: FC<{ className?: string }> = (p) => <WidgetToggleUI field={this} {...p} />
    UIErrors: ProplessFC = () => <WidgetErrorsUI field={this} />
    UILabelCaret: ProplessFC = () => <WidgetLabelCaretUI field={this} />
    UILabelIcon: ProplessFC = () => <WidgetLabelIconUI widget={this} />
    UILabelContainer: FC<WidgetLabelContainerProps> = (p) => <WidgetLabelContainerUI {...p} />
    UIHeaderContainer: FC<{ children: ReactNode }> = (p) => (
        <WidgetHeaderContainerUI field={this}>{p.children}</WidgetHeaderContainerUI>
    )

    get actualWidgetToDisplay(): Field {
        return this
    }

    get indentChildren(): number {
        return 1
    }

    get justifyLabel(): boolean {
        if (this.config.justifyLabel != null) return this.config.justifyLabel
        if (this.DefaultBodyUI) return false // 🔴 <-- probably a mistake here
        return true
    }

    get depth(): number {
        if (this.parent == null) return 0
        return this.parent.depth + this.parent.indentChildren
    }

    /** DO NOT OVERRIDE; used internally to properly schedule events */
    get trueDepth(): number {
        if (this.parent == null) return 0
        return this.parent.trueDepth + 1
    }

    // abstract readonly id: string
    asTreeElement(key: string): ITreeElement<{ widget: Field; key: string }> {
        return {
            key: (this as any).id,
            ctor: TreeEntry_Field as any,
            props: { key, widget: this as any },
        }
    }

    /** shorthand access to schema.config */
    get config(): this['$Config'] {
        return this.schema.config
    }

    get animateResize(): boolean {
        return true
    }

    /**
     * return true when widget has no child
     * return flase when widget has one or more child
     * */
    get hasNoChild(): boolean {
        return this.subFields.length === 0
    }

    /**
     * @status NOT IMPLEMENTED
     * @deprecated
     * return a short summary of changes from last snapshot
     * */
    get diffSummaryFromSnapshot(): string {
        throw new Error('❌ not implemented')
    }

    /**
     * @since 2024-06-20
     * @status broken
     * return a short summary of changes from default
     */
    get diffSummaryFromDefault(): string {
        return [
            this.hasChanges //
                ? `${this.path}(${this.value?.toString?.() ?? '.'})`
                : null,
            ...this.subFields.map((w) => w.diffSummaryFromDefault),
        ]
            .filter(Boolean)
            .join('\n')
    }

    /** path within the model */
    get path(): string {
        const p = this.parent
        if (p == null) return '$'
        return p.path + '.' + this.mountKey
    }

    get mountKey(): string {
        if (this.parent == null) return '$'
        return this.parent.subFieldsWithKeys.find(({ field }) => field === this)?.key ?? '<error>'
    }

    /** collapse all children that can be collapsed */
    collapseAllChildren(): void {
        for (const _item of this.subFields) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.actualWidgetToDisplay
            if (item.serial.collapsed) continue
            const isCollapsible = item.isCollapsible
            if (isCollapsible) item.setCollapsed(true)
        }
    }

    /** expand all children that can are collapsed */
    expandAllChildren(): void {
        for (const _item of this.subFields) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.actualWidgetToDisplay
            item.setCollapsed(undefined)
        }
    }

    // change management ------------------------------------------------
    /**
     *
     * RULES:
     * - every component should be able to be restet and must implement
     *   the reset function
     * - Reset MUST NEVER be called fromt the constructor
     * - RESET WILL TRIGGER VALUE/SERIAL update events.
     *
     * 2024-05-24 rvion: we could have some generic reset function that
     * | simply do a this.setValue(this.defaultValue)
     * | but it feels like a wrong implementation 🤔
     * | it's simpler  though
     * 🔶 some widget like `WidgetPrompt` would not work with such logic
     * */
    reset(): void {
        this.setSerial(null)
    }

    /** return a cloned/detached value object you can use anywhere without care */
    toValueJSON(): K['$Value'] {
        return JSON.parse(JSON.stringify(this.value))
    }

    /** return a clone/detached serial object you can use anywhere without care */
    toSerialJSON(): K['$Serial'] {
        return JSON.parse(JSON.stringify(this.serial))
    }

    /** every child class must implement change detection from its default  */
    abstract readonly hasChanges: boolean

    /**
     * 2024-05-24 rvion: do we want some abstract defaultValue() too ?
     * feels like it's going to be PITA to use for higher level objects 🤔
     * but also... why not...
     * 🔶 some widget like `WidgetPrompt` would not work with such logic
     * 🔶 some widget like `Optional` have no simple way to retrieve the default value
     */
    // abstract readonly defaultValue: this['schema']['$Value'] |

    $FieldSym: typeof $FieldSym = $FieldSym

    /**
     * when this widget or one of its descendant publishes a value,
     * it will be stored here and possibly consumed by other descendants
     */
    _advertisedValues: Record<ChannelId, any> = {}

    /**
     * when consuming an advertised value,
     * walk upward the parent chain, and look for
     * a value stored in the advsertised values
     */
    consume<T extends any>(chan: Channel<T> | ChannelId): Maybe<T> /* 🔸: T | $EmptyChannel */ {
        const channelId = typeof chan === 'string' ? chan : chan.id
        let at = this as any as Field | null
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

    /**
     * return a short string summary that display the value in a simple way.
     * This method is expected to be overriden in most child classes
     */
    get summary(): string {
        return JSON.stringify(this.value)
    }

    /**
     * Retrive the config custom data.
     * 🔶: NOT TO BE CONFUSED WITH `getFieldCustom`
     * Config custom data is NOT persisted anywhere,
     * You can set config.custom when defining your schema.
     * This data is completely unused internally by CSuite.
     * It is READONLY.
     */
    getConfigCustom<T = unknown>(): Readonly<T> {
        return this.config.custom ?? {}
    }

    /**
     * Retrive the field custom data.
     * 🔶: NOT TO BE CONFUSED WITH `getConfigCustom`
     * Field custom data are persisted in the serial.custom.
     * This data is completely unused internally by CSuite.
     * You can use them however you want provided you keep them serializable.
     * It's just a quick/hacky place to store stuff
     */
    getFieldCustom<T = unknown>(): T {
        return this.serial.custom
    }

    /**
     * update
     * You can either return a new value, or patch the initial value
     * use `deleteFieldCustomData` instead to replace the value by null or undefined.
     */
    updateFieldCustom<T = unknown>(fn: (x: Maybe<T>) => T): this {
        const prev = this.value
        const next = fn(prev) ?? prev
        this.serial.custom = JSON.parse(JSON.stringify(next))
        this.applySerialUpdateEffects()
        return this
    }

    /** delete field custom data (delete this.serial.custom)  */
    deleteFieldCustomData(): this {
        delete this.serial.custom
        this.applySerialUpdateEffects()
        return this
    }

    /**
     * all own errors:
     *  + base/default (built-in field, e.g. minLength for string)
     *  + custom       (user-defined in config) */
    get errors(): Problem[] {
        const ownProblems = normalizeProblem(this.ownProblems)
        return [...ownProblems, ...this.customOwnProblems]
    }

    // 2024-07-21 (1) rvion:
    // | ARRRGH !! this is not cached for some reason !!
    // | array is everytime recreated => FormUI is re-rendered
    // 2024-07-21 (2) rvion:
    // | this is related to mobx-store-inheritance not working properly
    get allErrorsIncludingChildrenErros(): Problem[] {
        return this.errors.concat(this.subFields.flatMap((f) => f.allErrorsIncludingChildrenErros))
    }

    /**
     * returns the list of all ancestors, NOT including self
     * @since 2024-07-08
     */
    get ancestors(): Field[] {
        const result: Field[] = []
        let current: Maybe<Field> = this.parent
        while (current) {
            result.push(current)
            current = current.parent
        }
        return result
    }

    /**
     * returns the list of all ancestors, including self
     * @since 2024-07-08
     */
    get ancestorsIncludingSelf(): Field[] {
        const result: Field[] = []
        // eslint-disable-next-line consistent-this
        let current: Maybe<Field> = this
        while (current) {
            result.push(current)
            current = current.parent
        }
        return result
    }

    get customOwnProblems(): Problem[] {
        if (this.config.check == null)
            return [
                /* { message: 'No check function provided' } */
            ]
        const res = this.config.check(this)
        return normalizeProblem(res)
        // return [...normalizeProblem(res), { message: 'foo' }]
    }

    // BUMP ----------------------------------------------------
    /**
     * everytime a field serial is udpated, we should call this function.
     * this function is called recursivelu upwards.
     * persistance will usually be done at the root field reacting to this event.
     */
    applySerialUpdateEffects(): void {
        this.config.onSerialChange?.(this)
        // this.parent?.applySerialUpdateEffects()
    }

    // 💬 2024-03-15 rvion: use this regexp to quickly review manual serial set patterns
    // | `serial\.[a-zA-Z_]+(\[[a-zA-Z_]+\])? = `
    applyValueUpdateEffects(): void {
        // ⏸️ this.serial.lastUpdatedAt = Date.now() as Timestamp
        this.config.onValueChange?.(this)
    }

    /** recursively walk upwards on any field change  */
    // private applyValueUpdateEffects_OF_CHILD(child: Field): void {
    //     this.serial.lastUpdatedAt = Date.now() as Timestamp
    //     this.parent?.applyValueUpdateEffects_OF_CHILD(child)
    //     this.config.onValueChange?.(this /* TODO: add extra param here:, child  */)
    //     this.publishValue() // 🔴  should probably be a reaction rather than this
    // }

    /**
     * this method can be heavilly optimized
     * ping @globi
     * todo:
     *  - by storing the published value locally
     *  - by defining a getter on the _advertisedValues object of all parents
     *  - by only setting this getter up once.
     * */
    publishValue(this: Field): void {
        const producers = this.schema.producers
        if (producers.length === 0) return

        // Create and store values for every producer
        const producedValues: Record<ChannelId, any> = {}
        for (const producer of producers) {
            const channelId = typeof producer.chan === 'string' ? producer.chan : producer.chan.id
            producedValues[channelId] = producer.produce(this)
        }
        // Assign values to every parent widget in the hierarchy
        let at = this as any as Field | null
        while (at != null) {
            Object.assign(at._advertisedValues, producedValues)
            at = at.parent
        }
    }

    get isHidden(): boolean {
        if (this.config.hidden != null) return this.config.hidden
        if (isFieldGroup(this) && Object.keys(this.fields).length === 0) return true
        return false
    }

    /** whether the widget should be considered inactive */
    get isDisabled(): boolean {
        return isFieldOptional(this) && !this.serial.active
    }

    get isCollapsedByDefault(): boolean {
        return false
    }

    get isCollapsed(): boolean {
        if (!this.isCollapsible) return false
        if (this.serial.collapsed != null) return this.serial.collapsed
        if (this.parent?.isDisabled) return true
        return this.isCollapsedByDefault ?? false
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

    get background(): TintExt | undefined {
        return this.config.background
    }

    /** if provided, override the default logic to decide if the widget need to be bordered */
    get border(): TintExt {
        // avoif borders for the top level form
        if (this.parent == null) return false
        // if (this.parent.subWidgets.length === 0) return false
        // if app author manually specify they want no border, then we respect that
        if (this.config.border != null) return this.config.border
        // if the widget do NOT have a body => we do not show the border
        if (this.DefaultBodyUI == null) return false // 🔴 <-- probably a mistake here
        // default case when we have a body => we show the border
        return false
        // return 8
    }

    // FOLD ----------------------------------------------------
    setCollapsed(val?: boolean): void {
        if (this.serial.collapsed === val) return
        this.serial.collapsed = val
        this.applySerialUpdateEffects()
    }

    toggleCollapsed(this: Field): void {
        this.serial.collapsed = !this.serial.collapsed
        this.applySerialUpdateEffects()
    }

    // UI ----------------------------------------------------

    /**
     * allow to quickly render the model as a react form
     * without having to import any component; usage:
     * | <div>{x.render()}</div>
     */
    render(p: Omit<FormUIProps, 'field'> = {}): ReactNode {
        return createElement(FormUI, { field: this, ...p })
    }

    /**
     * allow to quickly render the form in a dropdown button
     * without having to import any component; usage:
     * | <div>{x.renderAsConfigBtn()}</div>
     */
    renderAsConfigBtn(p?: {
        // 1. anchor option
        // ...TODO
        // 2. popup options
        title?: string
        className?: string
        maxWidth?: string
        minWidth?: string
        width?: string
    }): ReactNode {
        return createElement(FormAsDropdownConfigUI, { form: this, ...p })
    }

    renderSimple(this: Field, p?: Omit<WidgetWithLabelProps, 'field' | 'fieldName'>): JSX.Element {
        return (
            <WidgetWithLabelUI //
                key={this.id}
                field={this}
                showWidgetMenu={false}
                showWidgetExtra={false}
                showWidgetUndo={false}
                justifyLabel={false}
                fieldName='_'
                {...p}
            />
        )
    }

    renderSimpleAll(this: Field, p?: Omit<WidgetWithLabelProps, 'field' | 'fieldName'>): JSX.Element {
        return (
            <CSuiteOverride
                config={{
                    showWidgetMenu: false,
                    showWidgetExtra: false,
                    showWidgetUndo: false,
                }}
            >
                <WidgetWithLabelUI key={this.id} field={this} fieldName='_' {...p} />
            </CSuiteOverride>
        )
    }

    renderWithLabel(this: Field, p?: Omit<WidgetWithLabelProps, 'field'>): JSX.Element {
        return (
            <WidgetWithLabelUI //
                key={this.id}
                field={this}
                fieldName={p?.fieldName ?? '_'}
                {...p}
            />
        )
    }

    defaultHeader(this: Field): JSX.Element | undefined {
        if (this.DefaultHeaderUI == null) return
        return <this.DefaultHeaderUI field={this} />
    }

    defaultBody(this: Field): JSX.Element | undefined {
        if (this.DefaultBodyUI == null) return
        return <this.DefaultBodyUI field={this} />
    }

    header(this: Field): JSX.Element | undefined {
        const HeaderUI =
            'header' in this.config //
                ? ensureObserver(this.config.header)
                : this.DefaultHeaderUI
        if (HeaderUI == null) return
        return <HeaderUI field={this} />
    }

    body(this: Field): JSX.Element | undefined {
        const BodyUI =
            'body' in this.config //
                ? ensureObserver(this.config.body)
                : this.DefaultBodyUI
        if (BodyUI == null) return
        return <BodyUI field={this} />
    }

    /** list of all subwidgets, without named keys */
    get subFields(): Field[] {
        return []
    }

    /** list of all subwidgets, without named keys */
    get subFieldsWithKeys(): KeyedField[] {
        return []
    }

    /**
     * proxy this.repo.action
     * defined to shorted call and allow per-field override
     */
    runInValueTransaction<T>(fn: () => T): T {
        return this.repo.TRANSACT(fn, this, 'value', 'WITH_EFFECT')
    }

    runInAutoTransaction<T>(fn: () => T): T {
        return this.repo.TRANSACT(fn, this, 'auto', 'WITH_EFFECT')
    }

    runInSerialTransaction<T>(fn: () => T): T {
        return this.repo.TRANSACT(fn, this, 'serial', 'WITH_EFFECT')
    }

    private runInCreateTransaction<T>(fn: () => T): T {
        return this.repo.TRANSACT(fn, this, 'create', 'NO_EFFECT')
    }

    // --------------------------------------------------------------------------------
    // 🔶 the 5 getters bellow are temporary hacks to make shared keep working
    // until every shared usage has been migrated

    /** getter that resolve to `this.schema.producers` */
    get producers(): Producer<any, any>[] {
        return this.schema.producers
    }

    /** getter that resolve to `this.schema.publish` */
    get publish(): BaseSchema['publish'] {
        return this.schema.publish
    }

    /** getter that resolve to `this.schema.subscribe` */
    get subscribe(): BaseSchema['subscribe'] {
        return this.schema.subscribe
    }

    /** getter that resolve to `this.schema.reactions` */
    get reactions(): BaseSchema['reactions'] {
        return this.schema.reactions
    }

    /** getter that resolve to `this.schema.addReaction` */
    get addReaction(): BaseSchema['addReaction'] {
        return this.schema.addReaction
    }

    get icon(): Maybe<IconName> {
        const x = this.schema.config.icon as any // 🔴 TS BUG / PERF
        if (x == null) return null
        if (typeof x === 'string') return x as any // 🔴 TS BUG / PERF
        return x(this)
    }

    private _hasBeenInitialized: boolean = false

    /** this function MUST be called at the end of every widget constructor */
    protected init(serial?: K['$Serial'], mobxOverrides?: any): void {
        autofixSerial_20240711(serial)

        // 1. ensure field hasn't been initialized yet
        if (this._hasBeenInitialized) {
            console.error(`[🔶] Field.init has already been called => ABORTING`)
            return
        }
        this._hasBeenInitialized = true

        // 2. apply extensiosn
        this.schema.applyExts(this)

        // 3. ...
        this.runInCreateTransaction(() => {
            this.copyCommonSerialFields(serial)

            //   VVVVVVVVVVVV this is where we hydrate children
            this.setOwnSerial(serial)

            // make the object deeply observable including this base class
            makeAutoObservableInheritance(this, {
                // schema should not be able
                schema: false,

                // components should not be observable; otherwise, it breaks the hot reload in dev-mode
                UIToggle: false,
                UIErrors: false,
                UILabelCaret: false,
                UILabelIcon: false,
                UILabelContainer: false,
                UIHeaderContainer: false,

                // overrides retrieved from parents
                ...mobxOverrides,
            })

            this.repo._registerField(this)
            this.ready = true
        })
    }

    get hasSnapshot(): boolean {
        return this.serial.snapshot != null
    }

    get hasFoldableSubfieldsThatAreUnfolded(): boolean {
        return this.subFields.some((f) => f.isCollapsible && !f.serial.collapsed)
    }

    get hasFoldableSubfieldsThatAreFolded(): boolean {
        return this.subFields.some((f) => f.isCollapsible && f.serial.collapsed)
    }

    get hasFoldableSubfields(): boolean {
        return this.subFields.some((f) => f.isCollapsible)
    }

    deleteSnapshot(): void {
        delete this.serial.snapshot
        this.applySerialUpdateEffects()
    }

    /** update current field snapshot */
    saveSnapshot(): this['$Serial'] {
        const snapshot = potatoClone(this.serial)

        // a bad person would say: "Yo, Dawg; I heard you liked snapshots. So I put a snapshot in your snapshot, so you can snapshot while snapshotting"
        // but it's wrong. we don't want snapshotception.
        // so we delete the snapshot from the snapshot before it's too late.
        // otherwise, once we take a second snapshot, the first snapshot will indeed appear in the second snapshot.
        // Snapshot.
        delete snapshot.snapshot

        this.serial.snapshot = snapshot
        this.applySerialUpdateEffects()
        return snapshot
    }

    /** rever to the last snapshot */
    revertToSnapshot(): void {
        // 🔘 IX++
        // 🔘 console.log(`[🤠] #${IX} seri`, getUIDForMemoryStructure(this.serial))
        // 🔘 console.log(`[🤠] #${IX} snap`, getUIDForMemoryStructure(this.serial.snapshot))

        // 🔘 console.log(`[🤠] #${IX} seri.values`, getUIDForMemoryStructure(this.serial?.values))
        // 🔘 console.log(`[🤠] #${IX} snap.values`, getUIDForMemoryStructure(this.serial.snapshot?.values))
        if (this.serial.snapshot == null) {
            // 🔘 console.log(`[🤠] #${IX} RESET`)
            return this.reset()
        }
        // 🔘 console.log(`[🤠] #${IX} SNAP=`, deepCopyNaive(this.serial.snapshot))
        this.setSerial(this.serial.snapshot)
    }
}
// 🔘 let IX = 0

/**
 * RULES:
 *
 * any serial modification function must go through
 *  - this.SERMUT(() => { ... }) if not modifying the value
 *  - this.VALMUT(() => { ... }) if modifying the value
 *
 * setOwnSerial:
 *       A. /!\ THIS METHOD MUST BE IDEMPOTENT /!\
 *
 *       B. /!\ THIS METHOD MUST BE CALLED ON INIT AND SET_SERIAL /!\
 *
 *       0. MUST NEVER USE THE serial object provided by default
 *            FIELD MUST ALWAYS CREATE A NEW OBJECT at init time
 *            | always create a new 0
 *
 *       1. MUST KEEP ITS CURRENT SERIAL REFERENCE through setSerial/setValue calls
 *            | goal: make sure we never have stale references
 *            | => allow to abort early if same ref equality check successfull
 *            | => do not replace your serial object, only assign to it
 *            | YES, kinda opposite of #0, but once created, I'd rather  preserve the same
 *            | object
 *
 *       ❌ 2. NEVER CHANGE A SERIAL ID => NO more IDSs.
 *       ❌      | IDs are runtime only (formulas persist paths, and react to field.path changew)
 *       ❌      | => please. be kind. don't
 *
 *       3. MUST ONLY CHANGE own-data, not data belonging to child
 *            | => setSerial should call setSerial on already instanciated children
 *
 *       ❌ 4 IF FIELD HAS CHILD, must do reconciliation based on child ID.
 *       ❌      | => list MUST NOT BLINDLY REPLACE it's children by index
 *
 *       5 CONSTRUCTOR MUST USE THE FUNCTION; logic should not be duplicated if p'ossible
 *
 *       if you override setSerial, make sure rules above are respected.
 *       ideally, add checkmarks near
 *
 *       2024-07-05 precision to document:
 *               | setOwnSerial is expected to somewhat call setSerial
 *               | of every of it's children, and forward the applyEffects flag
 *
 */
