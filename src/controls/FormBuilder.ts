import type { SchemaL } from 'src/models/Schema'
import * as W from './Widget'
import { exhaust } from 'src/utils/ComfyUtils'
import { makeAutoObservable } from 'mobx'

// prettier-ignore
export class FormBuilder {
    _cache :{ count:number } = { count:0 }
    constructor(public schema: SchemaL) {
        makeAutoObservable(this)
    }

    // 🔴 untyped internals there
    HYDRATE =(type: W.Widget['type'], input: any, serial?: any ): any => {
        if (type === 'bool')               return new W.Widget_bool               (this, this.schema, input, serial)
        if (type === 'str')                return new W.Widget_str                (this, this.schema, input, serial)
        if (type === 'strOpt')             return new W.Widget_strOpt             (this, this.schema, input, serial)
        if (type === 'int')                return new W.Widget_int                (this, this.schema, input, serial)
        if (type === 'seed')               return new W.Widget_seed               (this, this.schema, input, serial)
        if (type === 'intOpt')             return new W.Widget_intOpt             (this, this.schema, input, serial)
        if (type === 'float')              return new W.Widget_float              (this, this.schema, input, serial)
        if (type === 'floatOpt')           return new W.Widget_floatOpt           (this, this.schema, input, serial)
        if (type === 'matrix')             return new W.Widget_matrix             (this, this.schema, input, serial)
        if (type === 'prompt')             return new W.Widget_prompt             (this, this.schema, input, serial)
        if (type === 'promptOpt')          return new W.Widget_promptOpt          (this, this.schema, input, serial)
        if (type === 'loras')              return new W.Widget_loras              (this, this.schema, input, serial)
        if (type === 'image')              return new W.Widget_image              (this, this.schema, input, serial)
        if (type === 'imageOpt')           return new W.Widget_imageOpt           (this, this.schema, input, serial)
        if (type === 'selectOneOrCustom')  return new W.Widget_selectOneOrCustom  (this, this.schema, input, serial)
        if (type === 'selectManyOrCustom') return new W.Widget_selectManyOrCustom (this, this.schema, input, serial)
        if (type === 'enum')               return new W.Widget_enum               (this, this.schema, input, serial)
        if (type === 'enumOpt')            return new W.Widget_enumOpt            (this, this.schema, input, serial)
        if (type === 'list')               return new W.Widget_list               (this, this.schema, input, serial)
        if (type === 'groupOpt')           return new W.Widget_groupOpt           (this, this.schema, input, serial)
        if (type === 'group')              return new W.Widget_group              (this, this.schema, input, serial)
        if (type === 'selectOne')          return new W.Widget_selectOne          (this, this.schema, input, serial)
        if (type === 'selectMany')         return new W.Widget_selectMany         (this, this.schema, input, serial)
        if (type === 'size')               return new W.Widget_size               (this, this.schema, input, serial)
        if (type === 'color')              return new W.Widget_color              (this, this.schema, input, serial)
        if (type === 'choice')             return new W.Widget_choice             (this, this.schema, input, serial)
        if (type === 'choices')            return new W.Widget_choices            (this, this.schema, input, serial)
        if (type === 'markdown')           return new W.Widget_markdown           (this, this.schema, input, serial)
        console.log(`🔴 unknown type ${type}`)
        exhaust(type)
    }


