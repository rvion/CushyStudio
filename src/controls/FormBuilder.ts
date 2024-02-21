import type { Form } from './Form'

import { makeAutoObservable } from 'mobx'
import { exhaust } from 'src/utils/misc/ComfyUtils'
import { _FIX_INDENTATION } from '../utils/misc/_FIX_INDENTATION'
import * as W from './Widget'

import { mkFormAutoBuilder } from './builder/AutoBuilder'
import { EnumBuilder, EnumBuilderOpt } from './builder/EnumBuilder'
import { Widget_bool, type Widget_bool_config } from './widgets/bool/WidgetBool'
import { Widget_choices, type Widget_choices_config } from './widgets/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from './widgets/color/WidgetColor'
import { Widget_custom, type Widget_custom_config } from './widgets/custom/WidgetCustom'
import { Widget_enum } from './widgets/enum/WidgetEnum'
import { Widget_group, type Widget_group_config } from './widgets/group/WidgetGroup'
import { Widget_image, type Widget_image_config } from './widgets/image/WidgetImage'
import { Widget_list, type Widget_list_config } from './widgets/list/WidgetList'
import { Widget_listExt, type Widget_listExt_config } from './widgets/listExt/WidgetListExt'
import { Widget_number, type Widget_number_config } from './widgets/number/WidgetNumber'
import { Widget_optional, type Widget_optional_config } from './widgets/optional/WidgetOptional'
import { Widget_orbit, type Widget_orbit_config } from './widgets/orbit/WidgetOrbit'
import { Widget_prompt, type Widget_prompt_config } from './widgets/prompt/WidgetPrompt'
import { Widget_size, type Widget_size_config } from './widgets/size/WidgetSize'
import { Widget_string, type Widget_string_config } from './widgets/string/WidgetString'
import { Widget_shared } from './widgets/shared/WidgetShared'
import { Widget_matrix, type Widget_matrix_config } from './widgets/matrix/WidgetMatrix'
import { Unmounted } from './Prop'
import type { WidgetDict } from 'src/cards/App'
import type { Requirements, SharedWidgetProps } from './IWidget'

// prettier-ignore
export class FormBuilder {
    /** (@internal) don't call this yourself */
    constructor(public form: Form<any>) {
        makeAutoObservable(this, {
            auto: false,
            autoField: false,
            enum: false,
            enumOpt: false,
        })
    }

