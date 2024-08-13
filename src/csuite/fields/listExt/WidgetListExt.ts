import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { SimpleBuilder } from '../../simple/SimpleBuilder'
import type { SimpleShape } from './WidgetListExtTypes'

import { mkShapeSchema, ShapeSchema } from './ShapeSchema'

export type SListExt<SCHEMA extends BaseSchema> = BaseSchema<
    {
        min: number | undefined
        max: number | undefined
        step: number | undefined
        readonly width: number
        readonly height: number
    } & X.Group<{
        area: S.SSize
        items: S.SList<
            S.SGroup<{
                shape: ShapeSchema
                value: SCHEMA
            }>
        >
    }>
>

export type Field_listExt<SCHEMA extends BaseSchema> = SListExt<SCHEMA>['$Field']

export function listExt<SCHEMA extends BaseSchema>(
    //
    b: SimpleBuilder,
    opts: Field_listExt_config<SCHEMA>,
): SListExt<SCHEMA> {
    const { width, height } = opts
    return b
        .fields(
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
        .extend((self) => ({
            min: opts.min,
            max: opts.max,
            step: opts.step,
            get width(): number {
                return self.fields.area.width
            },
            get height(): number {
                return self.fields.area.width
            },
        }))
}

// CONFIG
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
