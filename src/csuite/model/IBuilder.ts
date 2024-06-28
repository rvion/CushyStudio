import type { Widget_group, Widget_group_config } from '../fields/group/WidgetGroup'
import type { BaseField } from './BaseField'
import type { Entity } from './Entity'
import type { ISchema } from './ISchema'

export interface IBuilder {
    _cache: { count: number }
    _HYDRATE: <T extends ISchema<any>>(
        //
        model: Entity<any>,
        self: BaseField | null,
        spec: T,
        serial: any | null,
    ) => T['$Field']
    // optional: <const T extends ISpec<IWidget<$FieldTypes>>>(p: Widget_optional_config<T>) => ISpec<Widget_optional<T>>
    // shared: <W extends ISchema<any>>(key: string, spec: W) => Widget_shared<W>
    group: (config: Widget_group_config<any>) => ISchema<Widget_group<any>>
    SpecCtor: { new <T extends BaseField>(type: T['$Type'], config: T['$Config']): ISchema<T> }
}
