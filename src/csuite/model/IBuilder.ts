import type { Widget_group, Widget_group_config } from '../fields/group/WidgetGroup'
import type { Field } from './Field'
import type { ISchema } from './ISchema'

export interface IBuilder {
    _cache: { count: number }
    group(config: Widget_group_config<any>): ISchema<Widget_group<any>>
    linked<T extends Field>(field: T): ISchema<any>
    // SpecCtor: { new <T extends BaseField>(type: T['$Type'], config: T['$Config']): ISchema<T> }
}