    promptV2    = (config: Widget_prompt_config = {})                           => new Unmounted<  Widget_prompt             >('prompt'   , config)
    time        = (config: Widget_string_config = {})                           => new Unmounted<  Widget_string             >('str'      , { inputType: 'time', ...config })
    password    = (config: Widget_string_config = {})                           => new Unmounted<  Widget_string             >('str'      , { inputType: 'password', ...config })
    email       = (config: Widget_string_config = {})                           => new Unmounted<  Widget_string             >('str'      , { inputType: 'email', ...config })
    url         = (config: Widget_string_config = {})                           => new Unmounted<  Widget_string             >('str'      , { inputType: 'url', ...config })
    string      = (config: Widget_string_config = {})                           => new Unmounted<  Widget_string             >('str'      , config)
    boolean     = (config: Widget_bool_config   = {})                           => new Unmounted<  Widget_bool               >('bool'     , config)
    bool        = (config: Widget_bool_config   = {})                           => new Unmounted<  Widget_bool               >('bool'     , config)
    size        = (config: Widget_size_config   = {})                           => new Unmounted<  Widget_size               >('size'     , config)
    orbit       = (config: Widget_orbit_config  = {})                           => new Unmounted<  Widget_orbit              >('orbit'    , config)
    seed        = (config: W.Widget_seed_config = {})                           => new Unmounted<W.Widget_seed               >('seed'     , config)
    color       = (config: Widget_color_config  = {})                           => new Unmounted<  Widget_color              >('color'    , config)
    matrix      = (config: Widget_matrix_config)                                => new Unmounted<  Widget_matrix             >('matrix'   , config)
    inlineRun   = (config: W.Widget_inlineRun_config = {})                      => new Unmounted<W.Widget_inlineRun          >('inlineRun', config)
    loras       = (config: W.Widget_loras_config     = {})                      => new Unmounted<W.Widget_loras              >('loras'    , config)
    markdown    = (config: W.Widget_markdown_config | string)                   => new Unmounted<W.Widget_markdown           >('markdown' , typeof config === 'string' ? { markdown: config } : config)
    image       = (config: Widget_image_config = {})                            => new Unmounted<Widget_image                >('image'    , config)
    prompt      = (config: Widget_prompt_config)                                => new Unmounted<Widget_prompt               >('prompt'   , config)
    int         = (config: Omit<Widget_number_config, 'mode'> = {})             => new Unmounted<  Widget_number             >('number'   , { mode: 'int', ...config })
    float       = (config: Omit<Widget_number_config, 'mode'> = {})             => new Unmounted<  Widget_number             >('number'   , { mode: 'float', ...config })
    number      = (config: Omit<Widget_number_config, 'mode'> = {})             => new Unmounted<  Widget_number             >('number'   , { mode: 'float', ...config })
    custom      = <TViewState>(config: Widget_custom_config<TViewState>)        => new Unmounted<  Widget_custom<TViewState> >('custom'   , config)
    list        = <const T extends Unmounted>(config: Widget_list_config<T>)    => new Unmounted<  Widget_list<T>            >('list'     , config)
    listExt     = <const T extends Unmounted>(config: Widget_listExt_config<T>) => new Unmounted<  Widget_listExt<T>         >('listExt'  , config)
    timeline    = <const T extends Unmounted>(config: Widget_listExt_config<T>) => new Unmounted<  Widget_listExt<T>         >('listExt'  , { mode: 'timeline', ...config })
    regional    = <const T extends Unmounted>(config: Widget_listExt_config<T>) => new Unmounted<  Widget_listExt<T>         >('listExt'  , { mode: 'regional', ...config })
    selectOneV2 = (p: string[])                                                                                   => new Unmounted<W.Widget_selectOne<W.BaseSelectEntry>>('selectOne',  { choices: p.map((id) => ({ id })), appearance:'tab' }) // prettier-ignore
    selectOne   = <const T extends W.BaseSelectEntry>(config: W.Widget_selectOne_config<T>)                       => new Unmounted<W.Widget_selectOne<T>                >('selectOne',  config)
    selectMany  = <const T extends W.BaseSelectEntry>(config: W.Widget_selectMany_config<T>)                      => new Unmounted<W.Widget_selectMany<T>               >('selectMany', config)
    group       = <const T extends WidgetDict>(config: Widget_group_config<T>={})                                 => new Unmounted('group', config)
    choice      = <const T extends { [key: string]: Unmounted }>(config: Omit<Widget_choices_config<T>, 'multi'>) => new Unmounted<Widget_choices<T>                    >('choices',    { multi: false, ...config })
    choices     = <const T extends { [key: string]: Unmounted }>(config: Omit<Widget_choices_config<T>, 'multi'>) => new Unmounted<Widget_choices<T>                    >('choices',    { multi: true, ...config })

