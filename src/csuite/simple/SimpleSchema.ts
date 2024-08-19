import type { Field_link, Field_link_config } from '../fields/link/FieldLink'
import type { Field_list, Field_list_config } from '../fields/list/FieldList'
import type { Field_optional } from '../fields/optional/FieldOptional'
import type { Field } from '../model/Field'
import type { FieldExtension, SchemaExtension } from '../model/FieldConfig'
import type { Instanciable } from '../model/Instanciable'
import type { Repository } from '../model/Repository'
import type { CovariantFn } from '../variance/BivariantHack'

import { makeObservable } from 'mobx'

import { getFieldLinkClass, getFieldListClass, getFieldOptionalClass } from '../fields/WidgetUI.DI'
import { BaseSchema } from '../model/BaseSchema'
import { objectAssignTsEfficient_t_pt } from '../utils/objectAssignTsEfficient'
import { potatoClone } from '../utils/potatoClone'

export class SimpleSchema<out FIELD extends Field = Field> extends BaseSchema<FIELD> implements Instanciable<FIELD> {
    constructor(
        public readonly type: FIELD['$Type'],
        public buildField: CovariantFn<
            [
                //
                repo: Repository,
                root: Field | null,
                parent: Field | null,
                spec: SimpleSchema<FIELD>,
                serial?: FIELD['$Serial'],
            ],
            FIELD
        >,
        public readonly config: FIELD['$Config'],
    ) {
        super()
        makeObservable(this, {
            config: true,
            buildField: false, // 🔴 now useless?
        })
        super.applySchemaExtensions()
    }

    static NEW<F extends Field>(
        FieldClass: {
            readonly type: F['$Type']
            new (
                //
                repo: Repository,
                root: Field | null,
                parent: Field | null,
                spec: BaseSchema<F>,
                serial?: F['$Serial'],
            ): F
        },
        config: F['$Config'],
    ): SimpleSchema<F> {
        return new SimpleSchema<F>(
            FieldClass.type,
            (repo, root, parent, spec, serial) => new FieldClass(repo, root, parent, spec, serial),
            config,
        )
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
        const cloned = new SimpleSchema<FIELD>(this.type, (...args) => this.buildField(...args), mergedConfig)
        return cloned as this
    }
}
