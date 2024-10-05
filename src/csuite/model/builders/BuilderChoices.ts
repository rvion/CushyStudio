import type { FieldTypes } from '../$FieldTypes'
import type { SchemaDict } from '../SchemaDict'

import { Field_choices, type Field_choices_config } from '../../fields/choices/FieldChoices'
import { bang } from '../../utils/bang'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
    Choices: HKT
}

export class BuilderChoices<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderChoices)

    choice<T extends SchemaDict>(
        //
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<T>, 'multi' | 'items'> = {},
    ): Apply<Schemaᐸ_ᐳ['Choices'], T> {
        return this.choice_(items, { default: bang(Object.keys(items)[0]), ...config })
    }

    choices<T extends SchemaDict>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
    ): Apply<Schemaᐸ_ᐳ['Choices'], T> {
        return this.choices_(items, { default: {}, ...config })
    }

    /** simple choice alternative api */
    tabs<T extends SchemaDict>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<T>, 'multi' | 'items'> = {},
    ): Apply<Schemaᐸ_ᐳ['Choices'], T> {
        return this.choices_(items, { default: bang(Object.keys(items)[0]), appearance: 'tab', ...config })
    }

    // #region without defaults

    /** generic choice field, without any default */
    choice_<T extends SchemaDict>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
    ): Apply<Schemaᐸ_ᐳ['Choices'], T> {
        if ('items' in items) {
            console.warn(`[🔴] wrong choice`)
        }
        const finalConfig: Field_choices_config<T> = { items, multi: false, ...config }
        return this.buildSchema(Field_choices<T>, finalConfig)
    }

    /** generic choice field, without any default */
    choices_<T extends SchemaDict>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
    ): Apply<Schemaᐸ_ᐳ['Choices'], T> {
        const finalConfig: Field_choices_config<T> = { items, multi: true, ...config }
        return this.buildSchema(Field_choices<T>, finalConfig)
    }

    // #region legacy
    // choice_v0<T extends SchemaDict>(config: Omit<Field_choices_config<T>, 'multi'>): S.SChoices<T> {
    //     return new SimpleSchema<Field_choices<T>>(Field_choices<any>, { multi: false, ...config })
    // }

    // choices_v0<T extends SchemaDict>(config: Omit<Field_choices_config<T>, 'multi'>): S.SChoices<T> {
    //     return new SimpleSchema<Field_choices<T>>(Field_choices<any>, { multi: true, ...config })
    // }
}
