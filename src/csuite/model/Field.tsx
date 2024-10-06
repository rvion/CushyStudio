import type { Field_list_serial } from '../fields/list/FieldList'
import type { Field_optional_serial } from '../fields/optional/FieldOptional'
import type { Field_shared } from '../fields/shared/FieldShared'
import type { WidgetLabelContainerProps } from '../form/WidgetLabelContainerUI'
import type { IconName } from '../icons/icons'
import type { TintExt } from '../kolor/Tint'
import type { ITreeElement } from '../tree/TreeEntry'
import type { ProplessFC } from '../types/ReactUtils'
import type { CovariantFC } from '../variance/CovariantFC'
import type { FieldTypes } from './$FieldTypes'
import type { BaseSchema } from './BaseSchema'
import type { TypeImportLocation } from './codegen/ImportLocation'
import type { DraftLike } from './Draft'
import type { FieldConstructor_ViaClass, SerialMigrationFunction, UNVALIDATED } from './FieldConstructor'
import type { FieldId } from './FieldId'
import type { FieldSerial } from './FieldSerial'
import type { Instanciable } from './Instanciable'
import type { Channel, ChannelId } from './pubsub/Channel'
import type { Producer } from './pubsub/Producer'
import type { Repository } from './Repository'
import type { Transaction } from './Transaction'
import type { Problem, Problem_Ext } from './Validation'

import { produce, setAutoFreeze } from 'immer'
import { $mobx, type AnnotationsMap, extendObservable, isObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createElement, type FC, type ReactNode, useMemo } from 'react'

// import { useDebugReasonOfRerendering, useDebugRerender } from '../../../../front/reusable/useDebugUnmount'
import { csuiteConfig } from '../config/configureCsuite'
import {
    getFieldSharedClass,
    isFieldChoice,
    isFieldChoices,
    isFieldGroup,
    isFieldOptional,
    isProbablySerialList,
    isProbablySerialOptional,
    isProbablySomeFieldSerial,
} from '../fields/WidgetUI.DI'
import { FormAsDropdownConfigUI } from '../form/FormAsDropdownConfigUI'
import { WidgetErrorsUI } from '../form/WidgetErrorsUI'
import { WidgetHeaderContainerUI } from '../form/WidgetHeaderContainerUI'
import { WidgetLabelCaretUI } from '../form/WidgetLabelCaretUI'
import { WidgetLabelContainerUI } from '../form/WidgetLabelContainerUI'
import { WidgetLabelIconUI } from '../form/WidgetLabelIconUI'
import { WidgetToggleUI } from '../form/WidgetToggleUI'
import { hashJSONObjectToNumber } from '../hashUtils/hash'
import { annotationsSymbol, makeAutoObservableInheritance } from '../mobx/mobx-store-inheritance'
import { SimpleSchema } from '../simple/SimpleSchema'
import { exhaust } from '../utils/exhaust'
import { makeLabelFromPrimitiveValue } from '../utils/makeLabelFromFieldName'
import { $FieldSym } from './$FieldSym'
import { autofixSerial_20240703 } from './autofix/autofixSerial_20240703'
import { autofixSerial_20240711 } from './autofix/autofixSerial_20240711'
import { mkNewFieldId } from './FieldId'
import { __ERROR, __OK, type Result } from './Result'
import { TreeEntry_Field } from './TreeEntry_Field'
import { normalizeProblem } from './Validation'
import { ValidationError } from './ValidationError'

/*
 * fact 1. mobx object can't be frozen;
 * fact 2. immer tries to freeze stuff
 * problem. yes.
 * solution: 👇
 */
setAutoFreeze(false)

/** make sure the user-provided function will properly react to any mobx changes */
export const useEnsureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
    return useMemo(() => ensureObserver(fn), [fn])
}

export type VALUE_MODE = 'fail' | 'zero' | 'unchecked'

export const ensureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
    if (fn == null) return null as T
    const isObserver = '$$typeof' in fn && fn.$$typeof === Symbol.for('react.memo')
    const FmtUI = (isObserver ? fn : observer(fn)) as T
    return FmtUI
}

export type KeyedField = { key: string; field: Field }

export type FieldCtorProps<F extends FieldTypes = any> = [
    //
    repo: Repository,
    root: Field | null,
    parent: Field | null,
    schema: BaseSchema<F>,
    initialMountKey: string,
    serial?: F['$Serial'],
]

export interface Field<K extends FieldTypes = FieldTypes> {
    $Type: K['$Type'] /** type only properties; do not use directly; used to make typings good and fast */
    $Config: K['$Config'] /** type only properties; do not use directly; used to make typings good and fast */
    $Serial: K['$Serial'] /** type only properties; do not use directly; used to make typings good and fast */
    $Value: K['$Value'] /** type only properties; do not use directly; used to make typings good and fast */
    $Field: K['$Field'] /** type only properties; do not use directly; used to make typings good and fast */
    $Unchecked: K['$Unchecked'] /** type only properties; do not use directly; used to make typings good and fast */
    $Child: K['$Child'] /** type only properties; do not use directly; used to make typings good and fast */
    $Reflect: K['$Reflect'] /** type only properties; do not use directly; used to make typings good and fast */
}

/**
 * Only use this type in the base field, when you can assume
 * it will be properly re-typed in sub-classes
 */
export type UNSAFE_AnyField = any // Field<any>

export abstract class Field<out K extends FieldTypes = FieldTypes> implements Instanciable<K['$Field']>, DraftLike<K> {
    /** @internal */
    static build: 'new' = 'new'

    /**
     * unique Field instance ID;
     * each node in the form tree has one;
     * NOT persisted in serial.
     * change every time the field is instanciated
     */
    readonly id: FieldId

