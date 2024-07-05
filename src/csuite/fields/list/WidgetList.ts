import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'

import { reaction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { bang } from '../../utils/bang'
import { clampOpt } from '../../utils/clamp'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetList_BodyUI, WidgetList_LineUI } from './WidgetListUI'

/** */
interface AutoBehaviour<out T extends ISchema> {
    /** list of keys that must be present */
    keys(self: T['$Field']): string[] // ['foo', 'bar', 'baz']

    /** for every item given by the list above */
    getKey(self: T['$Field'], ix: number): string

    /** once an item if  */
    init(key: string /* foo */): T['$Value']
}

// CONFIG
export interface Field_list_config<out T extends ISchema>
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
export type Field_list_serial<T extends ISchema> = FieldSerial<{
    type: 'list'
    items_: T['$Serial'][]
}>

// VALUE
export type Field_list_value<T extends ISchema> = T['$Value'][]

// TYPES
export type Field_list_types<T extends ISchema> = {
    $Type: 'list'
    $Config: Field_list_config<T>
    $Serial: Field_list_serial<T>
    $Value: Field_list_value<T>
    $Field: Field_list<T>
}

// STATE
export class Field_list<T extends ISchema> //
    extends Field<Field_list_types<T>>
{
    DefaultHeaderUI = WidgetList_LineUI
    DefaultBodyUI = WidgetList_BodyUI

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

    get subFields(): Field[] {
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
                let needBump = false

                // 1. Add missing entries
                const currentKeys: string[] = this.items.map((i, ix) => auto.getKey(i, ix))
                const missingKeys: string[] = keys.filter((k) => !currentKeys.includes(k))
                for (const k of missingKeys) {
                    this.addItem({
                        value: auto.init(k),
                        skipBump: true,
                    })
                    needBump = true
                }

                // 2. delete items that must be removed.
                let ix = 0
                for (const item of this.items.slice()) {
                    const isExtra = !keys.includes(auto.getKey(item, ix++))
                    if (!isExtra) continue
                    this.removeItem(item)
                    needBump = true
                }
                if (needBump) this.applyValueUpdateEffects()
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
        schema: ISchema<Field_list<T>>,
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

    protected setOwnSerial(serial: Maybe<Field_list_serial<T>>) {
        // minor safety net since all those internal changes
        if (this.serial.items_ == null) this.serial.items_ = []

        // pseudo-reset 🔴
        if (this.items != null)
            for (const item of this.items) {
                item.dispose()
            }
        this.items = []
        this.serial.items_ = []

        // when NO-serial, NO-auto
        if (serial == null) {
            if (!this.config.auto) {
                const defaultLength = clampOpt(this.config.defaultLength, this.config.min, this.config.max)
                for (let i = this.items.length; i < defaultLength; i++) {
                    this.addItem({ skipBump: true })
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
            this.addItem({ skipBump: true })
        }
    }

    /**
     * code below is very wtf, and surprisingly simple for what it achieve
     * see `src/csuite/model/TESTS/proxy.test.ts` if you're not scared
     */
    get value(): Field_list_value<T> {
        return new Proxy(this.items as any, {
            get: (target, prop: any) => {
                // ⏸️ console.log(`[GET]`, prop)
                if (typeof prop === 'symbol') return target[prop]

                // MOBX HACK ----------------------------------------------------
                if (prop === 'toJSON') return () => this.valueArr
                if (prop === 'pop') return () => this.pop()
                if (prop === 'shift') return () => this.shift()
                if (prop === 'unshift') return (...args: any[]) => this.unshift(...args)
                if (prop === 'push') return (...args: any[]) => this.push(...args)
                if (prop === 'slice') return (start: any, end: any) => this.valueArr.slice(start, end)
                // MOBX HACK ----------------------------------------------------

                // handle numbers (1) and number-like ('1')
                if (parseInt(prop, 10) === +prop) {
                    return target[+prop]?.value
                }

                // defer to target for other props
                return target[prop]
            },
            set: (target, prop: any, value) => {
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
        this.VALMUT(() => {
            for (let i = 0; i < val.length; i++) {
                // 1. replace existing items
                if (i < this.items.length) {
                    this.items[i]!.value = val[i]
                }
                // 2. add missing items
                else {
                    this.addItem({ skipBump: true })
                    this.items[i]!.value = val[i]
                }
            }
            // 3. remove extra items
            this.serial.items_.splice(val.length)
            this.items.splice(val.length)
        })
        // // 4. apply update effects
        // this.applyValueUpdateEffects()
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

    push(...value: T['$Value'][]): void {
        // we skip bump durin the for loop,
        // to only call applyValueUpdateEffects at the end once
        for (const v of value) {
            this.addItem({
                value: v,
                skipBump: true,
            })
        }
        // should be called once per mutable action
        this.applyValueUpdateEffects()
    }

    unshift(...value: T['$Value'][]): void {
        // we skip bump durin the for loop,
        // to only call applyValueUpdateEffects at the end once
        for (const v of value) {
            this.addItem({ value: v, skipBump: true, at: 0 })
        }
        // should be called once per mutable action
        this.applyValueUpdateEffects()
    }

    addItem(
        p: {
            skipBump?: true
            at?: number
            value?: T['$Value']
        } = {} /*
            2024-??-?? - rvion: 🔴 Annoying special case in the list's ctor
            2024-07-02 - rvion: wtf did I just mean by that? 🤔
         */,
    ) {
        // ensure list is not at max len already
        if (this.config.max != null && this.items.length >= this.config.max)
            return console.log(`[🔶] list.addItem: list is already at max length`)

        // ensure index we're adding this at is valid
        if (p.at != null && p.at < 0) return console.log(`[🔶] list.addItem: at is negative`)
        if (p.at != null && p.at > this.items.length) return console.log(`[🔶] list.addItem: at is out of bounds`)

        // create new item
        const schema = this.schemaAt(p.at ?? this.serial.items_.length) // TODO: evaluate schema in the form loop
        const element = schema.instanciate(this.repo, this.root, this, null)

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
        if (!p?.skipBump) this.applyValueUpdateEffects()
    }

    // MOVING ITEMS ---------------------------------------------------
    moveItem(
        //
        oldIndex: number,
        newIndex: number,
    ) {
        if (oldIndex === newIndex) return console.log(`[🔶] list.moveItem: oldIndex === newIndex`)
        if (oldIndex < 0 || oldIndex >= this.length) return console.log(`[🔶] list.moveItem: oldIndex out of bounds`)
        if (newIndex < 0 || newIndex >= this.length) return console.log(`[🔶] list.moveItem: newIndex out of bounds`)

        // serials
        const serials = this.serial.items_
        serials.splice(newIndex, 0, bang(serials.splice(oldIndex, 1)[0]))

        // instances
        const instances = this.items
        instances.splice(newIndex, 0, bang(instances.splice(oldIndex, 1)[0]))
        this.applyValueUpdateEffects()
    }

    // REMOVING ITEMS ------------------------------------------------
    removeAllItems(): void {
        // ensure list is not empty
        if (this.length === 0) return console.log(`[🔶] list.removeAllItems: list is already empty`)
        // ensure list is not at min len already
        const minLen = this.config.min ?? 0
        if (this.length <= minLen) return console.log(`[🔶] list.removeAllItems: list is already at min lenght`)
        // remove all items
        this.VALMUT(() => {
            this.serial.items_ = this.serial.items_.slice(0, minLen)
            this.items = this.items.slice(0, minLen)
            this.applyValueUpdateEffects()
        })
    }

    removeItem(item: T['$Field']): void {
        // ensure item is in the list
        const i = this.items.indexOf(item)
        if (i === -1) return console.log(`[🔶] list.removeItem: item not found`)
        this.removeItemAt(i)
    }

    pop(): void {
        this.removeItemAt(this.items.length - 1)
    }

    shift(): void {
        this.removeItemAt(0)
    }

    removeItemAt(i: number): void {
        this.VALMUT(() => {
            this.serial.items_.splice(i, 1)
            this.items.splice(i, 1)
        })
    }
}

// DI
registerWidgetClass('list', Field_list)
