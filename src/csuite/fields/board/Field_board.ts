import type { IconName } from '../../icons/IconName'
import type { CSchema } from '../../model/CSchema'
import type { SimpleBuilder } from '../../simple/SimpleBuilder'
import type { SimpleShape$ } from '../core-prefabs/ShapeSchema'

/**
 * THIS FILE IS AN EXEMPLE OF A COMPOSITE FIELD WITH METHODS.
 * IT WILL BE IMPROVED AS COMPOSITE FIELDS API IS FINALIZED.
 */
import { computed } from 'mobx'

import { type SimpleShape, simpleShape$ } from '../core-prefabs/ShapeSchema'
import { Field_group, type MAGICFIELDS } from '../group/FieldGroup'
import { WidgetListExt_LineUI } from './WidgetListExt_LineUI'
import { WidgetListExtUI__Regional } from './WidgetListExtUI'

// ------------------------------------------------------------------------------------------------------------------------
export type Field_board_config<T extends CSchema> = {
   // container size
   width?: number /** default: 100 */
   height?: number /** default: 100 */
   min?: number
   max?: number
   step?: number

   // conatained item
   element: T | ((p: { ix: number; width: number; height: number }) => T)
   defaultLength?: number

   // item metadat
   initialPosition?: (size: { ix: number; width: number; height: number }) => Partial<SimpleShape>

   // misc
   icon?: IconName
}

// ------------------------------------------------------------------------------------------------------------------------
export type BoardDataSchema<SCHEMA extends CSchema> = {
   area: Z.Size
   items: Z.List<
      Z.Record<{
         shape: SimpleShape$
         value: SCHEMA
      }>
   >
}

// ------------------------------------------------------------------------------------------------------------------------
export interface Field_board<SCHEMA extends CSchema> extends MAGICFIELDS<BoardDataSchema<SCHEMA>> {}
export class Field_board<SCHEMA extends CSchema> extends Field_group<BoardDataSchema<SCHEMA>> {
   // built-in mechanism to inject schema-level opts without having to redefine the constructor
   declare $opts: Field_board_config<SCHEMA>
   get min(): number | undefined { return this.opts2.min } // prettier-ignore
   get max(): number | undefined { return this.opts2.max } // prettier-ignore
   get step(): number | undefined { return this.opts2.step } // prettier-ignore

   static schema = <SCHEMA extends CSchema>(
      b: SimpleBuilder,
      opts: Field_board_config<SCHEMA>,
   ): Z.Schema<Field_board<SCHEMA>> => {
      const width = opts.width ?? 100
      const height = opts.height ?? 100
      return b
         .fields<BoardDataSchema<SCHEMA>>(
            {
               area: b.size({ default: { width, height } }),
               items: b.list({
                  element: (ix: number) => {
                     const pos = opts.initialPosition?.({ ix, width, height }) ?? { x: 0, y: 0 }
                     return b.fields({
                        shape: simpleShape$(),
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
         .useClass(Field_board<SCHEMA>, opts)
         .withConfig({ uiui: { Body: WidgetListExtUI__Regional } })
   }

   @computed get width(): number {
      return this.fields.area.width
   }

   @computed get height(): number {
      return this.fields.area.width
   }

   // somehow this is enough to make the ui work for now
   DefaultHeaderUI: any = WidgetListExt_LineUI
}
