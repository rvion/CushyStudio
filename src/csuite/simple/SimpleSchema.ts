import type { Field_link, Field_link_config } from '../fields/link/FieldLink'
import type { Field_list, Field_list_config } from '../fields/list/FieldList'
import type { Field_optional } from '../fields/optional/FieldOptional'
import type { Field } from '../model/Field'
import type { FieldExtension, SchemaExtension } from '../model/FieldConfig'
import type { FieldConstructor } from '../model/FieldConstructor'
import type { Instanciable } from '../model/Instanciable'
import type { CovariantFn } from '../variance/BivariantHack'

import { makeObservable } from 'mobx'

import { getFieldLinkClass, getFieldListClass, getFieldOptionalClass } from '../fields/WidgetUI.DI'
import { BaseSchema } from '../model/BaseSchema'
import { objectAssignTsEfficient_t_pt } from '../utils/objectAssignTsEfficient'
import { potatoClone } from '../utils/potatoClone'

export class SimpleSchema<out FIELD extends Field = Field> extends BaseSchema<FIELD> implements Instanciable<FIELD> {
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
        makeObservable(this, {
            config: true,
            fieldConstructor: false,
        })
    }

    static NEW<F extends Field>(
        FieldClass: Extract<FieldConstructor<F>, { build: 'new' }>,
        config: F['$Config'],
    ): SimpleSchema<F> {
        return new SimpleSchema<F>(FieldClass, config)
    }

    extend_TEMP<EXTS extends FieldExtension<FIELD>>(
        //
        extensions: EXTS,
    ): SimpleSchema<ReturnType<EXTS> & FIELD /* , EXTRA */> {
        const x: SimpleSchema<FIELD /* , EXTRA */> = this.withConfig({
            customFieldProperties: [...(this.config.customFieldProperties ?? []), extensions],
        })

        return x as any as SimpleSchema<ReturnType<EXTS> & FIELD /* , EXTRA */>
    }

    extendSchema<EXTS extends SchemaExtension<this>>(extensions: EXTS): this & ReturnType<EXTS> {
        const withoutNewExts: SimpleSchema<FIELD> = this.withConfig({
            customSchemaProperties: [
                //
                ...(this.config.customSchemaProperties ?? []),
                extensions,
            ],
        })
        return withoutNewExts as this & ReturnType<EXTS>
    }

    /**
     * chain construction
     * @since 2024-06-30
     * TODO: WRITE MORE DOC
     */
    useIn<BP extends BaseSchema>(fn: CovariantFn<[field: FIELD], BP>): S.SLink<this, BP> {
        const FieldLinkClass = getFieldLinkClass()
        const linkConf: Field_link_config<this, BP> = { share: this, children: fn }
        return SimpleSchema.NEW<Field_link<this, BP>>(FieldLinkClass, linkConf)
    }

    /** wrap field schema to list stuff */
    list(config: Omit<Field_list_config<this>, 'element'> = {}): S.SList<this> {
        const FieldListClass = getFieldListClass()
        return SimpleSchema.NEW<Field_list<this>>(FieldListClass, {
            ...config,
            element: this,
        })
    }

    /** make field optional (A => Maybe<A>) */
    optional(startActive: boolean = false): S.SOptional<this> {
        const FieldOptionalClass = getFieldOptionalClass()
        return SimpleSchema.NEW<Field_optional<this>>(FieldOptionalClass, {
            schema: this,
            startActive: startActive,
            label: this.config.label,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })
    }

    /** clone the schema, and patch the cloned config */
    withConfig(config: Partial<FIELD['$Config']>): this /* & EXTRA */ {
        const mergedConfig = objectAssignTsEfficient_t_pt(potatoClone(this.config), config)
        const cloned = new SimpleSchema<FIELD>(
            //
            this.fieldConstructor,
            mergedConfig,
        )
        return cloned as this
    }
}
