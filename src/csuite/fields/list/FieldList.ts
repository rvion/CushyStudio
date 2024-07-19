import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'

import { reaction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { bang } from '../../utils/bang'
import { clampOpt } from '../../utils/clamp'
import { registerFieldClass } from '../WidgetUI.DI'
import {
    ListButtonAdd100ItemsUI,
    ListButtonAddUI,
    ListButtonClearUI,
    ListButtonFoldUI,
    ListButtonUnfoldUI,
} from './ListControlsUI'
import { WidgetList_BodyUI, WidgetList_LineUI } from './WidgetListUI'

/** */
interface AutoBehaviour<out T extends BaseSchema> {
    /** list of keys that must be present */
    keys(self: T['$Field']): string[] // ['foo', 'bar', 'baz']

    /** for every item given by the list above */
    getKey(self: T['$Field'], ix: number): string

    /** once an item if  */
    init(key: string /* foo */): T['$Value']
}

// CONFIG
export interface Field_list_config<out T extends BaseSchema>
    extends FieldConfig<
        {
            /**
             * item schema;
             * function notation to support tuples
             */
            element: ((ix: number) => T) | T

            /**
             * when specified, the list will work in some AUTOMATIC mode
             *  - disable the "add" button
             *  - disable the "remove" button
             *  - disable the "clear" button
             *  - automatically add or remove missing items when reaction
             *  - subscribe via mobx to anything you want
             */
            auto?: AutoBehaviour<T>

            /** @default: true */
            sortable?: boolean

            /**
             * mininum length;
             * if min > 0, list will be populated on creation
             * if length < min, list will be populated with empty items
             * if length <= min, list will not be clearable
             * */
            min?: number

            /** max length */
            max?: number

            defaultLength?: number
        },
        Field_list_types<T>
    > {}

// SERIAL
export type Field_list_serial<T extends BaseSchema> = FieldSerial<{
    $: 'list'
    items_: T['$Serial'][]
}>

// VALUE
export type Field_list_value<T extends BaseSchema> = T['$Value'][]

// TYPES
export type Field_list_types<T extends BaseSchema> = {
    $Type: 'list'
    $Config: Field_list_config<T>
    $Serial: Field_list_serial<T>
    $Value: Field_list_value<T>
    $Field: Field_list<T>
}

// STATE
export class Field_list<T extends BaseSchema> //
    extends Field<Field_list_types<T>>
{
    DefaultHeaderUI = WidgetList_LineUI
    DefaultBodyUI = WidgetList_BodyUI

    UI_AddButton = ListButtonAddUI
    UI_ClearButton = ListButtonClearUI
    UI_FoldButton = ListButtonFoldUI
    UI_UnfoldButton = ListButtonUnfoldUI
    UI_Add100ItemsButton = ListButtonAdd100ItemsUI

    static readonly type: 'list' = 'list'

    get length(): number {
        return this.items.length
    }

    items!: T['$Field'][]

    get hasChanges(): boolean {
        // 2024-06-?? rvion:
        //  | in auto mode, length is managed,
        //  | so we must not take it into account
        // 2024-07-05 rvion:
        //   | ^^^ 🤔< NOT SURE about my previous opinion here
        //   |         I'll add some '🔴' for future review
        if (!this.config.auto) {
            const defaultLength = clampOpt(this.config.defaultLength, this.config.min, this.config.max)
            if (this.items.length !== defaultLength) return true
        }
        // check if any remaining item has changes
        return this.items.some((i) => i.hasChanges)
    }

    // resetSmart(): void {
    //     // fix size
    //     if (!this.config.auto) {
    //         const defaultLength = clampOpt(this.config.defaultLength, this.config.min, this.config.max)
    //         for (let i = this.items.length; i > defaultLength; i--) this.removeItem(this.items[i - 1]!)
    //         for (let i = this.items.length; i < defaultLength; i++) this.addItem({ skipBump: true })
    //     }

    //     // reset all remaining values
    //     for (const i of this.items) i.reset()
    // }

    findItemIndexContaining(widget: Field): number | null {
        let at = widget as Field | null
        let child = at
        while (at != null) {
            at = at.parent
            if (at === this) {
                return this.items.indexOf(child as T['$Field'])
            }
            child = at
        }
        return null
    }

    get subFields(): T['$Field'][] {
        return this.items
    }

    get subFieldsWithKeys(): KeyedField[] {
        return this.items.map((field, ix) => ({ key: ix.toString(), field }))
    }

    private schemaAt(ix: number): T {
        const _schema = this.config.element
        const schema: T =
            typeof _schema === 'function' //
                ? _schema(ix)
                : _schema
        return schema
    }

    get isAuto(): boolean {
        return this.config.auto != null
    }

    // probably slow and clunky;
    // TODO: rewrite this piece of crap
    private startAutoBehaviour(): void {
        const auto = this.config.auto
        if (auto == null) return

        const disposeFn = reaction(
            () => auto.keys(this),
            (keys: string[]) => {
                this.runInAutoTransaction(() => {
                    // 1. Add missing entries
                    const currentKeys: string[] = this.items.map((i, ix) => auto.getKey(i, ix))
                    const missingKeys: string[] = keys.filter((k) => !currentKeys.includes(k))
                    for (const k of missingKeys) {
                        this.addItem({
                            value: auto.init(k),
                        })
                    }

                    // 2. delete items that must be removed.
                    let ix = 0
                    for (const item of this.items.slice()) {
                        const isExtra = !keys.includes(auto.getKey(item, ix++))
                        if (!isExtra) continue
                        this.removeItem(item)
                    }
                })
            },
            { fireImmediately: true },
        )

        this.disposeFns.push(disposeFn)
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_list<T>>,
        serial?: Field_list_serial<T>,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
        this.startAutoBehaviour()
    }

    at(ix: number): T['$Field'] | undefined {
        return this.items[ix]
    }

    get valueArr(): Field_list_value<T> {
        return this.items.map((i) => i.value)
    }

    protected setOwnSerial(serial: Maybe<Field_list_serial<T>>): void {
        // minor safety net since all those internal changes
        if (this.serial.items_ == null) this.serial.items_ = []

        // pseudo-reset 🔴
        if (this.items != null) for (const item of this.items) item.disposeTree()
        this.items = []
        this.serial.items_ = []

        // when NO-serial, NO-auto
        if (serial == null) {
            if (!this.config.auto) {
                const defaultLength = clampOpt(this.config.defaultLength, this.config.min, this.config.max)
                for (let i = this.items.length; i < defaultLength; i++) {
                    this.addItem()
                }
            }
            return
        }

        for (const [ix, subSerial] of serial.items_.entries()) {
            const schema = this.schemaAt(ix)
            this.RECONCILE({
                correctChildSchema: schema,
                existingChild: null,
                targetChildSerial: subSerial,
                attach: (sub) => {
                    // push instead of doing [ix]= ... since we're re-creating them in order
                    this.items.push(sub)
                    this.serial.items_.push(sub.serial)
                },
            })
            // const subWidget = schema.instanciate(this.repo, this.root, this, subSerial)
            // this.items.push(subWidget)
        }

        // 3. add missing items if min specified
        const missingItems = (this.config.min ?? 0) - this.items.length
        for (let i = 0; i < missingItems; i++) {
            this.addItem()
        }
    }

    /**
     * code below is very wtf, and surprisingly simple for what it achieve
     * see `src/csuite/model/TESTS/proxy.test.ts` if you're not scared
     */
    get value(): Field_list_value<T> {
        return new Proxy(this.items as any, {
            get: (target, prop: any): any => {
                // ⏸️ console.log(`[GET]`, prop)
                if (typeof prop === 'symbol') return target[prop]

                // MOBX HACK ----------------------------------------------------
                // Handle mutations
                if (prop === 'toJSON') return () => this.valueArr
                if (prop === 'pop') return () => this.pop()
                if (prop === 'shift') return () => this.shift()
                if (prop === 'unshift') return (...args: any[]) => this.unshift(...args)
                if (prop === 'push') return (...args: any[]) => this.push(...args)
                // MOBX HACK ----------------------------------------------------

                // handle numbers (1) and number-like ('1')
                if (parseInt(prop, 10) === +prop) {
                    return target[+prop]?.value
                }

                // defer to valueArr for other props
                return this.valueArr[prop]
            },
            set: (target, prop: any, value): boolean => {
                // ⏸️ console.log(`[SET]`, prop, value)
                if (typeof prop === 'symbol') return false
                if (parseInt(prop, 10) === +prop) {
                    const index = +prop
                    if (index === this.items.length) {
                        this.addItem({ value })
                        return true
                    } else if (this.items[prop]) {
                        this.items[prop]!.value = value
                        return true
                    }
                }
                return false
            },
        })
    }

    set value(val: Field_list_value<T>) {
        // if (this.items.length === val.length && this.items.every((i, ix) => i.toValueJSON() == val[ix])) return

        this.runInAutoTransaction(() => {
            for (let i = 0; i < val.length; i++) {
                // 1. replace existing items
                if (i < this.items.length) {
                    this.items[i]!.value = val[i]
                }
                // 2. add missing items
                else {
                    this.addItem()
                    this.items[i]!.value = val[i]
                }
            }
            this.splice(val.length)
        })
    }

    // ERRORS --------------------------------------------------------
    get ownProblems(): string[] {
        const out: string[] = []
        if (this.config.min != null && this.length < this.config.min) {
            out.push(`List is too short`)
        }
        if (this.config.max != null && this.length > this.config.max) {
            out.push(`List is too long`)
        }
        return out
    }

    // ADDING ITEMS -------------------------------------------------
    duplicateItemAtIndex(ix: number): void {
        const item = this.items[ix]!
        this.addItem({ at: ix, value: item.value })
    }

    /**
     * Appends new elements to the end of an array,
     * and returns the new length of the array.
     */
    push(...values: T['$Value'][]): number {
        if (values.length === 0) return this.length
        this.runInValueTransaction(() => {
            for (const v of values) {
                this.addItem({ value: v })
            }
        })
        return this.length
    }

    /**
     * Inserts new elements at the start of an array,
     * and returns the new length of the array.
     */
    unshift(...values: T['$Value'][]): number {
        if (values.length === 0) return this.length
        this.runInValueTransaction(() => {
            for (const v of values) {
                this.addItem({ value: v, at: 0 })
            }
        })
        return this.length
    }

    addItem(
        p: {
            at?: number
            value?: T['$Value']
            serial?: T['$Serial']
        } = {},
    ): Maybe<T['$Field']> {
        // ensure list is not at max len already
        if (this.config.max != null && this.items.length >= this.config.max)
            return void console.log(`[🔶] list.addItem: list is already at max length`)

        // ensure index we're adding this at is valid
        if (p.at != null && p.at < 0) return void console.log(`[🔶] list.addItem: at is negative`)
        if (p.at != null && p.at > this.items.length) return void console.log(`[🔶] list.addItem: at is out of bounds`)

        return this.runInValueTransaction(() => {
            // create new item
            const schema = this.schemaAt(p.at ?? this.serial.items_.length) // TODO: evaluate schema in the form loop
            const element = schema.instanciate(this.repo, this.root, this, p.serial ?? null)

            // set initial value
            if (p.value) {
                element.value = p.value
            }

            // insert item
            if (p.at == null) {
                this.items.push(element)
                this.serial.items_.push(element.serial)
            } else {
                this.items.splice(p.at, 0, element)
                this.serial.items_.splice(p.at, 0, element.serial)
            }

            return element
        })
    }

    // MOVING ITEMS ---------------------------------------------------
    moveItem(
        /** previous item index in the list */
        oldIndex: number,
        /** new index in the list to move the item to */
        newIndex: number,
    ): void {
        if (oldIndex === newIndex) return console.log(`[🔶] list.moveItem: oldIndex === newIndex`)
        if (oldIndex < 0 || oldIndex >= this.length) return console.log(`[🔶] list.moveItem: oldIndex out of bounds`)
        if (newIndex < 0 || newIndex >= this.length) return console.log(`[🔶] list.moveItem: newIndex out of bounds`)

        this.runInValueTransaction(() => {
            // serials
            const serials = this.serial.items_
            serials.splice(newIndex, 0, bang(serials.splice(oldIndex, 1)[0]))

            // instances
            const instances = this.items
            instances.splice(newIndex, 0, bang(instances.splice(oldIndex, 1)[0]))
        })
    }

    // REMOVING ITEMS ------------------------------------------------

    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @returns An array containing the elements that were deleted.
     */
    splice(
        /**  The zero-based location in the array from which to start removing elements. */
        start: number,
        /** The number of elements to remove. */
        deleteCount: number = Infinity,
    ): T['$Field'][] {
        if (deleteCount === 0) return []
        if (start >= this.length) return []
        return this.runInValueTransaction(() => {
            // console.log(`[🤠] `, this.length, start, deleteCount)
            this.serial.items_.splice(start, deleteCount)
            const deleted = this.items.splice(start, deleteCount)
            // console.log('🚀 ~ deleted:', deleted)
            for (const x of deleted) x.disposeTree()
            return deleted
        })
    }

    /**
     * Removes all elements from the array and
     * @returns An array containing the elements that were deleted.
     */
    removeAllItems(): T['$Field'][] {
        // ensure list is not empty
        if (this.length === 0) {
            console.log(`[🔶] list.removeAllItems: list is already empty`)
            return []
        }
        // ensure list is not at min len already
        const minLen = this.config.min ?? 0
        if (this.length <= minLen) {
            console.log(`[🔶] list.removeAllItems: list is already at min lenght`)
            return []
        }
        // remove all items
        return this.splice(minLen)
        // this.MUTVALUE(() => {
        //     this.serial.items_ = this.serial.items_.slice(0, minLen)
        //     this.items = this.items.slice(0, minLen)
        // })
    }

    removeItem(item: T['$Field']): Maybe<T['$Field']> {
        // ensure item is in the list
        const i = this.items.indexOf(item)
        if (i === -1) {
            // 2024-07-11 rvion: should we throw
            return void console.log(`[🔶] list.removeItem: item not found`)
        }
        this.removeItemAt(i)
        return item
    }

    pop(): void {
        this.removeItemAt(this.items.length - 1)
    }

    /**
     * Removes the first element from an array and returns it.
     * If the array is empty, undefined is returned and the array is not modified.
     */
    shift(): Maybe<T['$Field']> {
        return this.removeItemAt(0)
    }

    removeItemAt(i: number): Maybe<T['$Field']> {
        if (this.length < i) return null
        return this.splice(i, 1)[0]
    }
}

// DI
registerFieldClass('list', Field_list)
