import type { CovariantFC, CovariantFn } from '../csuite'
import type { Field_link_config } from '../csuite/fields/link/FieldLink'
import type { Field } from '../csuite/model/Field'
import type { Repository } from '../csuite/model/Repository'
import type { Requirements } from '../manager/REQUIREMENTS/Requirements'

import { createElement, type ReactNode } from 'react'

import { Field_list, Field_list_config } from '../csuite/fields/list/FieldList'
import { Field_optional } from '../csuite/fields/optional/FieldOptional'
import { getFieldLinkClass, isFieldOptional } from '../csuite/fields/WidgetUI.DI'
import { BaseSchema } from '../csuite/model/BaseSchema'
import { objectAssignTsEfficient_t_pt } from '../csuite/utils/objectAssignTsEfficient'
import { potatoClone } from '../csuite/utils/potatoClone'
import { InstallRequirementsBtnUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'

export class Schema<out FIELD extends Field = Field> extends BaseSchema<FIELD> {
    FieldClass_UNSAFE: any

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
                schema: BaseSchema<FIELD>,
                serial?: FIELD['$Serial'],
            ): FIELD
        },
        public readonly config: FIELD['$Config'],
    ) {
        super()
        this.FieldClass_UNSAFE = FieldClass
        this.applySchemaExtensions()
        // makeObservable(this, {
        //     config: true,
        //     FieldClass_UNSAFE: false,
        // })
    }

    LabelExtraUI: CovariantFC<{ field: FIELD }> = (p: { field: FIELD }) =>
        createElement(InstallRequirementsBtnUI, {
            active: isFieldOptional(p.field) ? p.field.serial.active : true,
            requirements: this.requirements,
        })

    // Requirements (CushySpecifc)
    readonly requirements: Requirements[] = []

    addRequirements(requirements: Maybe<Requirements | Requirements[]>): this {
        if (requirements == null) return this
        if (Array.isArray(requirements)) this.requirements.push(...requirements)
        else this.requirements.push(requirements)
        // this.🐌
        return this
    }

    useIn<BP extends BaseSchema>(
        /** function that dynamically return a new child schema
         * that depends on the instance that will be created by this schema
         */
        fn: CovariantFn<[field: FIELD], BP>,
    ): X.XLink<this, BP> {
        const FieldLink = getFieldLinkClass()
        const linkConf: Field_link_config<this, BP> = { share: this, children: fn }
        return new Schema(FieldLink, linkConf)
    }

    /** wrap widget schema to list stuff */
    list(config: Omit<Field_list_config<any>, 'element'> = {}): X.XList<this> {
        return new Schema<Field_list<this>>(Field_list, {
            ...config,
            element: this,
        })
    }

    /** clone the schema, and patch the cloned config */
    withConfig(config: Partial<FIELD['$Config']>): this {
        const mergedConfig = objectAssignTsEfficient_t_pt(potatoClone(this.config), config)
        const cloned = new Schema<FIELD>(this.FieldClass_UNSAFE, mergedConfig)
        return cloned as this

        // 2024-07-17YOLO🦀🦊 dont' rewrite this here
    }

    optional(startActive: boolean = false): X.XOptional<this> {
        return new Schema<Field_optional<this>>(Field_optional, {
            schema: this,
            startActive: startActive,
            label: this.config.label,
            // requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
    }
}
