import type { Field_list_serial } from '../fields/list/WidgetList'
import type { CovariantFC } from '../variance/CovariantFC'
import type { Channel, ChannelId, Producer } from './Channel'
import type { Field } from './Field'
import type { Repository } from './Repository'

import { reaction } from 'mobx'

export interface BaseSchema<out FIELD extends Field = Field> {
    $Field: FIELD
    $Type: FIELD['$Type']
    $Config: FIELD['$Config']
    $Serial: FIELD['$Serial']
    $Value: FIELD['$Value']
}

export abstract class BaseSchema<out FIELD extends Field = Field> {
    // ------------------------------------------------------------
    private _exts: any[] = []
    applyExts(field: FIELD): void {
        for (const ext of this._exts) {
            const xxx = ext(field)
            Object.defineProperties(field, Object.getOwnPropertyDescriptors(xxx))
        }
    }
    extend<EXTS extends (self: FIELD) => { [methodName: string]: any }>(
        //
        extensions: EXTS,
    ): BaseSchema<ReturnType<EXTS> & FIELD> {
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

    /** repository this schema belongs to */
    abstract repository: Repository

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

    create(serial?: FIELD['$Serial']): FIELD {
        return this.instanciate(this.repository, null, null, serial)
    }

    instanciate(
        //
        repo: Repository,
        root: Field<any> | null,
        parent: Field | null,
        serial?: any | null,
    ): FIELD {
        // AUTOMIGRATION --------------------------------------------------------------------
        // recover phase
        if (serial != null && serial.type !== this.type) {
            // ADDING LIST
            if (this.type === 'list') {
                const prev: any = serial
                const next: Field_list_serial<any> = { type: 'list', items_: [prev] }
                serial = next
            }
            // REMOVING LIST
            else if (serial.type === 'list') {
                const prev: Field_list_serial<any> = serial as any
                const next: any = prev.items_[0] ?? null
                serial = next
            }

            // RECOVER FROM EntitySerial
            if (serial.type === 'FormSerial') {
                const prev: any = serial
                const next: any = prev.root
                serial = next
            }
        }
        // ----------------------------------------------------------------------------------

        // run the config.onCreation if needed
        if (this.config.beforeInit) {
            const oldVersion = serial._version ?? 'default'
            const newVersion = this.config.version ?? 'default'
            if (oldVersion !== newVersion) {
                serial = this.config.beforeInit(serial)
                serial._version = newVersion
            }
        }

        // ensure the serial is compatible
        if (serial != null && serial.type !== this.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${this.type}, got: ${serial.type})`)
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
