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
import { Schema } from './Prop'
import type { SchemaDict } from 'src/cards/App'
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

    promptV2    = (config: Widget_prompt_config = {})                                                             => new Schema<  Widget_prompt                      >('prompt'   , config)
    time        = (config: Widget_string_config = {})                                                             => new Schema<  Widget_string                      >('str'      , { inputType: 'time', ...config })
    password    = (config: Widget_string_config = {})                                                             => new Schema<  Widget_string                      >('str'      , { inputType: 'password', ...config })
    email       = (config: Widget_string_config = {})                                                             => new Schema<  Widget_string                      >('str'      , { inputType: 'email', ...config })
    url         = (config: Widget_string_config = {})                                                             => new Schema<  Widget_string                      >('str'      , { inputType: 'url', ...config })
    string      = (config: Widget_string_config = {})                                                             => new Schema<  Widget_string                      >('str'      , config)
    boolean     = (config: Widget_bool_config   = {})                                                             => new Schema<  Widget_bool                        >('bool'     , config)
    bool        = (config: Widget_bool_config   = {})                                                             => new Schema<  Widget_bool                        >('bool'     , config)
    size        = (config: Widget_size_config   = {})                                                             => new Schema<  Widget_size                        >('size'     , config)
    orbit       = (config: Widget_orbit_config  = {})                                                             => new Schema<  Widget_orbit                       >('orbit'    , config)
    seed        = (config: W.Widget_seed_config = {})                                                             => new Schema<W.Widget_seed                        >('seed'     , config)
    color       = (config: Widget_color_config  = {})                                                             => new Schema<  Widget_color                       >('color'    , config)
    matrix      = (config: Widget_matrix_config)                                                                  => new Schema<  Widget_matrix                      >('matrix'   , config)
    inlineRun   = (config: W.Widget_inlineRun_config = {})                                                        => new Schema<W.Widget_inlineRun                   >('inlineRun', config)
    button      = (config: W.Widget_inlineRun_config = {})                                                        => new Schema<W.Widget_inlineRun                   >('inlineRun', config)
    loras       = (config: W.Widget_loras_config     = {})                                                        => new Schema<W.Widget_loras                       >('loras'    , config)
    markdown    = (config: W.Widget_markdown_config | string)                                                     => new Schema<W.Widget_markdown                    >('markdown' , typeof config === 'string' ? { markdown: config } : config)
    image       = (config: Widget_image_config = {})                                                              => new Schema<Widget_image                         >('image'    , config)
    prompt      = (config: Widget_prompt_config)                                                                  => new Schema<Widget_prompt                        >('prompt'   , config)
    int         = (config: Omit<Widget_number_config, 'mode'> = {})                                               => new Schema<  Widget_number                      >('number'   , { mode: 'int', ...config })
    float       = (config: Omit<Widget_number_config, 'mode'> = {})                                               => new Schema<  Widget_number                      >('number'   , { mode: 'float', ...config })
    number      = (config: Omit<Widget_number_config, 'mode'> = {})                                               => new Schema<  Widget_number                      >('number'   , { mode: 'float', ...config })
    custom      = <TViewState>(config: Widget_custom_config<TViewState>)                                          => new Schema<  Widget_custom<TViewState>          >('custom'   , config)
    list        = <const T extends Schema>(config: Widget_list_config<T>)                                      => new Schema<  Widget_list<T>                     >('list'     , config)
    listExt     = <const T extends Schema>(config: Widget_listExt_config<T>)                                   => new Schema<  Widget_listExt<T>                  >('listExt'  , config)
    timeline    = <const T extends Schema>(config: Widget_listExt_config<T>)                                   => new Schema<  Widget_listExt<T>                  >('listExt'  , { mode: 'timeline', ...config })
    regional    = <const T extends Schema>(config: Widget_listExt_config<T>)                                   => new Schema<  Widget_listExt<T>                  >('listExt'  , { mode: 'regional', ...config })
    selectOneV2 = (p: string[])                                                                                   => new Schema<W.Widget_selectOne<W.BaseSelectEntry>>('selectOne',  { choices: p.map((id) => ({ id })), appearance:'tab' }) // prettier-ignore
    selectOne   = <const T extends W.BaseSelectEntry>(config: W.Widget_selectOne_config<T>)                       => new Schema<W.Widget_selectOne<T>                >('selectOne',  config)
    selectMany  = <const T extends W.BaseSelectEntry>(config: W.Widget_selectMany_config<T>)                      => new Schema<W.Widget_selectMany<T>               >('selectMany', config)
    group       = <const T extends SchemaDict>(config: Widget_group_config<T>={})                                 => new Schema<Widget_group<T>                      >('group', config)
    choice      = <const T extends { [key: string]: Schema }>(config: Omit<Widget_choices_config<T>, 'multi'>) => new Schema<Widget_choices<T>                    >('choices',    { multi: false, ...config })
    choices     = <const T extends { [key: string]: Schema }>(config: Omit<Widget_choices_config<T>, 'multi'>) => new Schema<Widget_choices<T>                    >('choices',    { multi: true, ...config })
    // optional wrappers
    optional    = <const T extends Schema>(p: Widget_optional_config<T>) => new Schema<Widget_optional<T>>('optional', p)
    stringOpt   = (config: Widget_string_config                                & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_string>  >(config, this.string)
    intOpt      = (config: Omit<Widget_number_config, 'mode'>                  & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_number>  >(config, this.number)
    floatOpt    = (config: Omit<Widget_number_config, 'mode'>                  & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_number>  >(config, this.number)
    numberOpt   = (config: Omit<Widget_number_config, 'mode'>                  & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_number>  >(config, this.number)
    imageOpt    = (config: Widget_image_config                                 & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_image>   >(config, this.image)
    promptOpt   = (config: Widget_prompt_config                                & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_prompt>  >(config, this.prompt)
    colorOpt    = (config: Widget_color_config                                 & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_color>   >(config, this.color)
    groupOpt    = <const T extends SchemaDict>(config: Widget_group_config<T>  & { startActive?: boolean } = {}) => this.wrapOptional<Schema<Widget_group<T>>>(config, this.group)

    /**
     * Calling this function will mount and instanciate the subform right away
     * Subform will be register in the root form `group`, using `__${key}__` as the key
     * This is a core abstraction that enables features like
     *  - mountting a widget at several places in the form
     *  - recursive forms
     *  - dynamic widgets depending on other widgets values
     * */
    shared = <W extends Schema>(key: string, unmounted: W): Widget_shared<W> => {
        const name = `__${key}__`
        const prevSerial = this.form._ROOT.serial.values_[name]
        let widget
        if (prevSerial && prevSerial.type === unmounted.type) {
            widget = this._HYDRATE(unmounted, prevSerial)
        } else {
            widget = this._HYDRATE(unmounted, null)
            this.form._ROOT.serial.values_[name] = widget.serial
        }

        return new Widget_shared<W>(this.form, { rootKey: key, widget }) as any
    }

    // --------------------

    private wrapOptional<T extends Schema>(
        config: {
            // from SharedWidgetProps
            label?: string | false
            requirements?: Requirements[]
            startCollapsed?: boolean
            // extra for optionality
            startActive?: boolean,
            // ... plus every other config param
        },
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


    _FIX_INDENTATION = _FIX_INDENTATION

    /** (@internal); */ _cache: { count: number } = { count: 0 }
    /** (@internal) advanced way to restore form state. used internally */
    _HYDRATE = <T extends Schema>(
        unmounted: T,
        serial: any | null
    ): T['$Widget'] => {
        // ensure the serial is compatible
        if (serial != null && serial.type !== unmounted.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${unmounted.type}, got: ${serial.type})`)
            serial = null
        }

        if (unmounted instanceof Widget_shared){
            return unmounted
            // return new Unmounted(unmounted.type, unmounted.config) as any
            // return unmounted.shared
        }

        if (!(unmounted instanceof Schema)){
            console.log(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)
        }

        const type = unmounted.type
        const config = unmounted.config as any /* impossible to propagate union specification in the switch below */

        if (type === 'group'     ) return new   Widget_group     (this.form, config, serial, this.form._ROOT ? undefined : (x) => { this.form._ROOT = x })
        if (type === 'shared'    ) return new   Widget_shared    (this.form, config, serial)
        if (type === 'optional'  ) return new   Widget_optional  (this.form, config, serial)
        if (type === 'bool'      ) return new   Widget_bool      (this.form, config, serial)
        if (type === 'str'       ) return new   Widget_string    (this.form, config, serial)
        if (type === 'prompt'    ) return new   Widget_prompt    (this.form, config, serial)
        if (type === 'choices'   ) return new   Widget_choices   (this.form, config, serial)
        if (type === 'number'    ) return new   Widget_number    (this.form, config, serial)
        if (type === 'color'     ) return new   Widget_color     (this.form, config, serial)
        if (type === 'enum'      ) return new   Widget_enum      (this.form, config, serial)
        if (type === 'list'      ) return new   Widget_list      (this.form, config, serial)
        if (type === 'orbit'     ) return new   Widget_orbit     (this.form, config, serial)
        if (type === 'listExt'   ) return new   Widget_listExt   (this.form, config, serial)
        if (type === 'inlineRun' ) return new W.Widget_inlineRun (this.form, config, serial)
        if (type === 'seed'      ) return new W.Widget_seed      (this.form, config, serial)
        if (type === 'matrix'    ) return new   Widget_matrix    (this.form, config, serial)
        if (type === 'loras'     ) return new W.Widget_loras     (this.form, config, serial)
        if (type === 'image'     ) return new   Widget_image     (this.form, config, serial)
        if (type === 'selectOne' ) return new W.Widget_selectOne (this.form, config, serial)
        if (type === 'selectMany') return new W.Widget_selectMany(this.form, config, serial)
        if (type === 'size'      ) return new   Widget_size      (this.form, config, serial)
        if (type === 'markdown'  ) return new W.Widget_markdown  (this.form, config, serial)
        if (type === 'custom'    ) return new   Widget_custom    (this.form, config, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)
        exhaust(type)
        return new W.Widget_markdown(this.form, { markdown: 'unknown widget "${type}" in serial.' })
    }
}
