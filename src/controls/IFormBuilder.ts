import type { Form } from './Form'
import type { ISpec } from './ISpec'
import type { IWidget } from './IWidget'
import type { Widget_group, Widget_group_config } from './widgets/group/WidgetGroup'
import type { Widget_shared } from './widgets/shared/WidgetShared'

export interface IFormBuilder {
    _cache: { count: number }
    _HYDRATE: <T extends ISpec<any>>(
        //
        self: IWidget | null,
        spec: T,
        serial: any | null,
    ) => T['$Widget']
    form: Form<any, any>
    // optional: <const T extends ISpec<IWidget<$WidgetTypes>>>(p: Widget_optional_config<T>) => ISpec<Widget_optional<T>>
    shared: <W extends ISpec<any>>(key: string, spec: W) => Widget_shared<W>
    group: (config: Widget_group_config<any>) => ISpec<Widget_group<any>>
    SpecCtor: { new <T extends IWidget>(type: T['$Type'], config: T['$Config']): ISpec<T> }
}
