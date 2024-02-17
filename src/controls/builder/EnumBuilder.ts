/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { FormBuilder } from '../FormBuilder'

import { Widget_enum, Widget_enum_config } from '../widgets/enum/WidgetEnum'

export type IEnumBuilder = {
    [K in keyof Requirable]: (
        config: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'>,
    ) => Widget_enum<Requirable[K]['$Value']>
}

export type IEnumBuilderOpt = {
    [K in keyof Requirable]: (
        config: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'> & { startActive?: boolean },
    ) => Widget_enum<Requirable[K]['$Value']>
}

export interface EnumBuilder extends IEnumBuilder {}
export class EnumBuilder {
    constructor(public form: FormBuilder) {
        const schema = cushy.schema
        for (const enumName of schema.knownEnumsByName.keys()) {
            Object.defineProperty(this, enumName, {
                value: (config: any) => new Widget_enum(form, { ...config, enumName }),
            })
        }
    }
}

export interface EnumBuilderOpt extends IEnumBuilderOpt {}
export class EnumBuilderOpt {
    constructor(public form: FormBuilder) {
        const schema = cushy.schema
        for (const enumName of schema.knownEnumsByName.keys()) {
            Object.defineProperty(this, enumName, {
                value: (config: any) =>
                    form.optional({
                        label: config.label,
                        startActive: config.startActive,
                        widget: () => new Widget_enum(form, { ...config, enumName }),
                    }),
            })
        }
    }
}
