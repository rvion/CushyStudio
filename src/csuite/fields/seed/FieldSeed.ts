import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

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
export type Field_seed_unchecked = Field_seed_value | undefined

// TYPES
export type Field_seed_types = {
    $Type: 'seed'
    $Config: Field_seed_config
    $Serial: Field_seed_serial
    $Value: Field_seed_value
    $Unchecked: Field_seed_unchecked
    $Field: Field_seed
}

// STATE
export class Field_seed extends Field<Field_seed_types> {
    static readonly type: 'seed' = 'seed'
    static readonly emptySerial: Field_seed_serial = { $: 'seed' }
    static migrateSerial(): undefined {}

    DefaultHeaderUI = WidgetSeedUI
    DefaultBodyUI = undefined

    get ownTypeSpecificProblems(): Problem_Ext {
        return null
    }

    get isOwnSet(): boolean {
        return this.serial.val != null
    }

    get hasChanges(): boolean {
        if (this.serial.mode !== this.defaultMode) return true
        if (this.serial.mode === 'fixed') return this.value !== this.defaultValue
        return false
    }

    get defaultMode(): SeedMode {
        return this.config.defaultMode ?? 'randomize'
    }

    get defaultValue(): number | undefined {
        return this.config.default
    }

    setMode = (mode: SeedMode): void => {
        if (this.serial.mode === mode) return
        this.runInValueTransaction(() => this.patchSerial((draft) => void (draft.mode = mode)))
    }

    setToFixed = (val?: number): void => {
        this.runInValueTransaction(() => {
            this.patchSerial((draft) => {
                draft.mode = 'fixed'
                if (val != null) draft.val = val
            })
        })
    }

    setToRandomize(): void {
        if (this.serial.mode === 'randomize') return
        this.runInValueTransaction(() => this.patchSerial((draft) => void (draft.mode = 'randomize')))
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_seed>,
        initialMountKey: string,
        serial?: Field_seed_serial,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(next: Field_seed_serial): void {
        if (next.val == null) {
            const def = this.defaultValue
            if (def != null) next = produce(next, (draft) => void (draft.val = def))
        }
        if (next.mode == null) {
            const def = this.defaultMode
            if (def != null) next = produce(next, (draft) => void (draft.mode = def))
        }

        this.assignNewSerial(next)
    }

    get value(): Field_seed_value {
        return this.value_or_fail
        // const seeder = this.config.seeder ?? getGlobalSeeder()
        // const count = seeder.count
        // const mode = this.serial.mode ?? this.config.defaultMode ?? 'randomize'
        // return mode === 'randomize' //
        //     ? Math.floor(Math.random() * 9_999_999)
        //     : this.serial.val ?? this.config.default ?? 0
    }

    set value(val: number) {
        if (this.serial.mode === 'fixed' && this.serial.val === val) return
        // 🔴 a moitié faux
        this.runInValueTransaction(() => {
            this.patchSerial((draft) => void (draft.val = val))
        })
    }

    get value_or_fail(): number {
        const val = this.value_unchecked
        if (val == null) throw new Error('Field_seed.value_or_fail: not set')
        return val
    }

    get value_or_zero(): number {
        return this.value_unchecked ?? 0
    }

    get value_unchecked(): number | undefined {
        return this.computeValue()
    }

    private computeValue(): number | undefined {
        const seeder = this.config.seeder ?? getGlobalSeeder()
        const count = seeder.count
        const mode = this.serial.mode ?? this.config.defaultMode ?? 'randomize'
        return mode === 'randomize' //
            ? Math.floor(Math.random() * 9_999_999)
            : this.serial.val
    }
}

registerFieldClass('seed', Field_seed)
