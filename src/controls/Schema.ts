import type { CovariantFC, CovariantFn } from '../csuite'
import type { Field_link_config } from '../csuite/fields/link/FieldLink'
import type { Field } from '../csuite/model/Field'
import type { FieldConstructor } from '../csuite/model/FieldConstructor'
import type { KnownModel_Name } from '../CUSHY'
import type { Requirements } from '../manager/REQUIREMENTS/Requirements'

import { createElement } from 'react'

import { Field_list, Field_list_config } from '../csuite/fields/list/FieldList'
import { Field_optional } from '../csuite/fields/optional/FieldOptional'
import { getFieldLinkClass, isFieldOptional } from '../csuite/fields/WidgetUI.DI'
import { BaseSchema } from '../csuite/model/BaseSchema'
import { objectAssignTsEfficient_t_pt } from '../csuite/utils/objectAssignTsEfficient'
import { potatoClone } from '../csuite/utils/potatoClone'
import { InstallRequirementsBtnUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'

export class Schema<out FIELD extends Field = Field> extends BaseSchema<FIELD> {
    constructor(
        public fieldConstructor: FieldConstructor<FIELD>,
        public readonly config: FIELD['$Config'],
    ) {
        super()

        // early check, just in case, this should also be checked at instanciation time
        if (this.config.classToUse != null) {
            if (fieldConstructor.build !== 'new') throw new Error('impossible to use a custom class')
        }

        this.applySchemaExtensions()

        // 💬 2024-08-20 rvion:
        // | I don't need that observable for now.
        // | `SimpleSchema` have it observable to make sure it will work if need be
        //
        // ⏸️ makeObservable(this, {
        // ⏸️     config: true,
        // ⏸️     FieldClass_UNSAFE: false,
        // ⏸️ })
    }

    LabelExtraUI: CovariantFC<{ field: FIELD }> = (p: { field: FIELD }) =>
        createElement(InstallRequirementsBtnUI, {
            active: isFieldOptional(p.field) ? p.field.serial.active : true,
            requirements: this.requirements,
        })

    // Requirements (CushySpecifc)
    readonly requirements: Requirements[] = []

    // 💬 2024-08-18 rvion:
    // | I'd like to preserve the typedoc in the autocompletion panel,
    // | mostly to know the size and descriptions of the models I'm
    // | adding to the recommendation sections;
    // | For now, it's not working, and It may require some more codegen
    // 💡 requireModel = new Proxy(
    // 💡     {},
    // 💡     {
    // 💡         get: (target, prop: any): this => {
    // 💡             if (typeof prop === 'string') this.addRequirementOnComfyManagerModel(prop as KnownModel_Name)
    // 💡             return this
    // 💡         },
    // 💡     },
    // 💡 ) as { [modelName in KnownModel_Name]: this }

    addRequirementOnComfyManagerModel(modelName: KnownModel_Name): this {
        this.addRequirements({ type: 'modelInManager', modelName, optional: true })
        return this
    }
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
        const cloned = new Schema<FIELD>(this.fieldConstructor, mergedConfig)
        return cloned as this
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
