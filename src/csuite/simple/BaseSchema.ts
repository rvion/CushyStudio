import type { Field_list_serial } from '../fields/list/WidgetList'
import type { Field } from '../model/Field'
import type { Repository } from '../model/Repository'

import { reaction } from 'mobx'

export interface BaseSchema<out FIELD extends Field = Field> {
    $Field: FIELD
    $Type: FIELD['$Type']
    $Config: FIELD['$Config']
    $Serial: FIELD['$Serial']
    $Value: FIELD['$Value']
}

export abstract class BaseSchema<out FIELD extends Field = Field> {
    abstract FieldClass_UNSAFE: any
    abstract type: FIELD['type']
    abstract config: FIELD['$Config']

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

    abstract repository: Repository
    create(serial?: FIELD['$Serial']): FIELD['$Field'] {
        return this.instanciate(this.repository, null, null, serial)
    }

    instanciate(
        //
        repo: Repository,
        root: Field<any> | null,
        parent: Field | null,
        serial?: any | null,
    ) {
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
