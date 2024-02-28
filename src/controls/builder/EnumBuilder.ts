/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { Form } from '../Form'

import { Spec } from '../Spec'
import { Widget_enum, Widget_enum_config } from '../widgets/enum/WidgetEnum'

export type IEnumBuilder = {
    [K in keyof Requirable]: (
        config?: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'>,
    ) => Spec<Widget_enum<Requirable[K]['$Value']>>
}

export type IEnumBuilderOpt = {
    [K in keyof Requirable]: (
        config?: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'> & { startActive?: boolean },
    ) => Spec<Widget_enum<Requirable[K]['$Value']>>
}

export interface EnumBuilder extends IEnumBuilder {}
export class EnumBuilder {
    constructor(public form: Form<any>) {
        const schema = cushy.schema
        for (const enumName of schema.knownEnumsByName.keys()) {
            Object.defineProperty(this, enumName, {
                value: (config: any = {}) => new Spec('enum', /* form, */ { ...config, enumName }),
            })
        }
    }
}

export interface EnumBuilderOpt extends IEnumBuilderOpt {}
export class EnumBuilderOpt {
    constructor(public form: Form<any>) {
        const schema = cushy.schema
        for (const enumName of schema.knownEnumsByName.keys()) {
            Object.defineProperty(this, enumName, {
                value: (config: any = {}) =>
                    form.builder.optional({
                        label: config.label,
                        startActive: config.startActive,
                        widget: new Spec('enum', /* form, */ { ...config, enumName }),
                    }),
            })
        }
    }
}
