import type { CovariantFC, CovariantFn } from '../csuite'
import type { BaseField } from '../csuite/model/BaseField'
import type { Entity } from '../csuite/model/Entity'
import type { ISchema } from '../csuite/model/ISchema'
import type { Requirements } from '../manager/REQUIREMENTS/Requirements'

import { reaction } from 'mobx'
import { createElement, type ReactNode } from 'react'

import { Widget_link, type Widget_link_config } from '../csuite/fields/link/WidgetLink'
import { Widget_list, Widget_list_config } from '../csuite/fields/list/WidgetList'
import { Widget_optional } from '../csuite/fields/optional/WidgetOptional'
import { isWidgetOptional } from '../csuite/fields/WidgetUI.DI'
import { Channel, type ChannelId, Producer } from '../csuite/model/Channel'
import { objectAssignTsEfficient_t_pt } from '../csuite/utils/objectAssignTsEfficient'
import { InstallRequirementsBtnUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'

export interface Schema<out Field extends BaseField = BaseField> {
    $Field: Field
    $Type: Field['type']
    $Config: Field['$Config']
    $Serial: Field['$Serial']
    $Value: Field['$Value']
}

export class Schema<out Field extends BaseField = BaseField> implements ISchema<Field> {
    FieldClass_UNSAFE: any

    constructor(
        FieldClass: {
            new (
                //
                entity: Entity,
                parent: BaseField | null,
                spec: ISchema<Field>,
                serial?: Field['$Serial'],
            ): Field
        },
        public readonly type: Field['type'],
        public readonly config: Field['$Config'],
    ) {
        this.FieldClass_UNSAFE = FieldClass
        // makeObservable(this, { config: true })
    }

    instanciate(
        //
        entity: Entity<any>,
        parent: BaseField | null,
        serial: any | null,
    ) {
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

    _methods: any = {}
    actions<T extends { [methodName: string]: (self: Field) => any }>(t: T): Schema<Field & T> {
        Object.assign(this._methods, t)
        return this as any
    }

    _skins: any = {}
    skins<
        T extends {
            // prettier-ignore
            [methodName: string]:
                /** simplified skin definition */
                | { [key: string]: any }
                /** full react field */
                | ((p: { widget: Field }) => ReactNode)
        },
    >(t: T): Schema<Field & T /* & { skin: T } */> {
        Object.assign(this._skins, t)
        return this as any
    }

    LabelExtraUI: CovariantFC<{ widget: Field }> = (p: { widget: Field }) =>
        createElement(InstallRequirementsBtnUI, {
            active: isWidgetOptional(p.widget) ? p.widget.serial.active : true,
            requirements: this.requirements,
        })

    producers: Producer<any, Field['$Field']>[] = []
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: Field['$Field']) => T): this {
        this.producers.push({ chan, produce })
        return this
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: Field['$Field']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    reactions: {
        expr(self: Field['$Field']): any
        effect(arg: any, self: Field['$Field']): void
    }[] = []

    addReaction<T>(
        //
        expr: (self: Field['$Field']) => T,
        effect: (arg: T, self: Field['$Field']) => void,
    ): this {
        this.reactions.push({ expr, effect })
        return this
    }

    // Requirements (CushySpecifc)
    readonly requirements: Requirements[] = []

    addRequirements(requirements: Maybe<Requirements | Requirements[]>) {
        if (requirements == null) return this
        if (Array.isArray(requirements)) this.requirements.push(...requirements)
        else this.requirements.push(requirements)
        // this.🐌
        return this
    }

    useIn<BP extends ISchema>(
        //
        fn: CovariantFn<[field: Field], BP>,
    ): X.XLink<this, BP> {
        const linkConf: Widget_link_config<this, BP> = { share: this, children: fn }
        return new Schema(Widget_link, 'link', linkConf)
    }

    // Make<X extends BaseField>(type: X['type'], config: X['$Config']) {
    //     return new Schema(type, config)
    // }

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<any>, 'element'> = {}): X.XList<this> =>
        new Schema<Widget_list<this>>(Widget_list, 'list', {
            ...config,
            element: this,
        })

    /** clone the spec, and patch the cloned config */
    withConfig(config: Partial<Field['$Config']>): Schema<Field> {
        const mergedConfig = objectAssignTsEfficient_t_pt(this.config, config)
        const cloned = new Schema<Field>(this.FieldClass_UNSAFE, this.type, mergedConfig)
        // 🔴 Keep producers and reactions -> could probably be part of the ctor
        cloned.producers = this.producers
        cloned.reactions = this.reactions
        return cloned
    }

    optional(startActive: boolean = false): X.XOptional<this> {
        return new Schema<Widget_optional<this>>(Widget_optional, 'optional', {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            // requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
    }

    /** clone the spec, and patch the cloned config to make it hidden */
    hidden() {
        return this.withConfig({ hidden: true })
    }
}
