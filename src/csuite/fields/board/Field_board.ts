/**
 * THIS FILE IS AN EXEMPLE OF A COMPOSITE FIELD WITH METHODS.
 * IT WILL BE IMPROVED AS COMPOSITE FIELDS API IS FINALIZED.
 */
import type { IconName } from '../../icons/icons'
import type { CSchema } from '../../model/CSchema'
import type { Field, FieldCtorProps } from '../../model/Field'
import type { FieldConfig } from '../../model/FieldConfig'
import type { SchemaDict } from '../../model/SchemaDict'
import type { SimpleBuilder } from '../../simple/SimpleBuilder'
import type { SimpleShape$ } from '../core-prefabs/ShapeSchema'

import { type SimpleShape, simpleShape$ } from '../core-prefabs/ShapeSchema'
import { Field_group, type MAGICFIELDS } from '../group/FieldGroup'
import { WidgetListExt_LineUI } from './WidgetListExt_LineUI'
import { WidgetListExtUI__Regional } from './WidgetListExtUI'

// #region Config
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

export type BoardDataSchema<SCHEMA extends CSchema> = Z.SGroup<{
   area: Z.SSize
   items: Z.SList<
      Z.SGroup<
         Assume<
            {
               shape: SimpleShape$
               value: SCHEMA
            },
            SchemaDict
         >
      >
   >
}>

export const boardDataSchema = <SCHEMA extends CSchema>(
   //
   b: SimpleBuilder,
   opts: Field_board_config<SCHEMA>,
): BoardDataSchema<SCHEMA> => {
   const width = opts.width ?? 100
   const height = opts.height ?? 100
   return b.fields(
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
}

export interface RV1<
   //
   TYPES extends Field_group<any>,
   NEWCLASS extends Field,
> {
   // config need to be based on the new field for stuff like `body`
   $config: FieldConfig<{/* ... place whatever here */}, RV1<TYPES, NEWCLASS>> // prettier-ignore
   $field: NEWCLASS

   // 👇 UNCHANGED
   $type: 'group' // type is unchanged
   $serial: TYPES['$serial']
   $value: TYPES['$value']
   $unchecked: TYPES['$unchecked']
   $child: TYPES['$child']
   $Sub: TYPES['$Sub']
}

// export type ListExtFields<SCHEMA extends CSchema> =
// 🔴 ping @globi: Why assume here

// export interface Field_board<SCHEMA extends CSchema> //
//     extends RV1<BoardDataSchema<SCHEMA>['$reflect'], any> {}
// type K = BoardDataSchema['']

//🟢> type MakeItWork<SCHEMA extends CSchema> = //
//🟢>     RV1<BoardDataSchema<SCHEMA>['$reflect'], Field_board<SCHEMA>> & //
//🟢>         MAGICFIELDS<BoardDataSchema<SCHEMA>['$reflect']>
//🟢>
//🟢> export interface Field_board<SCHEMA extends CSchema> //
//🟢>     extends MakeItWork<BoardDataSchema<SCHEMA>> {}
//🟢>

export interface Field_board<SCHEMA extends CSchema>
   extends MAGICFIELDS<BoardDataSchema<SCHEMA>['$reflect']> {}
export class Field_board<SCHEMA extends CSchema> extends Field_group<BoardDataSchema<SCHEMA>['$reflect']> {
   $config!: FieldConfig<{/* ... place whatever here */}, RV1<BoardDataSchema<SCHEMA>['$reflect'], Field_board<SCHEMA>>> // prettier-ignore
   $field!: Field_board<SCHEMA>
   // $reflect: RV1<SCHEMA, NEWCLASS>

   constructor(opts: Field_board_config<SCHEMA>, ...args: FieldCtorProps) {
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

   // somehow this is enough to make the ui work for now
   DefaultHeaderUI: any = WidgetListExt_LineUI

   // #region Composite Shema
   static getSchema<SCHEMA extends CSchema>(
      //
      b: SimpleBuilder,
      opts: Field_board_config<SCHEMA>,
   ): CSchema<Field_board<SCHEMA>> {
      return boardDataSchema(b, opts) //
         .useBuilder((...args: FieldCtorProps) => new Field_board<SCHEMA>(opts, ...args))
         .withConfig({ ui: { Body: WidgetListExtUI__Regional } })
   }
}