    optional    = <const T extends Unmounted>(p: Widget_optional_config<T>) => new Unmounted<Widget_optional<T>>('optional', p)
    stringOpt   = (config: Widget_string_config & { startActive?: boolean } = {}) => this.wrapOptional(config, this.string)
    intOpt      = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) => this.wrapOptional(config, this.number)
    floatOpt    = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) => this.wrapOptional(config, this.number)
    numberOpt   = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) => this.wrapOptional(config, this.number)
    imageOpt    = (config: Widget_image_config & { startActive?: boolean }) => this.wrapOptional(config, this.image)
    promptOpt   = (config: Widget_prompt_config & { startActive?: boolean }) => this.wrapOptional(config,  this.prompt)
    colorOpt    = (config: Widget_color_config & { startActive?: boolean }) => this.wrapOptional(config,  this.color)
    groupOpt    = <const T extends WidgetDict>(config: Widget_group_config<T> & { startActive?: boolean }) => this.wrapOptional(config,  this.group)



    shared = <W extends W.Widget>(baseName: string, widget: W): Widget_shared<W> => {
        return new Widget_shared<W>(this.form, { rootKey: baseName, widget }) as any
    }

    // --------------------

    private wrapOptional<P extends {
        // from SharedWidgetProps
        label?: string | false
        requirements?: Requirements[]
        startCollapsed?: boolean
        // extra for optionality
        startActive?: boolean,
    }, T extends Unmounted >(
        config: P,
        widgetFn: (config:T['$Input']) => T) {
        return this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: widgetFn({ ...config, startCollapsed: undefined }),
        })
    }

    // --------------------

    // enum = /*<const T extends KnownEnumNames>*/ (config: Widget_enum_config<any, any>) => new Widget_enum(this.form, config)
    get auto() {
        const _ = mkFormAutoBuilder(this) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'auto', { value: _ })
        return _
    }
    get autoField() {
        const _ = mkFormAutoBuilder(this)
        Object.defineProperty(this, 'autoField', { value: _ })
        return _
    }
    get enum() {
        const _ = new EnumBuilder(this.form) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'enum', { value: _ })
        return _
    }
    get enumOpt() {
        const _ = new EnumBuilderOpt(this.form)
        Object.defineProperty(this, 'enumOpt', { value: _ })
        return _
    }
    //  <const T extends KnownEnumNames>(config: Widget_enum_config<T> & { startActive?: boolean }) =>
    //     this.optional({
    //         label: config.label,
    //         startActive: config.startActive,
    //         widget: () => new Widget_enum(this.form, config),
    //     })
    // --------------------

    // List API--------------
    _FIX_INDENTATION = _FIX_INDENTATION

    /** (@internal); */
    _cache: { count: number } = { count: 0 }

    /** (@internal) advanced way to restore form state. used internally */
    // prettier-ignore
    _HYDRATE = (type: W.Widget['type'], input: any, serial: any | null): any => {
        // ensure the serial is compatible
        if (serial != null && serial.type !== type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${type}, got: ${serial.type})`)
            serial = null
        }

        if (type === 'group'     ) return new   Widget_group     (this.form, input, serial, this.form._ROOT ? undefined : (x) => { this.form._ROOT = x })
        if (type === 'shared'    ) return new   Widget_shared    (this.form, input, serial)
        if (type === 'optional'  ) return new   Widget_optional  (this.form, input, serial)
        if (type === 'bool'      ) return new   Widget_bool      (this.form, input, serial)
        if (type === 'str'       ) return new   Widget_string    (this.form, input, serial)
        if (type === 'prompt'    ) return new   Widget_prompt    (this.form, input, serial)
        if (type === 'choices'   ) return new   Widget_choices   (this.form, input, serial)
        if (type === 'number'    ) return new   Widget_number    (this.form, input, serial)
        if (type === 'color'     ) return new   Widget_color     (this.form, input, serial)
        if (type === 'enum'      ) return new   Widget_enum      (this.form, input, serial)
        if (type === 'list'      ) return new   Widget_list      (this.form, input, serial)
        if (type === 'orbit'     ) return new   Widget_orbit     (this.form, input, serial)
        if (type === 'listExt'   ) return new   Widget_listExt   (this.form, input, serial)
        if (type === 'inlineRun' ) return new W.Widget_inlineRun (this.form, input, serial)
        if (type === 'seed'      ) return new W.Widget_seed      (this.form, input, serial)
        if (type === 'matrix'    ) return new   Widget_matrix    (this.form, input, serial)
        if (type === 'loras'     ) return new W.Widget_loras     (this.form, input, serial)
        if (type === 'image'     ) return new   Widget_image     (this.form, input, serial)
        if (type === 'selectOne' ) return new W.Widget_selectOne (this.form, input, serial)
        if (type === 'selectMany') return new W.Widget_selectMany(this.form, input, serial)
        if (type === 'size'      ) return new   Widget_size      (this.form, input, serial)
        if (type === 'markdown'  ) return new W.Widget_markdown  (this.form, input, serial)
        if (type === 'custom'    ) return new   Widget_custom    (this.form, input, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)
        exhaust(type)
        return new W.Widget_markdown(this.form, { markdown: 'unknown widget "${type}" in serial.' })
    }
}
