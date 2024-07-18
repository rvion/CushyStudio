import type { Field_list_serial } from '../fields/list/FieldList'
import type { CovariantFC } from '../variance/CovariantFC'
import type { Factory } from './Factory'
import type { Field } from './Field'
import type { FieldSerial_CommonProperties } from './FieldSerial'
import type { Channel, ChannelId } from './pubsub/Channel'
import type { FieldReaction } from './pubsub/FieldReaction'
import type { Producer } from './pubsub/Producer'

import { reaction } from 'mobx'

import { autofixSerial_20240703 } from './autofix/autofixSerial_20240703'
import { autofixSerial_20240711 } from './autofix/autofixSerial_20240711'
import { getGlobalRepository, type Repository } from './Repository'

export interface BaseSchema<out FIELD extends Field = Field> {
    $Field: FIELD
    $Type: FIELD['$Type']
    $Config: FIELD['$Config']
    $Serial: FIELD['$Serial']
    $Value: FIELD['$Value']
}

export abstract class BaseSchema<out FIELD extends Field = Field> {
    // ------------------------------------------------------------
    applyExts(field: FIELD): void {
        for (const ext of this.config.customFieldProperties ?? []) {
            const xxx = ext(field)
            Object.defineProperties(field, Object.getOwnPropertyDescriptors(xxx))
        }
    }

    extend<EXTS extends object>(extensions: (self: FIELD) => EXTS): BaseSchema<EXTS & FIELD> {
        const x: BaseSchema<FIELD> = this.withConfig({
            customFieldProperties: [...(this.config.customFieldProperties ?? []), extensions],
        })
        return x as any as BaseSchema<EXTS & FIELD>
    }

    applySchemaExtensions(): void {
        for (const ext of this.config.customSchemaProperties ?? []) {
            const xxx = ext(this)
            Object.defineProperties(this, Object.getOwnPropertyDescriptors(xxx))
        }
    }
    // ------------------------------------------------------------

    /** constructor/class of the field to instanciate */
    abstract FieldClass_UNSAFE: any

    /** type of the field to instanciate */
    abstract type: FIELD['type']

    /** config of the field to instanciate */
    abstract config: FIELD['$Config']

    // ------------------------------------------------------------
    LabelExtraUI?: CovariantFC<{ field: FIELD }>

    // ------------------------------------------------------------
    // Clone/Fork
    abstract withConfig(config: Partial<FIELD['$Config']>): this

    /** clone the schema, and patch the cloned config to make it hidden */
    hidden(): this {
        return this.withConfig({ hidden: true })
    }

    // PubSub -----------------------------------------------------
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: FIELD['$Field']) => T): this {
        return this.withConfig({
            producers: [...(this.config.producers ?? []), { chan, produce }],
        })
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: FIELD['$Field']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    get reactions(): FieldReaction<FIELD>[] {
        return this.config.reactions ?? []
    }

    get producers(): Producer<any, FIELD>[] {
        return this.config.producers ?? []
    }

    addReaction<T>(
        //
        expr: (self: FIELD['$Field']) => T,
        effect: (arg: T, self: FIELD['$Field']) => void,
    ): this {
        return this.withConfig({
            reactions: [...(this.config.reactions ?? []), { expr, effect }],
        })
    }

    // ------------------------------------------------------------
    // Instanciation

    create(
        //
        serial?: FIELD['$Serial'],
        repository?: Repository,
    ): FIELD {
        return this.instanciate(repository ?? getGlobalRepository(), null, null, serial)
    }

    instanciate(
        //
        repo: Repository,
        root: Field<any> | null,
        parent: Field | null,
        serial?: FieldSerial_CommonProperties | null,
    ): FIELD {
        // AUTOMIGRATION --------------------------------------------------------------------
        // recover phase
        serial = autofixSerial_20240703(serial)
        autofixSerial_20240711(serial)
        if (serial != null && serial.$ !== this.type) {
            // ADDING LIST
            if (this.type === 'list') {
                const prev: any = serial
                const next: Field_list_serial<any> = { $: 'list', items_: [prev] }
                serial = next
            }
            // REMOVING LIST
            else if (serial.$ === 'list') {
                const prev: Field_list_serial<any> = serial as any
                const next: any = prev.items_[0] ?? null
                serial = next
            }
        }
        // ----------------------------------------------------------------------------------

        // run the config.onCreation if needed
        if (this.config.beforeInit) {
            const oldVersion = serial?._version ?? 'default'
            const newVersion = this.config.version ?? 'default'
            if (oldVersion !== newVersion) {
                serial = this.config.beforeInit(serial)
                serial!._version = newVersion
            }
        }

        // ensure the serial is compatible
        if (serial != null && serial.$ !== this.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${this.type}, got: ${serial.$})`)
            console.log(`[🔶] INVALID SERIAL:`, serial)
            serial = null
        }
        const field = new this.FieldClass_UNSAFE(repo, root, parent, this, serial)
        field.publishValue()
        for (const { expr, effect } of this.reactions) {
            // 🔴 Need to dispose later
            reaction(
                () => expr(field),
                (arg) => effect(arg, field),
                { fireImmediately: true },
            )
        }
        return field
    }
}
