import type { Field_list_serial } from '../fields/list/FieldList'
import type { CovariantFC } from '../variance/CovariantFC'
import type { Channel, ChannelId, Producer } from './Channel'
import type { Factory } from './Factory'
import type { Field } from './Field'
import type { FieldSerial_CommonProperties } from './FieldSerial'

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
    // ⏸️ createForm(x: keyof { [key in keyof FIELD as FIELD[key] extends ProplessFC ? key : never]: FIELD[key] }): void {
    // ⏸️     //
    // ⏸️     return
    // ⏸️ }

    // ------------------------------------------------------------
    private _exts: any[] = []
    applyExts(field: FIELD): void {
        for (const ext of this._exts) {
            const xxx = ext(field)
            Object.defineProperties(field, Object.getOwnPropertyDescriptors(xxx))
        }
    }

    extend<EXTS extends object>(extensions: (self: FIELD) => EXTS): BaseSchema<EXTS & FIELD> {
        this._exts.push(extensions)
        return this as any
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
    producers: Producer<any, FIELD['$Field']>[] = []
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: FIELD['$Field']) => T): this {
        this.producers.push({ chan, produce })
        return this
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
    // ------------------------------------------------------------
    // Reaction system
    reactions: {
        expr(self: FIELD['$Field']): any
        effect(arg: any, self: FIELD['$Field']): void
    }[] = []

    addReaction<T>(
        //
        expr: (self: FIELD['$Field']) => T,
        effect: (arg: T, self: FIELD['$Field']) => void,
    ): this {
        this.reactions.push({ expr, effect })
        return this
    }

    // ------------------------------------------------------------
    // Instanciation

    create(serial?: FIELD['$Serial'], repository?: Repository): FIELD {
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
