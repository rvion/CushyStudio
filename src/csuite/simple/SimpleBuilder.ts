import type { BaseSchema } from '../model/BaseSchema'

import { makeAutoObservable } from 'mobx'

import { Field_list, type Field_list_config } from '../fields/list/FieldList'
import { Field_optional, type Field_optional_config } from '../fields/optional/FieldOptional'
import { BuilderBool } from '../model/builders/BuilderBoolTypes'
import { BuilderChoices } from '../model/builders/BuilderChoices'
import { BuilderDate } from '../model/builders/BuilderDateTypes'
import { BuilderGroup } from '../model/builders/BuilderGroup'
import { BuilderMisc } from '../model/builders/BuilderMisc'
import { BuilderNumber } from '../model/builders/BuilderNumberTypes'
import { BuilderSelectMany } from '../model/builders/BuilderSelectMany'
import { BuilderSelectOne } from '../model/builders/BuilderSelectOne'
import { BuilderShared } from '../model/builders/BuilderShared'
import { BuilderString } from '../model/builders/BuilderStringTypes'
import { SimpleSchema, type SimpleSchemaᐸ_ᐳ } from './SimpleSchema'
import { combine } from 'src/inbox/edsl/helpers'

export interface SimpleBuilder //
    extends BuilderString<SimpleSchemaᐸ_ᐳ>,
        BuilderBool<SimpleSchemaᐸ_ᐳ>,
        BuilderNumber<SimpleSchemaᐸ_ᐳ>,
        BuilderDate<SimpleSchemaᐸ_ᐳ>,
        BuilderMisc<SimpleSchemaᐸ_ᐳ>,
        BuilderSelectOne<SimpleSchemaᐸ_ᐳ>,
        BuilderSelectMany<SimpleSchemaᐸ_ᐳ>,
        BuilderChoices<SimpleSchemaᐸ_ᐳ>,
        BuilderGroup<SimpleSchemaᐸ_ᐳ>,
        BuilderShared<SimpleSchemaᐸ_ᐳ> {}

export class SimpleBuilder /* implements IBuilder<Schemaᐸ_ᐳ> */ {
    constructor() {
        combine<any /* ts perf maybe ? */>(
            //
            this,
            BuilderString.fromSchemaClass(SimpleSchema),
            BuilderBool.fromSchemaClass(SimpleSchema),
            BuilderNumber.fromSchemaClass(SimpleSchema),
            BuilderDate.fromSchemaClass(SimpleSchema),
            BuilderMisc.fromSchemaClass(SimpleSchema),
            BuilderSelectOne.fromSchemaClass(SimpleSchema),
            BuilderSelectMany.fromSchemaClass(SimpleSchema),
            BuilderChoices.fromSchemaClass(SimpleSchema),
            BuilderGroup.fromSchemaClass(SimpleSchema),
            BuilderShared.fromSchemaClass(SimpleSchema),
        )

        makeAutoObservable(this, {})
    }

    /** list with a default */
    list<T extends BaseSchema>(config: Field_list_config<T>): S.SList<T> {
        return this.list_({
            defaultLength: config.min ?? 0,
            ...config,
        })
    }

    /** list */
    list_<T extends BaseSchema>(config: Field_list_config<T>): S.SList<T> {
        return new SimpleSchema<Field_list<T>>(Field_list, config)
    }

    // optional wrappers
    optional<T extends BaseSchema>(p: Field_optional_config<T>): S.SOptional<T> {
        return new SimpleSchema<Field_optional<T>>(Field_optional, p)
    }
}
