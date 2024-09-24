import type { CovariantFC } from '../csuite'
import type { Field } from '../csuite/model/Field'
import type { FieldConstructor } from '../csuite/model/FieldConstructor'
import type { Instanciable } from '../csuite/model/Instanciable'
import type { KnownModel_Name } from '../CUSHY'
import type { Requirements } from '../manager/REQUIREMENTS/Requirements'

import { createElement } from 'react'

import { isFieldOptional } from '../csuite/fields/WidgetUI.DI'
import { BaseSchema } from '../csuite/model/BaseSchema'
import { InstallRequirementsBtnUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'

export class CushySchema<out FIELD extends Field = Field> //
    extends BaseSchema<FIELD, CushySchemaᐸ_ᐳ>
    implements Instanciable<FIELD>
{
    constructor(
        /** field constructor (class or function, see FieldConstructor definition)  */
        fieldConstructor: FieldConstructor<FIELD>,
        config: FIELD['$Config'],
    ) {
        super(fieldConstructor, config, (...args) => new CushySchema(...args) as any)

        // early check, just in case, this should also be checked at instanciation time
        if (this.config.classToUse != null) {
            if (fieldConstructor.build !== 'new') throw new Error('impossible to use a custom class')
        }

        this.applySchemaExtensions()
    }

    LabelExtraUI: CovariantFC<{ field: FIELD }> = (p: { field: FIELD }) =>
        createElement(InstallRequirementsBtnUI, {
            active: isFieldOptional(p.field) ? (p.field.active ?? false) : true,
            requirements: this.requirements,
        })

    // #region Cushy Specific Schema APIs
    readonly requirements: Requirements[] = []

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
}

// TODO: make it work like in loco
// INTERNAL MODULE --------------------------------------
export interface CushySchemaᐸ_ᐳ extends HKT<Field> {
    type: CushySchema<this['__1']>

    String: X.XString
    Bool: X.XBool
    Number: X.XNumber

    Date: HKSimpleDateAlias
    DatePlain: HKSimpleDatePlainAlias
    DateTimeZoned: HKSimpleDateTimeZonedAlias

    Link: HKSimpleLinkAlias
    Shared: HKSimpleSharedAlias
    List: HKSimpleListAlias
    Optional: HKSimpleOptionalAlias

    OneOf: HKSimpleOneOfAlias
    OneOf_: HKSimpleOneOf_Alias

    Many: HKSimpleManyAlias
    Many_: HKSimpleMany_Alias

    Choices: HKSimpleChoicesAlias

    Group: HKSimpleGroupAlias

    Size: X.XSize
    Seed: X.XSeed
    Color: X.XColor
    Matrix: X.XMatrix
    Button: HKSimpleButtonAlias
    Markdown: X.XMarkdown
}

interface HKSimpleLinkAlias extends HKT<BaseSchema, BaseSchema> {
    type: X.XLink<this['__1'], this['__2']>
}

interface HKSimpleSharedAlias extends HKT<Field> {
    type: X.XShared<this['__1']>
}
interface HKSimpleListAlias extends HKT<BaseSchema> {
    type: X.XList<this['__1']>
}

interface HKSimpleOptionalAlias extends HKT<BaseSchema> {
    type: X.XOptional<this['__1']>
}

interface HKSimpleOneOfAlias extends HKT<unknown, SelectKey> {
    type: X.XSelectOne<this['__1'], this['__2']>
}
interface HKSimpleOneOf_Alias extends HKT<SelectKey> {
    type: X.XSelectOne_<this['__1']>
}

interface HKSimpleManyAlias extends HKT<unknown, SelectKey> {
    type: X.XSelectMany<this['__1'], this['__2']>
}
interface HKSimpleMany_Alias extends HKT<SelectKey> {
    type: X.XSelectMany_<this['__1']>
}

interface HKSimpleChoicesAlias extends HKT<SchemaDict> {
    type: X.XChoices<this['__1']>
}

interface HKSimpleGroupAlias extends HKT<SchemaDict> {
    type: X.XGroup<this['__1']>
}

interface HKSimpleDateAlias extends HKT<boolean> {
    type: X.XDate<this['__1']>
}
interface HKSimpleDatePlainAlias extends HKT<boolean> {
    type: X.XDatePlain<this['__1']>
}
interface HKSimpleDateTimeZonedAlias extends HKT<boolean> {
    type: X.XDateTimeZoned<this['__1']>
}

interface HKSimpleButtonAlias extends HKT<any> {
    type: X.XButton<this['__1']>
}
