import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { computed, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Widget_optional_config<T extends ISchema = ISchema> = FieldConfig<
    {
        startActive?: boolean
        widget: T
    },
    Widget_optional_types<T>
>

// SERIAL
export type Widget_optional_serial<T extends ISchema = ISchema> = FieldSerial<{
    type: 'optional'
    child?: Maybe<T['$Serial']>
    active: boolean
}>

// VALUE
export type Widget_optional_value<T extends ISchema = ISchema> = Maybe<T['$Value']>

// TYPES
export type Widget_optional_types<T extends ISchema = ISchema> = {
    $Type: 'optional'
    $Config: Widget_optional_config<T>
    $Serial: Widget_optional_serial<T>
    $Value: Widget_optional_value<T>
    $Field: Widget_optional<T>
}

// STATE
export class Widget_optional<T extends ISchema = ISchema> extends BaseField<Widget_optional_types<T>> {
    DefaultHeaderUI = undefined
    DefaultBodyUI = undefined
    readonly id: string

    reset(): void {
        // active by default
        if (this.config.startActive) {
            if (!this.serial.active) this.setActive(true)
            if (this.child.hasChanges) this.child.reset()
            return
        }
        // unactive by default
        else {
            if (this.serial.active) this.setActive(false)
            return
        }
    }
    get hasChanges(): boolean {
        // active by default
        if (this.config.startActive) {
            if (!this.serial.active) return true
            return this.child.hasChanges
        }
        // unactive by default
        else {
            if (!this.serial.active) return false
            return true
        }
    }

    readonly type: 'optional' = 'optional'
    get baseErrors(): Problem_Ext {
        return null
    }
    serial: Widget_optional_serial<T>
    child!: T['$Field']

    get childOrThrow(): T['$Field'] {
        if (this.child == null) throw new Error('❌ optional active but child is null')
        return this.child
    }

    setActive = (value: boolean) => {
        if (this.serial.active === value) return
        this.serial.active = value
        this.applyValueUpdateEffects()

        // update child collapsed state if need be
        if (value) this.child.setCollapsed(false)
        else this.child.setCollapsed(true)
    }

    /**
     * as of 2024-03-14, this is only called in the constructor
     * TODO: inline ?
     */
    private _ensureChildIsHydrated = () => {
        if (this.child) return
        const spec = this.config.widget
        const prevSerial = this.serial.child
        if (prevSerial && spec.type === prevSerial.type) {
            this.child = this.entity.domain._HYDRATE(this.entity, this, spec, prevSerial)
        } else {
            this.child = this.entity.domain._HYDRATE(this.entity, this, spec, null)
            this.serial.child = this.child.serial
        }
    }

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_optional<T>>,
        serial?: Widget_optional_serial<T>,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        const defaultActive = config.startActive
        this.serial = serial ?? {
            id: this.id,
            type: 'optional',
            active: defaultActive ?? false,
            collapsed: config.startCollapsed,
        }

        // meh
        const isActive = serial?.active ?? defaultActive
        if (isActive) this.serial.active = true

        // ⏸️ if (this.INIT_MODE === 'EAGER') this._ensureChildIsHydrated()
        this._ensureChildIsHydrated()
        this.init({
            serial: observable,
            value: computed,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    /** hack so optional fields do not increase nesting twice */
    get indentChildren(): number {
        return 0
    }

    get subWidgets(): BaseField[] {
        return this.serial.active ? [this.child] : []
    }

    get subWidgetsWithKeys(): { key: string; widget: BaseField }[] {
        return this.serial.active ? [{ key: 'child', widget: this.child }] : []
    }

    get value(): Widget_optional_value<T> {
        if (!this.serial.active) return null
        return this.childOrThrow.value
    }

    set value(next: Widget_optional_value<T>) {
        if (next == null) {
            this.setActive(false)
            return
        } else {
            this.setActive(true)
            this.child.value = next
        }
    }
}

// DI
registerWidgetClass('optional', Widget_optional)