    /** wiget serial is the full serialized representation of that widget  */
    serial: K['$Serial']

    /**
     * singleton repository for the project
     * allow access to global domain, as well as any other live field
     * and other shared resource
     */
    repo: Repository

    /** root of the field tree this field belongs to */
    root: Field

    /** alias to root; since that's what `document` is. */
    get document(): Field {
        return this.root
    }

    /** parent field, (null when root) */
    parent: Field | null

    /** schema used to instanciate this widget */
    schema: BaseSchema<this> //K['$Field']>

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
        schema: BaseSchema<UNSAFE_AnyField /* K['$Field'] */>,
        initialMountKey: string,
        serial?: K['$Serial'],
    ) {
        this.id = mkNewFieldId()
        this.repo = repo
        this.root = root ?? this
        this.parent = parent
        this.schema = schema
        this.serial = serial ?? this._emptySerial
        this.mountKey = initialMountKey
    }

    // ⏸️ static get mobxOverrideds() {
    // ⏸️     throw new Error('`mobxOverrideds` should be overridden in subclass')
    // ⏸️ }

    // ⏸️ static get type(): Field['$Type'] {
    // ⏸️     throw new Error('This method should be overridden in subclass')
    // ⏸️ }

    /**
     * type of the field (e.g. 'str', 'color', 'group', 'optional', etc.)
     * Retrieved by looking in prototype for static `type` attribute.
     */
    get type(): Field['$Type'] {
        return (this.constructor as FieldConstructor_ViaClass<this>).type
    }

    private get _emptySerial(): K['$Serial'] {
        return (this.constructor as FieldConstructor_ViaClass<this>).emptySerial
    }

    private get _migrateSerial(): SerialMigrationFunction<K['$Serial']> {
        return (this.constructor as FieldConstructor_ViaClass<this>).migrateSerial
    }

    /** wiget value is the simple/easy-to-use representation of that widget  */
    abstract value: K['$Value']

    // 💬 2024-09-09 rvion:
    // | we can't actually use the following code to share get value() implementation
    // | because of mobx. Mobx force getters and setters to live on the same prototype.
    // |
    // | ```ts
    // | get value(): K['$Value'] {
    // |     return this.value_or_fail
    // | }
    // |
    // | set value(_newValue: K['$Value']) {
    // |     throw new Error(`❌ field_${this.type}.value = ... failed: setter not implemented`)
    // | }
    // | ```

    /**
     * crashes if the value is not set.
     * this method will NOT try to conjure any intented value.
     * @since 2024-09-03
     *
     * @see {@link value_or_zero}
     * @see {@link value_unchecked}
     */
    abstract value_or_fail: K['$Value']

    /**
     * Should do its best to return a value,
     * conjuring some default value if necessary
     * but you may THROW if zero does not exists
     * 🔶 do not return null, unless the type allows you to
     * @since 2024-09-03
     *
     * @see {@link value_or_fail}
     * @see {@link value_unchecked}
     *
     **/
    abstract value_or_zero: K['$Value']

    /**
     * this method
     *  - Always returns the advertized type (`Field['$Unchecked']`).
     *  - Never crashes
     *
     * @since 2024-09-03
     *
     * @see {@link value_or_fail}
     * @see {@link value_or_zero}

     */
    abstract value_unchecked: K['$Unchecked']

    /**
     * @since 2024-08-30
     * @stability beta
     */
    static migrateSerial(serial: FieldSerial<unknown>): any {
        return serial
    }

    /**
     * TODO later: make abstract to make sure we
     * have that on every single field + add field config option
     * to customize that. useful for tests.
     */
    randomize(): void {}

    // #region lifecycle

    /** field is already instanciated => probably used as a linked */
    instanciate(
        //
        repo: Repository,
        root: Field<any>,
        parent: Field | null,
        serial: any | null,
    ): Field_shared<this> {
        const FieldSharedClass = getFieldSharedClass()
        // 💬 2024-08-30 rvion:
        // | SimpleSchema usage is OK here, even if your project
        // | use a custom schema with extra methods; this is just some
        // | internal plumbing to allow to reuse fields from one tree
        // | in another tree as a linked/Shared field.
        // | 🟢            vvvvvvvvvvvv
        const schema = new SimpleSchema<Field_shared<this>>(FieldSharedClass, { field: this })
        return schema.instanciate(repo, root, parent, serial)
    }

    /**
     * list of all functions to run at dispose time
     * allow for instance to register mobx disposers from reactions
     * and other similar stuff that may need to be cleaned up to
     * avoid memory leak.
     */
    protected disposeFns: (() => void)[] = []

    /**
     * lifecycle method, is called
     *
     * @since 2024-07-05
     */
    disposeTree(): void {
        this.disposeSelf()

        // dispose all children
        for (const sub of this.childrenAll) {
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

    /**
     * if your field need to wait for the document to be ready;
     * this observable getter does that.
     *
     * @since 2024-09-04
     */
    get isDocumentReady(): boolean {
        return this.root.ready
    }

    // #region Serial
    // The whole serial business goes this way
    //
    // `setSerial()`
    // | - start a transaction
    // | - calls `setOwnSerialWithValidationAndMigrationAndFixes()`
    // |   | - does validation, migration, autofixes
    // |   | - call `setOwnSerial()` (abstract method) <-- 🫵 you implement that
    // |   |    | - for leaf fields:
    // |   |    |   > you just swap the serial, and possibly apply default if need be
    // |   |    |
    // |   |    | - for parent fields:
    // |   |    |   > recursively swap serial pointers to new objects
    // |   |    |   > reconcilation happen
    //
    //    then serial is updated, you can now check probles

    /** YOU PROBABLY DO NOT WANT TO OVERRIDE THIS */
    setSerial(
        /** this serial may be from a previous schema; we need to be able to handle properly */
        serial: Maybe<K['$Serial']>,
    ): void {
        this.runInValueTransaction(() => {
            // this.copyCommonSerialFields(serial)
            this.setOwnSerialWithValidationAndMigrationAndFixes(serial)
        })
    }

    /**
     * NEVER CALL THIS FUNCTION YOURSELF
     *
     * This function can only be called by `setOwnSerialWithValidationAndMigration`
     * which itself can only be called by `init` and `setSerial`
     */
    protected abstract setOwnSerial(serial: K['$Serial']): void

    /**
     * contains the list of all serial problems that occured during the last setSerial
     * it only contains the **LAST** setSerial problems
     * => this list will be emptied everytime we call setSerial
     *
     * @see {@link recordSerialProblem}
     * @since 2024-09-11

     */
    serialProblems: { msg: string; data: any }[] = []

    /**
     * Append a problem to the serialProblems list
     *
     * @see {@link serialProblems}
     * @since 2024-09-11
     */
    recordSerialProblem = (msg: string, data: any): number => this.serialProblems.push({ msg, data })

    /*

    // A. handle static migrateSerial function.
    // B. autofixes.
    // C. simple schema validation (check type only)
    // D. full serial validation.
    //    C.1. local validation, field by field
    //    C.2. global via generated zod-or-similar json schema

    */
    setOwnSerialWithValidationAndMigrationAndFixes(serialish: UNVALIDATED<Maybe<K['$Serial']>>): {
        problems: { msg: string; data: any }[]
    } {
        const wasNull = serialish == null
        let skipAutoFix = false
        let serial: object

        // #region 1.1. case `null` => use `_emptySerial`
        if (serialish == null) {
            this.recordSerialProblem(`serial is null, using _emptySerial`, serialish)
            serial = this._emptySerial
            skipAutoFix = true
        }

        // #region 1.2. case `{}` => use `_emptySerial`
        else if (isEmptyObject(serialish)) {
            serial = this._emptySerial
        }

        // #region 1.3. case not an object => use `_emptySerial`
        else if (typeof serialish !== 'object') {
            this.recordSerialProblem(`serial is not an object, using _emptySerial`, serialish)
            serial = this._emptySerial
            skipAutoFix = true
        }

        // #region 1.4. case object => use it
        else {
            serial = serialish
        }

        // #region 2. apply various generic auto-fixes
        if (!skipAutoFix) {
            // TODO: inline those methods in dedicated if blocs, and
            // TODO: make sure we're recording the problems with
            // TODO: appropriate serverity.
            // if (!isProbablySomeFieldSerial(serial!)) throw new Error(`invalid serial at '${this.path}'`)
            serial = autofixSerial_20240703(serial)
            serial = autofixSerial_20240711(serial)
        }

        // #region 3. run the static migrateSerial function from field
        if (!wasNull) {
            const newSerial = this._migrateSerial(serial)
            if (newSerial != null) serial = newSerial
        }

        // #region 4. Legacy (🔴!) run the heuristic migration function
        // TODO: dispatch to various migrateSerial functions within fields themselves
        if (isProbablySomeFieldSerial(serial) && serial.$ !== this.type) {
            // ADDING LIST
            if (this.type === 'list') {
                const next: Field_list_serial<any> = { $: 'list', items_: [serial] }
                serial = next
            }

            // ADDING OPTIONAL
            else if (this.type === 'optional') {
                const next: Field_optional_serial<any> = {
                    $: 'optional',
                    active: true,
                    child: serial,
                }
                serial = next
            }

            // REMOVING LIST
            else if (
                isProbablySerialList(serial) && //
                serial.items_ != null &&
                serial.items_.length >= 1
            ) {
                serial = serial.items_[0]
            }

            // REMOVING OPTIONAL
            else if (
                isProbablySerialOptional(serial) && //
                serial.child != null
            ) {
                serial = serial.child
            }
        }

        // #region 5. Legacy (🔴!) migration system
        if (this.config.beforeInit != null) {
            const oldVersion = (serial as any)._version ?? 'default'
            const newVersion = this.config.version ?? 'default'
            if (oldVersion !== newVersion) {
                serial = this.config.beforeInit(serial)
                if (!isProbablySomeFieldSerial(serial)) throw new Error(`invalid serial`)
                serial._version = newVersion
            }
        }
        // #region 6. New migration system
        // TODO

        // #region 7. catch all phase
        if (!isProbablySomeFieldSerial(serial)) {
            throw new Error(`invalid serial at '${this.path}'`)
        }
        if (isProbablySomeFieldSerial(serial) && serial.$ !== this.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${this.type}, got: ${serial.$})`)
            console.log(`[🔶] INVALID SERIAL:`, JSON.stringify(serial))
            serial = this._emptySerial // ❌
        }

        // #region 8. final validation
        function ensureValid<T>(serial: any): T {
            return serial
            // TODO
        }
        const validSerial = ensureValid<K['$Serial']>(serial)

        // #region 9. set the now valid serial
        // 💬 2024-09-11 rvion: at this point, we should be able to guarantee that
        // | the serial is of the right type,
        // | the serial is well formed valid.
        // | no data has been discarded.
        // | all validation properly succeeed
        this.setOwnSerial(validSerial)
        return { problems: this.serialProblems }
    }

    // private copyCommonSerialFields(s: Maybe<FieldSerial_CommonProperties>): void {
    //     if (s == null) return
    //     if (s._version != null) this.serial._version = s._version
    //     if (s.collapsed != null) this.serial.collapsed = s.collapsed
    //     if (s.custom != null) this.serial.custom = s.custom
    //     if (s.lastUpdatedAt != null) this.serial.lastUpdatedAt = s.lastUpdatedAt
    // }

    /** unified api to allow setting serial from value */
    setValue(val: K['$Value']): void {
        this.value = val
    }

    RECONCILE<SCHEMA extends Instanciable>(p: {
        mountKey: string
        existingChild: Maybe<Field>
        correctChildSchema: SCHEMA
        /** the target child to clone/apply into child */
        targetChildSerial: Maybe<SCHEMA['$Serial']>
        /**
         * ONLY CALLED FOR NEW CHILD
         *
         * must attach/register both
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
                p.mountKey,
                p.targetChildSerial,
            )
            // attach child to current serial
            p.attach(child)
        }
    }

    // #region UI

    /** default header UI */
    // abstract readonly DefaultHeaderUI: CovariantFC<{ field: K['$Field']; readonly?: boolean }> | undefined
    abstract readonly DefaultHeaderUI: CovariantFC<{ field: UNSAFE_AnyField; readonly?: boolean }> | undefined

    /** default body UI */
    // abstract readonly DefaultBodyUI: CovariantFC<{ field: K['$Field'] }> | undefined
    abstract readonly DefaultBodyUI: CovariantFC<{ field: UNSAFE_AnyField }> | undefined

    UIToggle: FC<{ className?: string }> = (p) => <WidgetToggleUI field={this} {...p} />
    UIErrors: ProplessFC = () => <WidgetErrorsUI field={this} />
    UILabelCaret: ProplessFC = () => <WidgetLabelCaretUI field={this} />
    UILabelIcon: ProplessFC = () => <WidgetLabelIconUI field={this} />
    UILabelContainer: FC<WidgetLabelContainerProps> = (p) => <WidgetLabelContainerUI {...p} />
    UIHeaderContainer: FC<{ children: ReactNode }> = (p) => (
        <WidgetHeaderContainerUI field={this}>{p.children}</WidgetHeaderContainerUI>
    )

    // #region UI HELPERS
    /** @deprecated with the new UI system */
    get actualWidgetToDisplay(): Field {
        return this
    }

    get indentChildren(): number {
        return 1
    }

    /** @deprecated ? with the new UI system */
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

    // #region ON/OFF

    /**
     * returns true if we can either `setOn` and `setOff` this field
     * @since 2024-09-03
     */
    get canBeToggledWithinParent(): boolean {
        // if (isFieldOptional(this)) return true
        if (isFieldOptional(this.parent)) return true
        if (isFieldChoices(this.parent)) return true
        if (isFieldChoice(this.parent)) return true
        return false
    }

    /**
     * if parent can be toggled, sets the parent ON
     * throws otherwise
     * @since 2024-09-03
     */
    enableSelfWithinParent(): void {
        const parent = this.parent
        if (isFieldOptional(parent)) return parent.setOn()
        if (isFieldChoices(parent)) return parent.enableBranch(this.mountKey)
        if (isFieldChoice(parent)) return parent.enableBranch(this.mountKey)
        throw new Error(`(${this.type}@'${this.path}').setOn: parent (${parent?.type}) is neither optional or choices`)
    }

    /**
     * if parent can be toggled, sets the parent OFF
     * throws otherwise
     * @since 2024-09-03
     */
    disableSelfWithinParent(): void {
        const parent = this.parent
        if (isFieldOptional(parent)) return parent.setOff()
        if (isFieldChoices(parent)) return parent.disableBranch(this.mountKey)
        if (isFieldChoice(parent)) return parent.disableBranch(this.mountKey)
        throw new Error(`(${this.type}@'${this.path}').setOff: parent (${parent?.type}) is neither optional or choices`)
    }

    get isInsideDisabledBranch(): boolean {
        if (this.parent == null) return false
        if (this.parent.isInsideDisabledBranch) return true
        if (isFieldOptional(this.parent)) return this.parent.isDisabled
        if (isFieldChoices(this.parent)) return this.parent.isBranchDisabled(this.mountKey)
        if (isFieldChoice(this.parent)) return this.parent.isBranchDisabled(this.mountKey)
        return false
    }

    // #region Tree

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

    getValue(mode: VALUE_MODE): K['$Value'] | K['$Unchecked'] {
        if (mode === 'fail') return this.value_or_fail
        if (mode === 'zero') return this.value_or_zero
        if (mode === 'unchecked') return this.value_unchecked
        exhaust(mode)
        throw new Error('unreachable')
    }

    /** @deprecated */
    get animateResize(): boolean {
        return true
    }

    /**
     * return true when widget has no child
     * return flase when widget has one or more child
     * */
    get hasNoChild(): boolean {
        return this.childrenAll.length === 0
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
            ...this.childrenAll.map((w) => w.diffSummaryFromDefault),
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

    /** path within the model */
    get pathExt(): string {
        const p = this.parent
        if (p == null) return `📄[${this.type}]`
        return p.pathExt + '-' + this.mountKey + `->[${this.type}]`
    }

    mountKey: string
    // get mountKey(): string {
    //     if (this.parent == null) return '$'
    //     if (this.parent.type === 'optional') return 'child' // hack for line below who is wrong
    //     return this.parent.subFieldsWithKeys.find(({ field }) => field === this)?.key ?? '<error>'
    // }

    /** collapse all children that can be collapsed */
    collapseAllChildren(): void {
        for (const _item of this.childrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.actualWidgetToDisplay
            if (item.serial.collapsed) continue
            const isCollapsible = item.isCollapsible
            if (isCollapsible) item.setCollapsed(true)
        }
    }

    /** expand all children that can are collapsed */
    expandAllChildren(): void {
        for (const _item of this.childrenAll) {
            // this allow to make sure we fold though optionals and similar constructs
            const item = _item.actualWidgetToDisplay
            item.setCollapsed(undefined)
        }
    }

    // change management ------------------------------------------------
    /**
     *
     * RULES:
     * - every component should be able to be reset and must implement
     *   the reset function
     * - Reset MUST NEVER be called from the constructor
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
        this.touched = false
    }

    /** return a cloned/detached value object you can use anywhere without care */
    toValueJSON(): K['$Value'] {
        return JSON.parse(JSON.stringify(this.value))
    }

    /** return a clone/detached serial object you can use anywhere without care */
    toSerialJSON(): K['$Serial'] {
        return this.serial // JSON.parse(JSON.stringify(this.serial))
    }

    /** every child class must implement change detection from its default  */
    abstract readonly hasChanges: boolean

    private touched_ = false

    /** true when the field contains unsaved changes */
    get touched(): boolean {
        return this.touched_
    }

    set touched(val: boolean) {
        if (val === true && this.touched_ !== val && this.parent !== this && this.parent != null) {
            this.parent.touched = true
        }
        this.touched_ = val
    }

    /**
     * Identical to field.touched = true but easier to use when field is nullable
     */
    touch = (): void => {
        this.touched = true
    }

    touchAll = (): void => {
        if (this.childrenAll.length === 0) this.touched = true

        for (const child of this.childrenAll) {
            child.touchAll()
        }
    }

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
        this.patchSerial((draft) => {
            // 💬 2024-09-17 rvion:
            // | I'll assume that the custom data is already serializable...
            // | still wrong, but probably a bit less dangerous than naive deep-cloning it.
            draft.custom = next
            // draft.custom = JSON.parse(JSON.stringify(next))
        })
        this.applySerialUpdateEffects()
        return this
    }

    /** delete field custom data (delete this.serial.custom)  */
    deleteFieldCustomData(): this {
        delete this.serial.custom
        this.applySerialUpdateEffects()
        return this
    }

    // 📌 ERROR / VALIDATION ---------------------------------------------------------------|

    // 🔶 TEMPORARY HACK UNTIL RENDER BRANCH
    getFieldUnchecked(): this {
        return this
    }

    /**
     * @since 2024-09-04
     * @category Validation
     */
    validate(): Result<this, ValidationError> {
        this.touched = true
        if (!this.isValid)
            return __ERROR(
                new ValidationError(
                    `Validation failed for field ${this.type} at '${this.path}'`,
                    this,
                    this.allErrorsIncludingChildrenErrors,
                ),
            )
        return __OK(this)
    }

    /**
     * helper function to chain things
     *
     * @since 2024-09-04
     * @category Validation
     * @see {@link validationOrThrow}
     */
    validateOrNull(): Maybe<this> {
        this.touched = true
        if (!this.isValid) return null
        return this
    }

    /**
     * helper function to chain things
     *
     * @since 2024-09-04
     * @category Validation
     * @see {@link validateOrNull}
     */
    validateOrThrow(): this {
        const res = this.validate()
        if (!res.valid) throw res.error
        return this
    }

    /**
     * A field is `VALID` if and only if itself and its children (recursively)
     * - have no own errors
     * - are set
     *
     * an error is a problem with severity error.
     *
     * @category Validation
     * @since 2024-09-04
     */
    get isValid(): boolean {
        return this.allErrorsIncludingChildrenErrors.length === 0
    }

    /**
     * returns true if errors.length > 0
     * @category Validation
     */
    get hasOwnErrors(): boolean {
        const errors = this.ownErrors
        return errors.length > 0
    }

    get mustDisplayErrors(): boolean {
        return this.hasOwnErrors && this.touched
    }

    /**
     * all own errors:
     *  + base/default (built-in field, e.g. minLength for string)
     *  + custom       (user-defined in config)
     * @category Validation
     */
    get ownErrors(): Problem[] {
        const i18n = csuiteConfig.i18n
        // If we have a leaf Field, we add its "not set" error (isOwnSet)
        if (!this.isOwnSet) {
            return [
                {
                    message: i18n.err.field.not_set,
                    longerMessage: `${i18n.err.field.not_set} (${this.pathExt})`,
                },
            ]
        } else {
            return normalizeProblem(this.ownTypeSpecificProblems) //
                .concat(this.ownCustomConfigCheckProblems)
        }

        // return errors
    }

    /**
     * @category Validation
     */
    get allErrorsIncludingChildrenErrors(): Problem[] {
        const subErrs = this.childrenAll.flatMap((f) => f.allErrorsIncludingChildrenErrors)
        const errs = this.ownErrors.concat(subErrs)
        if (!this.isSet) errs.push({ message: `Field ${this.path}(${this.type}) is not set` })
        return errs
    }

    /**
     * getter to retrieve the errors from the `check` function in the config.
     * ONLY returns errros from the `check` config
     *
     * 🔶 TODO: rename to "...."
     *
     * ```ts
     * b.int({ check: f => f.value % 3 ===0 })
     * ```
     * @category Validation
     */
    get ownCustomConfigCheckProblems(): Problem[] {
        if (this.config.check == null) return []
        const res = this.config.check(this)
        return normalizeProblem(res)
        // return [...normalizeProblem(res), { message: 'foo' }]
    }

    /**
     * getter to retrieve the Errors specific to the Field Class
     *
     * e.g. Int will add an error if the value is floating.
     *
     * LAWS:
     *  - 1. must NOT include children-specific problems
     *  - 2. must NOT include problems from the shared `check` function in the config
     *  - 3. only least common ancestor can add problems ermerging from multiple children
     *
     * @category Validation
     */
    abstract readonly ownTypeSpecificProblems: Problem_Ext
    abstract readonly ownConfigSpecificProblems: Problem_Ext

    // -----------------------------------------------------------------------|
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

    // BUMP ----------------------------------------------------
    /**
     * every time a field serial is updated, we should call this function.
     * this function is called recursively upwards.
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
     * this method can be heavily optimized
     * ping @globi
     * todo:
     *  - by storing the published value locally
     *  - by defining a getter on the _advertisedValues object of all parents
     *  - by only setting this getter up once.
     * */
    publishValue(this: Field): void {
        // 💬 2024-09-20 rvion:
        // | 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
        // | We need to write tests about that.
        if (!this.isSet) return

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

    // #region UI
    // 💬 2024-09-11 rvion:
    // | UI section is a bit of a mess right now.
    // | it comes from the fact that originally, this library
    // | did not differenciate between the model and the view much.
    // | schema definition was also the place to write the UI.

    // #region UI.Fold
    setCollapsed(val?: boolean): void {
        if (this.serial.collapsed === val) return
        this.runInSerialTransaction(() => {
            this.patchSerial((draft) => {
                draft.collapsed = val
            })
        })
        this.applySerialUpdateEffects()
    }

    toggleCollapsed(this: Field): void {
        this.runInSerialTransaction(() => {
            this.patchSerial((draft) => {
                draft.collapsed = !draft.collapsed
            })
        })

        this.applySerialUpdateEffects()
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

    /**
     * if specified, overrides the default logic to decide if the widget need to be collapsible
     * @deprecated
     * 🔶 going to be removed ASAP
     */
    get isCollapsible(): boolean {
        // top level widget is not collapsible; we may want to revisit this decision
        // if (widget.parent == null) return false
        if (this.config.collapsed != null) return this.config.collapsed //
        if (!this.DefaultBodyUI) return false // 🔴 <-- probably a mistake here
        if (this.config.label === false) return false
        return true
    }

    // #region UI.Decorat
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
        // if (this.DefaultBodyUI == null) return false // 🔴 <-- probably a mistake here
        // default case when we have a body => we show the border
        return false
        // return 8
    }

    // #region UI.Render

    //  => LOCO
    Render(props: RENDERER.FieldRenderArgs<this> = {}): ReactNode {
        if (props == undefined) debugger
        return <window.RENDERER.Render field={this} p={props} />
    }

    //  => CUSHY
    UI(props: RENDERER.FieldRenderArgs<this> = {}): ReactNode {
        if (props == undefined) debugger
        return <window.RENDERER.Render field={this} p={props} />
    }

    /**
     * @deprecated prefer Field.Render
     * temporary until shells */
    renderSimple(p: RENDERER.FieldRenderArgs<this>): ReactNode {
        return this.UI({ Shell: (x) => <x.UI.ShellSimple {...x} />, ...p })
    }

    /**
     * alias to `Render`
     *
     * @since 2024-09-19
     * @see {@link Render}
     */
    render(props: RENDERER.FieldRenderArgs<this> = {}): ReactNode {
        if (props == undefined) debugger
        return <window.RENDERER.Render field={this} p={props} />
    }

    /**
     * @deprecated prefer Field.Render with the proper modal options
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

    // #region UI.Components
    defaultHeader(this: Field): JSX.Element | undefined {
        if (this.DefaultHeaderUI == null) return
        return <this.DefaultHeaderUI field={this} />
    }

    defaultBody(this: Field): JSX.Element | undefined {
        if (this.DefaultBodyUI == null) return
        return <this.DefaultBodyUI field={this} />
    }

    // 🔴 not sure where this 'readonly' goes, it's a render prop, not a config.
    // do we have have render props? (active? look?) or do we make different custom components? probably both are required?
    // currently those kind of "render" config are only available at top level via FormUIProps or via calling field.renderWithLabel(...)
    // but actually header and renderWithLabel have the same nature, so yeah, they should be here too. See commonalities with WidgetWithLabelProps
    header(this: Field, p?: { readonly?: boolean }): JSX.Element | undefined {
        const HeaderUI =
            'header' in this.config //
                ? useEnsureObserver(this.config.header)
                : this.DefaultHeaderUI
        if (HeaderUI == null) return
        return <HeaderUI key={this.id} field={this} {...p} />
    }

    body(this: Field): JSX.Element | undefined {
        const BodyUI =
            'body' in this.config //
                ? useEnsureObserver(this.config.body)
                : this.DefaultBodyUI
        if (BodyUI == null) return
        return <BodyUI field={this} />
    }

    // #region CHILDREN
    /**
     * list of all children fields that are technically in the in-memory instance tree
     * including those instanciated but only kept in a pending state, or those
     * that have been detached but are still registered as children from an internal
     * perspective
     *
     * use-cases: dispose-tree, etc, etc
     * if you just want to traverse the "active" part of the tree,
     * use `childrenActive` instead
     *
     * @since 2024-09-09
     * @remarks was previously named `subFields`
     */
    get childrenAll(): K['$Child']['$Field'][] {
        return []
    }

    /**
     * list of all children that are logically part of the tree
     * use-cases: render, toValue, toSerial, various traversal, etc.
     *
     *
     * @since 2024-09-11
     * @remaks expected to be overriden in every field that have children that can be toggled,
     * like FIeldChoice, FieldOptional
     */
    get childrenActive(): K['$Child']['$Field'][] {
        return this.childrenAll
    }

    // TODO: split subFields into two variants: active subFields, and childrenIncludingInactive
    // TODO: rename subFields into children
    //

    /**
     * list of all subwidgets, without named keys
     * @deprecated
     * we should be able to trust the `subField.mountKey`
     * // TODO: remove
     */
    get subFieldsWithKeys(): KeyedField[] {
        return []
    }

    // #region TRANSACTION
    /**
     * proxy this.repo.action
     * defined to shorted call and allow per-field override
     */
    runInValueTransaction<T>(fn: (tct: Transaction) => T): T {
        return this.repo.TRANSACT(fn, this, 'value', 'WITH_EFFECT')
    }

    runInAutoTransaction(fn: (tct: Transaction) => void): void {
        return this.repo.TRANSACT(fn, this, 'auto', 'WITH_EFFECT')
    }

    runInSerialTransaction(fn: (tct: Transaction) => void): void {
        return this.repo.TRANSACT(fn, this, 'serial', 'WITH_EFFECT')
    }

    private runInCreateTransaction(fn: (tct: Transaction) => void): void {
        return this.repo.TRANSACT(fn, this, 'create', 'NO_EFFECT')
    }

    // -------------
    runInValuePatch<T>(fn: (draft: K['$Serial'], tct: Transaction) => void): void {
        return this.repo.TRANSACT(
            (tct) => {
                this.patchSerial((draft) => {
                    fn(draft, tct)
                })
            },
            this,
            'value',
            'WITH_EFFECT',
        )
    }

    runInSerialPatch(fn: (draft: K['$Serial'], tct: Transaction) => void): void {
        return this.repo.TRANSACT(
            (tct) => {
                this.patchSerial((draft) => {
                    fn(draft, tct)
                })
            },
            this,
            'serial',
            'WITH_EFFECT',
        )
    }

    // ------------
    /**
     * DO NOT OVERRIDE.
     * @internal
     */
    protected assignNewSerial(next: K['$Serial']): void {
        if (this.serial === next) return
        this.serial = next
        this.__version__++
        // this.parent?._acknowledgeNewChildSerial(this.mountKey, this.serial)
    }
    __version__ = 1

    /**
     * equivalent to `produce`, followed by `assignNewSerial` (if something did change)
     *
     * return false when the lambda did not change the serial, and
     * true when serial has been updated by the lambda
     * @internal
     */
    patchSerial(
        //
        fn: (draft: K['$Serial']) => undefined,
        /*
         * cowe uld allow K['$Serial'] and hand it back to the caller
         * to match immerjs API
         * | fn: (serial: K['$Serial']) => undefined  | K['$Serial']
         */
    ): boolean {
        // console.log(`[🧑‍🦯‍➡️] patch serial called from ${this.pathExt}`)
        // from 2024-09-09, serial are not longer observable objects
        if (isObservable(this.serial)) throw new Error('❌ serial should not be observable')

        // apply patch function
        const nextState = produce(this.serial, fn)
        const stateChanged = nextState !== this.serial // ⚠️ Ref equality check
        if (!stateChanged) return false // patch function did nothing; we can safely abort

        // otherwise, assign serial to current field, and bubble upwards to the document rot
        this.assignNewSerial(nextState)
        return true
    }

    /**
     * if your field have children, you need to be able to acknolewdge
     * if they changed their serial.
     * don't forget to recursively call this method on this field's parent.
     *
     * (this method needs a true implementation in every field that use RECONCILE)
     */
    _acknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
        throw new Error(`🔴 _acknowledgeNewChildSerial not implemented (${this.pathExt})`)
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

    /** probably the wrong place to retrieve that now that presenter are comming */
    get icon(): Maybe<IconName> {
        const x = this.schema.config.icon as any // 🔴 TS BUG / PERF
        if (x == null) return null
        if (typeof x === 'string') return x as any // 🔴 TS BUG / PERF
        return x(this)
    }

    private _hasBeenInitialized: boolean = false

    /**
     * This method allow to extend an already observable instance
     * by adding a few things to the list of what's observable
     * - all new instance own properties
     * - all the direct prototype properties
     *   (first proto in the chain; that correspond to the final subclass)
     *
     * This method is used to extend a base class that has been made observable
     * It's implementation is not definitive, but seems to work well for our
     * use cases
     *
     * @since 2024-08-30
     * @stability beta
     */
    protected autoExtendObservable(overrides?: AnnotationsMap<any, any>): void {
        const annotations = {} as AnnotationsMap<object, string | symbol>
        const properties = {} as Record<string | symbol, any>
        const proto = Object.getPrototypeOf(this)

        const baseAnnotations = proto[annotationsSymbol]
        // 👆 we expect makeAutoObservableInheritance to be called before this
        // and the annotations map to have been cached at prototype[annotationsSymbol]
        // if it's not, we should throw an error
        if (baseAnnotations == null)
            throw new Error(
                '❌ autoExtendObservable can only be callled after some base' +
                    'class has been made observable using makeAutoObservableInheritance',
            )

        const accumPropertiesAndAnnotations = (something: any): void => {
            Reflect.ownKeys(something).forEach((key) => {
                if (key === $mobx || key === 'constructor') return
                if (key in baseAnnotations) return
                const annotation = !overrides ? true : key in overrides ? overrides[key as keyof typeof overrides]! : true
                if (annotation === false) return
                annotations[key] = annotation
                const p = Object.getOwnPropertyDescriptor(something, key)!
                Object.defineProperty(properties, key, p)
            })
        }

        accumPropertiesAndAnnotations(this)
        accumPropertiesAndAnnotations(proto)
        extendObservable(this, properties, annotations)
    }

    /** this function MUST be called at the end of every widget constructor */
    protected init(
        //
        serial?: K['$Serial'],
        mobxOverrides?: any,
    ): void {
        if (isObservable(this.serial)) console.error('❌ serial should not be observable (err3829)')
        // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (field.init)`)

        // 1. ensure field hasn't been initialized yet
        if (this._hasBeenInitialized) return console.error(`[🔶] Field.init has already been called => ABORTING`)
        this._hasBeenInitialized = true

        // 2. apply extensiosn
        this.schema.applyFieldExtensions(this)

        // 3. ...
        this.runInCreateTransaction(() => {
            // this.copyCommonSerialFields(serial)

            //   VVVVVVVVVVVV this is where we hydrate children
            this.setOwnSerialWithValidationAndMigrationAndFixes(serial)

            // make the object deeply observable including this base class
            makeAutoObservableInheritance(
                this,
                {
                    // schema should not be able
                    schema: false,
                    serial: observable.ref,

                    // components should not be observable; otherwise, it breaks the hot reload in dev-mode
                    UIToggle: false,
                    UIErrors: false,
                    UILabelCaret: false,
                    UILabelIcon: false,
                    UILabelContainer: false,
                    UIHeaderContainer: false,

                    // overrides retrieved from parents
                    ...mobxOverrides,

                    // misc
                    getValue: false,

                    // Render
                    Render: false,
                    render: false,
                },
                {},
                2,
            )

            this.UI = this.UI.bind(this)
            this.render = this.render.bind(this)
            this.Render = this.Render.bind(this)
            this.renderSimple = this.renderSimple.bind(this) // TODO: remove
            this.renderAsConfigBtn = this.renderAsConfigBtn.bind(this) // TODO: remove

            this.repo._registerField(this)
            this.ready = true
        })
    }

    clone(): this {
        return this.schema.create(this.serial) as this
    }

    cloneWithConfig(config: Partial<K['$Config']>): this {
        return this.schema.withConfig(config).create(this.serial) as this
    }

    // CODEGEN -------------------------------------------------------
    codeForTypeModule(p: {
        //
        importTypeFrom?: TypeImportLocation
    }): string {
        return [
            `export type ${this.type}Schema = ${this.codeForTypescriptCodeForSchema()}`,
            `export type ${this.type}Value = ${this.codeForTypescriptCodeForValue()}`,
            `export type ${this.type}Serial = ${this.codeForTypescriptCodeForSerial()}`,
        ].join('\n')
    }

    codeForTypescriptCodeForSchema(): string {
        return this.type
    }

    codeForTypescriptCodeForSerial(): string {
        return this.type
    }

    codeForTypescriptCodeForValue(): string {
        return this.type
    }
    // ---------------------------------------------------------------

    get hasSnapshot(): boolean {
        return this.serial.snapshot != null
    }

    get hasFoldableSubfieldsThatAreUnfolded(): boolean {
        return this.childrenAll.some((f) => f.isCollapsible && !f.serial.collapsed)
    }

    get hasFoldableSubfieldsThatAreFolded(): boolean {
        return this.childrenAll.some((f) => f.isCollapsible && f.serial.collapsed)
    }

    get hasFoldableSubfields(): boolean {
        return this.childrenAll.some((f) => f.isCollapsible)
    }

    deleteSnapshot(): void {
        delete this.serial.snapshot
        this.applySerialUpdateEffects()
    }

    /** update current field snapshot */
    saveSnapshot(): this['$Serial'] {
        const snapshot = produce(this.serial, (draft) => {
            // a bad person would say: "Yo, Dawg; I heard you liked snapshots. So I put a snapshot in your snapshot, so you can snapshot while snapshotting"
            // but it's wrong. we don't want snapshotception.
            // so we delete the snapshot from the snapshot before it's too late.
            // otherwise, once we take a second snapshot, the first snapshot will indeed appear in the second snapshot.
            // Snapshot.
            delete draft.snapshot
        })

        // delete snapshot.snapshot

        this.patchSerial((draft) => void (draft.snapshot = snapshot))
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

    get isDirtyFromSnapshot_UNSAFE(): boolean {
        const { snapshot, ...currentSerial } = this.serial
        if (snapshot == null) return false
        return hashJSONObjectToNumber(snapshot) !== hashJSONObjectToNumber(currentSerial)
    }

    abstract isOwnSet: boolean

    /**
     * return true if and only if self and every descendant is set.
     * [not made to be overriden]
     */
    get isSet(): boolean {
        if (!this.isOwnSet) return false
        if (this.childrenActive.some((f) => !f.isSet)) return false
        return true
    }

    get labelText(): string {
        if (this.config.label == null) {
            const mountKey = this.parent?.type === 'optional' ? this.parent.mountKey : this.mountKey
            return makeLabelFromPrimitiveValue(mountKey)
        }
        if (this.config.label === false) return '' // not sure about the config.label doc
        return this.config.label
    }

    // TODO: remove that
    public async saveChanges(): Promise<void> {
        await this.root.config.saveChanges?.(this.root)
        this.root.saveSnapshot()
        this.touched = false
    }

    // TODO: remove that
    /**
     * 🔶 Not sure if we should handle snapshots here
     * @deprecated: not sure when we would need it if every form creates a draft and doesn't edit original field until save
     */
    public async cancelChanges(): Promise<void> {
        await this.root.config.cancelChanges?.(this.root)
        this.root.revertToSnapshot()
        this.touched = false
    }
}

function isEmptyObject(obj: any): boolean {
    if (obj == null) return true
    if (typeof obj !== 'object') return false
    return Object.keys(obj).length === 0
}
