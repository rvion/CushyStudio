import type { Channel, ChannelId, Producer } from '../model/Channel'
import type { Entity } from '../model/Entity'
import type { EntitySerial } from '../model/EntitySerial'
import type { Field } from '../model/Field'
import type { Instanciable } from '../model/Instanciable'
import type { ISchema } from '../model/ISchema'
import type { CovariantFn } from '../variance/BivariantHack'

import { makeObservable, reaction } from 'mobx'

import { simpleRepo } from '../'
import { Field_link, type Field_link_config } from '../fields/link/WidgetLink'
import { Field_list, Field_list_config, type Field_list_serial } from '../fields/list/WidgetList'
import { Field_optional } from '../fields/optional/WidgetOptional'
import { objectAssignTsEfficient_t_pt } from '../utils/objectAssignTsEfficient'

export interface SimpleSchema<out FIELD extends Field = Field> {
    $Field: FIELD
    $Type: FIELD['type']
    $Config: FIELD['$Config']
    $Serial: FIELD['$Serial']
    $Value: FIELD['$Value']
}
export class SimpleSchema<out FIELD extends Field = Field> implements ISchema<FIELD>, Instanciable<FIELD> {
    FieldClass_UNSAFE: any

    get type(): FIELD['$Type'] {
        return this.FieldClass_UNSAFE.type
    }

    constructor(
        FieldClass: {
            readonly type: FIELD['$Type']
            new (
                //
                entity: Entity,
                parent: Field | null,
                spec: ISchema<FIELD>,
                serial?: FIELD['$Serial'],
            ): FIELD
        },
        public readonly config: FIELD['$Config'],
    ) {
        this.FieldClass_UNSAFE = FieldClass
        makeObservable(this, { config: true })
    }

    create(serial?: () => Maybe<EntitySerial>) {
        return simpleRepo.entity(this, { serial })
    }

    instanciate(
        //
        entity: Entity<any>,
        parent: Field | null,
        serial: any | null,
    ) {
        // recover phase
        if (serial != null && serial.type !== this.type) {
            // ADDING LIST
            if (this.type === 'list') {
                const prev: any = serial
                const next: Field_list_serial<any> = {
                    type: 'list',
                    items_: [prev],
                }
                serial = next
            }
            // REMOVING LIST
            else if (serial.type === 'list') {
                const prev: Field_list_serial<any> = serial as any
                const next: any = prev.items_[0] ?? null
                serial = next
            }
        }

        // ensure the serial is compatible
        if (serial != null && serial.type !== this.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${this.type}, got: ${serial.type})`)
            serial = null
        }
        const field = new this.FieldClass_UNSAFE(entity, parent, this, serial)
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

    LabelExtraUI() {
        return null
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

    /**
     * chain construction
     * @since 2024-06-30
     * TODO: WRITE MORE DOC
     */
    useIn<BP extends ISchema>(fn: CovariantFn<[field: FIELD], BP>): S.SLink<this, BP> {
        const linkConf: Field_link_config<this, BP> = { share: this, children: fn }
        return new SimpleSchema(Field_link<any, any>, linkConf)
    }

    // -----------------------------------------------------
    // Make<X extends BaseField>(type: X['type'], config: X['$Config']) {
    //     return new SimpleSchema(this.builder, type, config)
    // }

    /** wrap widget schema to list stuff */
    list(config: Omit<Field_list_config<this>, 'element'> = {}): S.SList<this> {
        return new SimpleSchema<Field_list<this>>(Field_list, {
            ...config,
            element: this,
        })
    }

    optional(startActive: boolean = false): S.SOptional<this> {
        return new SimpleSchema<Field_optional<this>>(Field_optional, {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
    }

    /** clone the schema, and patch the cloned config */
    withConfig(config: Partial<FIELD['$Config']>): SimpleSchema<FIELD> {
        const mergedConfig = objectAssignTsEfficient_t_pt(this.config, config)
        const cloned = new SimpleSchema<FIELD>(this.FieldClass_UNSAFE, mergedConfig)
        // 🔴 Keep producers and reactions -> could probably be part of the ctor
        cloned.producers = this.producers
        cloned.reactions = this.reactions
        return cloned
    }

    /** clone the schema, and patch the cloned config to make it hidden */
    hidden(): SimpleSchema<FIELD> {
        return this.withConfig({ hidden: true })
    }
}