    // autoUI          =                                                  (p: Widget_str_input                  , serial?: Widget_str_serial                  ) => new Widget_str                   (this, this.schema, p, serial)
    string             =                                                  (p: W.Widget_str_input                , serial?: W.Widget_str_serial                ) => new W.Widget_str                 (this, this.schema, p, serial)
    color              =                                                  (p: W.Widget_color_input              , serial?: W.Widget_color_serial              ) => new W.Widget_color               (this, this.schema, p, serial)
    stringOpt          =                                                  (p: W.Widget_strOpt_input             , serial?: W.Widget_strOpt_serial             ) => new W.Widget_strOpt              (this, this.schema, p, serial)
    str                =                                                  (p: W.Widget_str_input                , serial?: W.Widget_str_serial                ) => new W.Widget_str                 (this, this.schema, p, serial)
    strOpt             =                                                  (p: W.Widget_strOpt_input             , serial?: W.Widget_strOpt_serial             ) => new W.Widget_strOpt              (this, this.schema, p, serial)
    prompt             =                                                  (p: W.Widget_prompt_input             , serial?: W.Widget_prompt_serial             ) => new W.Widget_prompt              (this, this.schema, p, serial)
    promptOpt          =                                                  (p: W.Widget_promptOpt_input          , serial?: W.Widget_promptOpt_serial          ) => new W.Widget_promptOpt           (this, this.schema, p, serial)
    seed               =                                                  (p: W.Widget_seed_input               , serial?: W.Widget_seed_serial               ) => new W.Widget_seed                (this, this.schema, p, serial)
    int                =                                                  (p: W.Widget_int_input                , serial?: W.Widget_int_serial                ) => new W.Widget_int                 (this, this.schema, p, serial)
    intOpt             =                                                  (p: W.Widget_intOpt_input             , serial?: W.Widget_intOpt_serial             ) => new W.Widget_intOpt              (this, this.schema, p, serial)
    float              =                                                  (p: W.Widget_float_input              , serial?: W.Widget_float_serial              ) => new W.Widget_float               (this, this.schema, p, serial)
    floatOpt           =                                                  (p: W.Widget_floatOpt_input           , serial?: W.Widget_floatOpt_serial           ) => new W.Widget_floatOpt            (this, this.schema, p, serial)
    number             =                                                  (p: W.Widget_float_input              , serial?: W.Widget_float_serial              ) => new W.Widget_float               (this, this.schema, p, serial)
    numberOpt          =                                                  (p: W.Widget_floatOpt_input           , serial?: W.Widget_floatOpt_serial           ) => new W.Widget_floatOpt            (this, this.schema, p, serial)
    matrix             =                                                  (p: W.Widget_matrix_input             , serial?: W.Widget_matrix_serial             ) => new W.Widget_matrix              (this, this.schema, p, serial)
    boolean            =                                                  (p: W.Widget_bool_input               , serial?: W.Widget_bool_serial               ) => new W.Widget_bool                (this, this.schema, p, serial)
    bool               =                                                  (p: W.Widget_bool_input               , serial?: W.Widget_bool_serial               ) => new W.Widget_bool                (this, this.schema, p, serial)
    loras              =                                                  (p: W.Widget_loras_input              , serial?: W.Widget_loras_serial              ) => new W.Widget_loras               (this, this.schema, p, serial)
    image              =                                                  (p: W.Widget_image_input              , serial?: W.Widget_image_serial              ) => new W.Widget_image               (this, this.schema, p, serial)
    markdown           =                                                  (p: W.Widget_markdown_input           , serial?: W.Widget_markdown_serial           ) => new W.Widget_markdown            (this, this.schema, p, serial)
    imageOpt           =                                                  (p: W.Widget_imageOpt_input           , serial?: W.Widget_imageOpt_serial           ) => new W.Widget_imageOpt            (this, this.schema, p, serial)
    selectOneOrCustom  =                                                  (p: W.Widget_selectOneOrCustom_input  , serial?: W.Widget_selectOneOrCustom_serial  ) => new W.Widget_selectOneOrCustom   (this, this.schema, p, serial)
    selectManyOrCustom =                                                  (p: W.Widget_selectManyOrCustom_input , serial?: W.Widget_selectManyOrCustom_serial ) => new W.Widget_selectManyOrCustom  (this, this.schema, p, serial)
    enum               = <const T extends KnownEnumNames>                 (p: W.Widget_enum_input<T>            , serial?: W.Widget_enum_serial<T>            ) => new W.Widget_enum                (this, this.schema, p, serial)
    enumOpt            = <const T extends KnownEnumNames>                 (p: W.Widget_enumOpt_input<T>         , serial?: W.Widget_enumOpt_serial<T>         ) => new W.Widget_enumOpt             (this, this.schema, p, serial)
    list               = <const T extends W.Widget>                       (p: W.Widget_list_input<T>            , serial?: W.Widget_list_serial<T>            ) => new W.Widget_list                (this, this.schema, p, serial)
    groupOpt           = <const T extends { [key: string]: W.Widget }>    (p: W.Widget_groupOpt_input<T>        , serial?: W.Widget_groupOpt_serial<T>        ) => new W.Widget_groupOpt            (this, this.schema, p, serial)
    group              = <const T extends { [key: string]: W.Widget }>    (p: W.Widget_group_input<T>           , serial?: W.Widget_group_serial<T>           ) => new W.Widget_group               (this, this.schema, p, serial)
    selectOne          = <const T extends { type: string}>                (p: W.Widget_selectOne_input<T>       , serial?: W.Widget_selectOne_serial<T>       ) => new W.Widget_selectOne           (this, this.schema, p, serial)
    selectMany         = <const T extends { type: string}>                (p: W.Widget_selectMany_input<T>      , serial?: W.Widget_selectMany_serial<T>      ) => new W.Widget_selectMany          (this, this.schema, p, serial)
    choice             = <const T extends { [key: string]: W.Widget }>    (p: W.Widget_choice_input<T>          , serial?: W.Widget_choice_serial<T>          ) => new W.Widget_choice              (this, this.schema, p, serial)
    choices            = <const T extends { [key: string]: W.Widget }>    (p: W.Widget_choices_input<T>         , serial?: W.Widget_choices_serial<T>         ) => new W.Widget_choices             (this, this.schema, p, serial)
}
