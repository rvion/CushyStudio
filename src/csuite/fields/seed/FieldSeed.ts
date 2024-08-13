import type { BaseSchema } from '../../model/BaseSchema'
import type { Factory } from '../../model/Factory'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { getGlobalSeeder, type Seeder } from './Seeder'
import { WidgetSeedUI } from './WidgetSeedUI'

type SeedMode = 'randomize' | 'fixed' | 'last'

// CONFIG
export type Field_seed_config = FieldConfig<
    {
        default?: number
        defaultMode?: SeedMode
        min?: number
        max?: number
        seeder?: Seeder
    },
    Field_seed_types
>

// SERIAL
export type Field_seed_serial = FieldSerial<{
    $: 'seed'
    val?: number
    mode?: SeedMode
}>

// SERIAL FROM VALUE
export const Field_seed_fromValue = (value: Field_seed_value): Field_seed_serial => ({
    $: 'seed',
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

    get ownProblems(): Problem_Ext {
        return null
    }

    get hasChanges(): boolean {
        if (this.serial.mode !== this.defaultMode) return true
        if (this.serial.mode === 'fixed') return this.value !== this.defaultValue
        return false
    }

    get defaultMode(): SeedMode {
        return this.config.defaultMode ?? 'randomize'
    }

    get defaultValue(): number {
        return this.config.default ?? 0
    }

    setMode = (mode: SeedMode): void => {
        if (this.serial.mode === mode) return
        this.runInValueTransaction(() => (this.serial.mode = mode))
    }

    setToFixed = (val?: number): void => {
        this.runInValueTransaction(() => {
            this.serial.mode = 'fixed'
            if (val) this.serial.val = val
        })
    }

    setToRandomize(): void {
        if (this.serial.mode === 'randomize') return
        this.runInValueTransaction(() => (this.serial.mode = 'randomize'))
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_seed>,
        serial?: Field_seed_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_seed_serial>): void {
        this.serial.val = serial?.val ?? this.defaultValue
        this.serial.mode = serial?.mode ?? this.defaultMode
    }

    get value(): Field_seed_value {
        const seeder = this.config.seeder ?? getGlobalSeeder()
        const count = seeder.count
        const mode = this.serial.mode ?? this.config.defaultMode ?? 'randomize'
        return mode === 'randomize' //
            ? Math.floor(Math.random() * 9_999_999)
            : this.serial.val ?? this.config.default ?? 0
    }

    set value(val: number) {
        if (this.serial.mode === 'fixed' && this.serial.val === val) return
        // 🔴 a moitié faux
        this.runInValueTransaction(() => {
            this.serial.val = val
        })
    }
}

registerFieldClass('seed', Field_seed)
