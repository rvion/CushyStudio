import type { Widget_enum_config, Widget_enum } from './widgets/enum/WidgetEnum'

export type EnumBuilder = {
    [K in keyof Requirable]: (
        config: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'>,
    ) => Widget_enum<Requirable[K]['$Value']>
}

export type EnumBuilderOpt = {
    [K in keyof Requirable]: (
        config: Omit<Widget_enum_config<Requirable[K]['$Value']>, 'enumName'> & { startActive?: boolean },
    ) => Widget_enum<Requirable[K]['$Value']>
}
