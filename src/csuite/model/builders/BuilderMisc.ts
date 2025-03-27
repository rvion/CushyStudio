import { Field_color } from '../../fields/color/FieldColor'
import { Field_markdown, type Field_markdown_config } from '../../fields/markdown/FieldMarkdown'
import { Field_matrix, type Field_matrix_config } from '../../fields/matrix/FieldMatrix'
import { Field_number } from '../../fields/number/FieldNumber'
import { Field_seed, type Field_seed_config } from '../../fields/seed/FieldSeed'
import { Field_size, type Field_size_config } from '../../fields/size/FieldSize'
import { Field_string } from '../../fields/string/FieldString'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

export type BuilderMiscMixin = {
   size_(config?: Field_size['ҨConfig']): Z.Size
   size(config?: Field_size['ҨConfig']): Z.Size
   seed(config?: Field_seed['ҨConfig']): Z.Seed
   color(config?: Field_color['ҨConfig']): Z.Color
   stringColor(config?: Field_string['ҨConfig']): Z.String
   matrix(config: Field_matrix['ҨConfig']): Z.Matrix
   markdown(config: Field_markdown['ҨConfig'] | string): Z.Markdown
   header(config: Field_markdown['ҨConfig'] | string): Z.Markdown
   pixel(config?: Omit<Field_number['ҨConfig'], 'mode' | 'parse' | 'format'>): Z.Number
   // tuple: Tuple
}

// 💬 2025-02-14 rvion:
// why did the object get converted to a class ?
//  => because we want to be able to overload methods  inside; and I didn't find how to do it
// with object notation
const BuilderMiscImpl = (): BuilderMiscMixin =>
   defineSchemaBuilderMixin<BuilderMiscMixin>({
      size_(config: Field_size_config = {}): Z.Size {
         return CSchema.new(Field_size, config)
      },

      size(config: Field_size_config = {}): Z.Size {
         const def = config.default ?? {
            aspectRatio: '1:1',
            modelType: 'SD1.5 512',
            height: 512,
            width: 512,
         }
         return this.size_({ default: def, ...config })
      },

      seed(config: Field_seed_config = {}): Z.Seed {
         return CSchema.new(Field_seed, config)
      },

      color(config: Field_color['ҨConfig'] = {}): Z.Color {
         return CSchema.new(Field_color, config)
      },

      /**
       * legacy string-based `color` (based on `Field_string`)
       *
       * - value is string
       * - serial is plain string
       * - no specific validation
       *
       *
       * @deprecated
       * @see {@link color} for a better color field based on colorjs.io
       */
      stringColor(config: Field_string['ҨConfig'] = {}): Z.String {
         config.inputType ??= 'color'
         return CSchema.new(Field_string, config)
      },

      matrix(config: Field_matrix_config): Z.Matrix {
         config.default ??= []
         return CSchema.new(Field_matrix, config)
      },

      /** variants: `header` */
      markdown(config: Field_markdown_config | string): Z.Markdown {
         return CSchema.new(Field_markdown, typeof config === 'string' ? { markdown: config } : config)
      },

      /** [markdown variant]: inline=true, label=false */
      header(config: Field_markdown_config | string): Z.Markdown {
         return CSchema.new(
            Field_markdown,
            typeof config === 'string'
               ? { markdown: config, inHeader: true, label: false }
               : { inHeader: true, label: false, justifyLabel: false, ...config },
         )
      },

      pixel(config: Omit<Field_number['ҨConfig'], 'mode' | 'parse' | 'format'> = {}): Z.Number {
         return CSchema.new(Field_number, {
            mode: 'int',
            ...config,
            unit: 'px',
            suffix: 'px',
         })
      },

      // tuple: tuple,
   })

// prettier-ignore
// type Tuple = {
//    (): Z.Tuple<[]>
//    <T1 extends CSchema>(s1: T1): Z.Tuple<[T1]>
//    <T1 extends CSchema, T2 extends CSchema>(s1: T1, s2: T2): Z.Tuple<[T1, T2]>
//    <T1 extends CSchema, T2 extends CSchema, T3 extends CSchema>(s1: T1, s2: T2,s3: T3): Z.Tuple<[T1, T2, T3]>
//    <T1 extends CSchema, T2 extends CSchema, T3 extends CSchema, T4 extends CSchema>(s1: T1, s2: T2,s3: T3, s4: T4): Z.Tuple<[T1, T2, T3, T4]>
//    <T1 extends CSchema, T2 extends CSchema, T3 extends CSchema, T4 extends CSchema, T5 extends CSchema>(s1: T1, s2: T2,s3: T3, S4: T4, S5: T5): Z.Tuple<[T1, T2, T3, T4, T5]>
// }

// const tuple: Tuple = function tuple(...args: CSchema[]): Z.Tuple<CSchema[]> {
//    throw new Error('❌ Tuple implementation unfinished')
//    // return  CSchema.new(Field_string, config)
// }

export const BuilderMiscDescriptors: Record<string, PropertyDescriptor> =
   Object.getOwnPropertyDescriptors(BuilderMiscImpl())
