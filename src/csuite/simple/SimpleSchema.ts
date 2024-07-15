import type { Field } from '../model/Field'
import type { Instanciable } from '../model/Instanciable'
import type { Repository } from '../model/Repository'
import type { CovariantFn } from '../variance/BivariantHack'

import { makeObservable } from 'mobx'

import { simpleRepo } from '../'
import { Field_link, type Field_link_config } from '../fields/link/FieldLink'
import { Field_list, Field_list_config } from '../fields/list/FieldList'
import { Field_optional } from '../fields/optional/FieldOptional'
import { BaseSchema } from '../model/BaseSchema'
import { objectAssignTsEfficient_t_pt } from '../utils/objectAssignTsEfficient'

export class SimpleSchema<out FIELD extends Field = Field> extends BaseSchema<FIELD> implements Instanciable<FIELD> {
    FieldClass_UNSAFE: any
    repository = simpleRepo

    get type(): FIELD['$Type'] {
        return this.FieldClass_UNSAFE.type
    }

    constructor(
        FieldClass: {
            readonly type: FIELD['$Type']
            new (
                //
                repo: Repository,
                root: Field,
                parent: Field | null,
                spec: BaseSchema<FIELD>,
                serial?: FIELD['$Serial'],
            ): FIELD
        },
        public readonly config: FIELD['$Config'],
    ) {
        super()
        this.FieldClass_UNSAFE = FieldClass
        makeObservable(this, {
            config: true,
            FieldClass_UNSAFE: false,
        })
    }

    /**
     * chain construction
     * @since 2024-06-30
     * TODO: WRITE MORE DOC
     */
    useIn<BP extends BaseSchema>(fn: CovariantFn<[field: FIELD], BP>): S.SLink<this, BP> {
        const linkConf: Field_link_config<this, BP> = { share: this, children: fn }
        return new SimpleSchema(Field_link<any, any>, linkConf)
    }

    /** wrap widget schema to list stuff */
    list(config: Omit<Field_list_config<this>, 'element'> = {}): S.SList<this> {
        return new SimpleSchema<Field_list<this>>(Field_list, {
            ...config,
            element: this,
        })
    }

    optional(startActive: boolean = false): S.SOptional<this> {
        return new SimpleSchema<Field_optional<this>>(Field_optional, {
            schema: this,
            startActive: startActive,
            label: this.config.label,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
    }

    /** clone the schema, and patch the cloned config */
    withConfig(config: Partial<FIELD['$Config']>): this {
        const mergedConfig = objectAssignTsEfficient_t_pt(this.config, config)
        const cloned = new SimpleSchema<FIELD>(this.FieldClass_UNSAFE, mergedConfig)
        // 🔴 Keep producers and reactions -> could probably be part of the ctor
        cloned.producers = this.producers
        cloned.reactions = this.reactions
        return cloned as this
    }
}
