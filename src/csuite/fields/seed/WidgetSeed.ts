import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSeedUI } from './WidgetSeedUI'

type SeedMode = 'randomize' | 'fixed' | 'last'
// CONFIG
export type Field_seed_config = FieldConfig<
    {
        default?: number
        defaultMode?: SeedMode
        min?: number
        max?: number
    },
    Field_seed_types
>

// SERIAL
export type Field_seed_serial = FieldSerial<{
    type: 'seed'
    val?: number
    mode?: SeedMode
}>

// SERIAL FROM VALUE
export const Field_seed_fromValue = (value: Field_seed_value): Field_seed_serial => ({
    type: 'seed',
    mode: 'fixed',
    val: value,
})

// VALUE
export type Field_seed_value = number

// TYPES
export type Field_seed_types = {
    $Type: 'seed'
    $Config: Field_seed_config
    $Serial: Field_seed_serial
    $Value: Field_seed_value
    $Field: Field_seed
}

// STATE
export class Field_seed extends Field<Field_seed_types> {
    static readonly type: 'seed' = 'seed'
    DefaultHeaderUI = WidgetSeedUI
    DefaultBodyUI = undefined

    get baseErrors(): Problem_Ext {
        return null
    }

    get hasChanges(): boolean {
        if (this.serial.mode !== this.defaultMode) return true
        if (this.serial.mode === 'fixed') return this.value !== this.defaultValue
        return false
    }

    reset(): void {
        this.setMode(this.defaultMode)
        if (this.serial.mode !== 'randomize') this.value = this.defaultValue
    }

    get defaultMode(): SeedMode {
        return this.config.defaultMode ?? 'randomize'
    }

    get defaultValue(): number {
        return this.config.default ?? 0
    }

    setMode = (mode: SeedMode) => {
        if (this.serial.mode === mode) return
        this.serial.mode = mode
        this.applyValueUpdateEffects()
    }

    setToFixed = (val?: number) => {
        this.serial.mode = 'fixed'
        if (val) this.serial.val = val
        this.applyValueUpdateEffects()
    }

    setToRandomize = () => {
        if (this.serial.mode === 'randomize') return
        this.serial.mode = 'randomize'
        this.applyValueUpdateEffects()
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_seed>,
        serial?: Field_seed_serial,
    ) {
        super(repo, root, parent, schema)
        this.setSerial(serial, false)
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_seed_serial>) {
        if (serial == null) {
            void delete this.serial.val
            void delete this.serial.mode
            return
        }
        if (serial.val != null) this.serial.val = serial.val
        if (serial.mode != null) this.serial.mode = serial.mode
    }

    get value(): Field_seed_value {
        const count = this.repo.domain._cache.count
        const mode = this.serial.mode ?? this.config.defaultMode ?? 'randomize'
        return mode === 'randomize' //
            ? Math.floor(Math.random() * 9_999_999)
            : this.serial.val ?? this.config.default ?? 0
    }

    set value(val: number) {
        this.serial.val = val
        this.applyValueUpdateEffects()
    }
}

registerWidgetClass('seed', Field_seed)
