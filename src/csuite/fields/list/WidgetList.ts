import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'

import { observable, reaction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { runWithGlobalForm } from '../../model/runWithGlobalForm'
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
export interface Widget_list_config<out T extends ISchema>
    extends FieldConfig<
        {
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
        Widget_list_types<T>
    > {}

// SERIAL
export type Widget_list_serial<T extends ISchema> = FieldSerial<{
    type: 'list'
    items_: T['$Serial'][]
}>

// VALUE
export type Widget_list_value<T extends ISchema> = T['$Value'][]

// TYPES
export type Widget_list_types<T extends ISchema> = {
    $Type: 'list'
    $Config: Widget_list_config<T>
    $Serial: Widget_list_serial<T>
    $Value: Widget_list_value<T>
    $Field: Widget_list<T>
}

// STATE
export class Widget_list<T extends ISchema> //
    extends BaseField<Widget_list_types<T>>
{
    DefaultHeaderUI = WidgetList_LineUI
    DefaultBodyUI = WidgetList_BodyUI

    readonly id: string

    readonly type: 'list' = 'list'

    get length() { return this.items.length } // prettier-ignore
    items: T['$Field'][]
    serial: Widget_list_serial<T>

    get hasChanges(): boolean {
        // in auto mode, length is managed, so we must not take it into account
        if (!this.config.auto) {
            const defaultLength = clampOpt(this.config.defaultLength, this.config.min, this.config.max)
            if (this.items.length !== defaultLength) return true
        }
        // check if any remaining item has changes
        return this.items.some((i) => i.hasChanges)
    }
    reset(): void {
        // fix size
        if (!this.config.auto) {
            const defaultLength = clampOpt(this.config.defaultLength, this.config.min, this.config.max)
            for (let i = this.items.length; i > defaultLength; i--) this.removeItem(this.items[i - 1]!)
            for (let i = this.items.length; i < defaultLength; i++) this.addItem({ skipBump: true })
        }

        // reset all remaining values
        for (const i of this.items) i.reset()
    }

    findItemIndexContaining = (widget: BaseField): number | null => {
        let at = widget as BaseField | null
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

    get subWidgets(): BaseField[] {
        return this.items
    }

    get subWidgetsWithKeys(): { key: string; widget: BaseField }[] {
        return this.items.map((widget, ix) => ({ key: ix.toString(), widget }))
    }

    schemaAt = (ix: number): T => {
        const _schema = this.config.element
        const schema: T =
            typeof _schema === 'function' //
                ? runWithGlobalForm(this.entity.domain, () => _schema(ix))
                : _schema
        return schema
    }

    get isAuto(): boolean {
        return this.config.auto != null
    }
    // probably slow and clunky; TODO: rewrite this piece of crap
    startAutoBehaviour = () => {
        const auto = this.config.auto
        if (auto == null) return
        reaction(
            () => auto.keys(this),
            (keys: string[]) => {
                const currentKeys = this.items.map((i, ix) => auto.getKey(i, ix))
                const missingKeys = keys.filter((k) => !currentKeys.includes(k))
                let needBump = false
                for (const k of missingKeys) {
                    this.addItem({ value: auto.init(k), skipBump: true })
                    needBump = true
                }
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
    }

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_list<T>>,
        serial?: Widget_list_serial<T>,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()

        // serial
        this.serial = serial ?? observable({ type: 'list', id: this.id, active: true, items_: [] })

        // minor safety net since all those internal changes
        if (this.serial.items_ == null) this.serial.items_ = []

        // hydrate items
        this.items = []

        // 1. add default item (only when serial was null)
        if (serial == null && this.config.defaultLength != null) {
            for (let i = 0; i < this.config.defaultLength; i++) this.addItem({ skipBump: true })
        }
        // 2. pre-existing serial => rehydrate items
        else {
            const unmounted = this.schemaAt(0) // TODO: evaluate schema in the form loop
            for (const subSerial of this.serial.items_) {
                if (
                    subSerial == null || // ⁉️ when can this happen ?
                    subSerial.type !== unmounted.type
                ) {
                    console.log(`[❌] SKIPPING form item because it has an incompatible entry from a previous app definition`)
                    continue
                }
                const subWidget = entity.domain._HYDRATE(this.entity, this, unmounted, subSerial)
                this.items.push(subWidget)
            }
        }

        // 3. add missing items if min specified
        const missingItems = (this.config.min ?? 0) - this.items.length
        for (let i = 0; i < missingItems; i++) this.addItem({ skipBump: true })

        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
        this.startAutoBehaviour()
    }

    get value(): Widget_list_value<T> {
        return this.items.map((i) => i.value)
    }

    set value(val: Widget_list_value<T>) {
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

        // 4. apply update effects
        this.applyValueUpdateEffects()
    }

    // HELPERS =======================================================
    // FOLDING -------------------------------------------------------
    collapseAllItems = () => {
        for (const i of this.items) i.setCollapsed(true)
    }

    expandAllItems = () => {
        for (const i of this.items) i.setCollapsed(false)
    }

    // ERRORS --------------------------------------------------------
    get baseErrors(): string[] {
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
    addItem(p: { skipBump?: true; at?: number; value?: T['$Value'] } = {} /* 🔴 Annoying special case in the list's ctor */) {
        // ensure list is not at max len already
        if (this.config.max != null && this.items.length >= this.config.max)
            return console.log(`[🔶] list.addItem: list is already at max length`)

        // ensure index we're adding this at is valid
        if (p.at != null && p.at < 0) return console.log(`[🔶] list.addItem: at is negative`)
        if (p.at != null && p.at > this.items.length) return console.log(`[🔶] list.addItem: at is out of bounds`)

        // create new item
        const schema = this.schemaAt(p.at ?? this.serial.items_.length) // TODO: evaluate schema in the form loop
        const element = this.entity.domain._HYDRATE(this.entity, this, schema, null)

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

    // REMOVING ITEMS ------------------------------------------------
    removeAllItems = () => {
        // ensure list is not empty
        if (this.length === 0) return console.log(`[🔶] list.removeAllItems: list is already empty`)
        // ensure list is not at min len already
        const minLen = this.config.min ?? 0
        if (this.length <= minLen) return console.log(`[🔶] list.removeAllItems: list is already at min lenght`)
        // remove all items
        this.serial.items_ = this.serial.items_.slice(0, minLen)
        this.items = this.items.slice(0, minLen)
        this.applyValueUpdateEffects()
    }

    removeItem(item: T['$Field']) {
        // ensure item is in the list
        const i = this.items.indexOf(item)
        if (i === -1) return console.log(`[🔶] list.removeItem: item not found`)
        // remove item
        this.serial.items_.splice(i, 1)
        this.items.splice(i, 1)
        this.applyValueUpdateEffects()
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
}

// DI
registerWidgetClass('list', Widget_list)
