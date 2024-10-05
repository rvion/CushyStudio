/**
 * THIS FILE IS AN EXEMPLE OF A COMPOSITE FIELD WITH METHODS.
 * IT WILL BE IMPROVED AS COMPOSITE FIELDS API IS FINALIZED.
 */
import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldCtorProps } from '../../model/Field'
import type { SchemaDict } from '../../model/SchemaDict'
import type { SimpleBuilder } from '../../simple/SimpleBuilder'
import type { SimpleSchema } from '../../simple/SimpleSchema'
import type { SimpleShape } from './WidgetListExtTypes'

import { Field_group } from '../group/FieldGroup'
import { mkShapeSchema, ShapeSchema } from './ShapeSchema'

// #region Config
export type Field_listExt_config<T extends BaseSchema> = {
    // container size
    width: number /** default: 100 */
    height: number /** default: 100 */
    min?: number
    max?: number
    step?: number

    // conatained item
    element: T | ((p: { ix: number; width: number; height: number }) => T)
    defaultLength?: number

    // item metadat
    initialPosition: (size: { ix: number; width: number; height: number }) => Partial<SimpleShape>

    // misc
    icon?: IconName
}

export type Field_listExt<SCHEMA extends BaseSchema> = ListExt<SCHEMA> // ['$Field']
export type ListExtData<SCHEMA extends BaseSchema> = S.SGroup<ListExtFields<SCHEMA>>
export type ListExtFields<SCHEMA extends BaseSchema> = {
    area: S.SSize
    items: S.SList<
        S.SGroup<
            Assume<
                {
                    shape: ShapeSchema
                    value: SCHEMA
                },
                SchemaDict
            >
        >
    >
}
// 🔴 ping @globi: Why assume here

export class ListExt<SCHEMA extends BaseSchema> //
    extends Field_group<ListExtFields<SCHEMA>>
{
    constructor(opts: Field_listExt_config<SCHEMA>, ...args: FieldCtorProps) {
        super(...args)
        this.min = opts.min
        this.max = opts.max
        this.step = opts.step
        this.autoExtendObservable()
    }

    min?: number
    max?: number
    step?: number

    get width(): number {
        return this.fields.area.width
    }

    get height(): number {
        return this.fields.area.width
    }

    // #region Composite Shema
    static getSchema<SCHEMA extends BaseSchema>(
        b: SimpleBuilder,
        opts: Field_listExt_config<SCHEMA>,
    ): SimpleSchema<ListExt<SCHEMA>> {
        return ListExt.getDataSchema(b, opts).useClass(ListExt)
    }
    static getDataSchema<SCHEMA extends BaseSchema>(
        //
        b: SimpleBuilder,
        opts: Field_listExt_config<SCHEMA>,
    ): SimpleSchema<ListExtData<SCHEMA>['$Field']> {
        const { width, height } = opts
        return b.fields(
            {
                area: b.size({ default: { width, height } }),
                items: b.list({
                    element: (ix: number) => {
                        const pos = opts.initialPosition({ ix, width, height })
                        return b.fields({
                            shape: mkShapeSchema(b),
                            value:
                                typeof opts.element === 'function' //
                                    ? opts.element({
                                          ix,
                                          height: pos.height ?? 100,
                                          width: pos.width ?? 100,
                                      })
                                    : opts.element,
                        })
                    },
                    min: opts.defaultLength,
                }),
            },
            { icon: opts.icon },
        )
    }
}

// export function listExt<SCHEMA extends BaseSchema>(
//     //
//     b: SimpleBuilder,
//     opts: Field_listExt_config<SCHEMA>,
// ): SListExt<SCHEMA> {
//     const { width, height } = opts
//     return b
//         .fields(
//             {
//                 area: b.size({ default: { width, height } }),
//                 items: b.list({
//                     element: (ix: number) => {
//                         const pos = opts.initialPosition({ ix, width, height })
//                         return b.fields({
//                             shape: mkShapeSchema(b),
//                             value:
//                                 typeof opts.element === 'function' //
//                                     ? opts.element({
//                                           ix,
//                                           height: pos.height ?? 100,
//                                           width: pos.width ?? 100,
//                                       })
//                                     : opts.element,
//                         })
//                     },
//                     min: opts.defaultLength,
//                 }),
//             },
//             { icon: opts.icon },
//         )
//         .useMixin((self) => ({
//             min: opts.min,
//             max: opts.max,
//             step: opts.step,
//             get width(): number {
//                 return self.fields.area.width
//             },
//             get height(): number {
//                 return self.fields.area.width
//             },
//         }))
// }

// export type SListExt<SCHEMA extends BaseSchema> = BaseSchema<
//     {
//         min: number | undefined
//         max: number | undefined
//         step: number | undefined
//         readonly width: number
//         readonly height: number
//     } & X.Group<{
//         area: S.SSize
//         items: S.SList<
//             S.SGroup<{
//                 shape: ShapeSchema
//                 value: SCHEMA
//             }>
//         >
//     }>
// >
