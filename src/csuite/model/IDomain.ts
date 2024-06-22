import type { Widget_group, Widget_group_config } from '../fields/group/WidgetGroup'
import type { Widget_shared } from '../fields/shared/WidgetShared'
import type { BaseField } from './BaseField'
import type { IBlueprint } from './IBlueprint'
import type { Model } from './Model'

export interface Domain {
    _cache: { count: number }
    _HYDRATE: <T extends IBlueprint<any>>(
        //
        self: BaseField | null,
        spec: T,
        serial: any | null,
    ) => T['$Field']
    form: Model
    // optional: <const T extends ISpec<IWidget<$FieldTypes>>>(p: Widget_optional_config<T>) => ISpec<Widget_optional<T>>
    shared: <W extends IBlueprint<any>>(key: string, spec: W) => Widget_shared<W>
    group: (config: Widget_group_config<any>) => IBlueprint<Widget_group<any>>
    SpecCtor: { new <T extends BaseField>(type: T['$Type'], config: T['$Config']): IBlueprint<T> }
}
