import type { Form } from './Form'
import type { Requirements } from './IWidget'
import type { SchemaDict } from 'src/cards/App'

import { makeAutoObservable } from 'mobx'

import { _FIX_INDENTATION } from '../utils/misc/_FIX_INDENTATION'
import { mkFormAutoBuilder } from './builder/AutoBuilder'
import { EnumBuilder, EnumBuilderOpt } from './builder/EnumBuilder'
import { type ISpec, Spec } from './Spec'
import { Widget_bool, type Widget_bool_config } from './widgets/bool/WidgetBool'
import { Widget_inlineRun, type Widget_inlineRun_config } from './widgets/button/WidgetInlineRun'
import { Widget_choices, type Widget_choices_config } from './widgets/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from './widgets/color/WidgetColor'
import { Widget_custom, type Widget_custom_config } from './widgets/custom/WidgetCustom'
import { Widget_enum } from './widgets/enum/WidgetEnum'
import { Widget_group, type Widget_group_config } from './widgets/group/WidgetGroup'
import { Widget_image, type Widget_image_config } from './widgets/image/WidgetImage'
import { Widget_list, type Widget_list_config } from './widgets/list/WidgetList'
import { Widget_listExt, type Widget_listExt_config } from './widgets/listExt/WidgetListExt'
import { Widget_loras, type Widget_loras_config } from './widgets/loras/WidgetLora'
import { Widget_markdown, Widget_markdown_config } from './widgets/markdown/WidgetMarkdown'
import { Widget_matrix, type Widget_matrix_config } from './widgets/matrix/WidgetMatrix'
import { Widget_number, type Widget_number_config } from './widgets/number/WidgetNumber'
import { Widget_optional, type Widget_optional_config } from './widgets/optional/WidgetOptional'
import { Widget_orbit, type Widget_orbit_config } from './widgets/orbit/WidgetOrbit'
import { Widget_prompt, type Widget_prompt_config } from './widgets/prompt/WidgetPrompt'
import { Widget_seed, type Widget_seed_config } from './widgets/seed/WidgetSeed'
import { Widget_selectMany, type Widget_selectMany_config } from './widgets/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Widget_selectOne, type Widget_selectOne_config } from './widgets/selectOne/WidgetSelectOne'
import { Widget_shared } from './widgets/shared/WidgetShared'
import { Widget_size, type Widget_size_config } from './widgets/size/WidgetSize'
import { Widget_string, type Widget_string_config } from './widgets/string/WidgetString'
import { exhaust } from 'src/utils/misc/ComfyUtils'

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

    promptV2    = (config: Widget_prompt_config = {})                                                        => new Spec<Widget_prompt                      >('prompt'    , config)
    time        = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , { inputType: 'time', ...config })
    password    = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , { inputType: 'password', ...config })
    email       = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , { inputType: 'email', ...config })
    url         = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , { inputType: 'url', ...config })
    string      = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , config)
    text        = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , config)
    textarea    = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , { textarea: true, ...config })
    boolean     = (config: Widget_bool_config   = {})                                                        => new Spec<Widget_bool                        >('bool'      , config)
    bool        = (config: Widget_bool_config   = {})                                                        => new Spec<Widget_bool                        >('bool'      , config)
    size        = (config: Widget_size_config   = {})                                                        => new Spec<Widget_size                        >('size'      , config)
    orbit       = (config: Widget_orbit_config  = {})                                                        => new Spec<Widget_orbit                       >('orbit'     , config)
    seed        = (config: Widget_seed_config   = {})                                                        => new Spec<Widget_seed                        >('seed'      , config)
    color       = (config: Widget_color_config  = {})                                                        => new Spec<Widget_color                       >('color'     , config)
    colorV2     = (config: Widget_string_config = {})                                                        => new Spec<Widget_string                      >('str'       , { inputType: 'color', ...config })
    matrix      = (config: Widget_matrix_config)                                                             => new Spec<Widget_matrix                      >('matrix'    , config)
    inlineRun   = (config: Widget_inlineRun_config = {})                                                     => new Spec<Widget_inlineRun                   >('inlineRun' , config)
    button      = (config: Widget_inlineRun_config = {})                                                     => new Spec<Widget_inlineRun                   >('inlineRun' , config)
    loras       = (config: Widget_loras_config     = {})                                                     => new Spec<Widget_loras                       >('loras'     , config)
    markdown    = (config: Widget_markdown_config | string)                                                  => new Spec<Widget_markdown                    >('markdown'  , typeof config === 'string' ? { markdown: config } : config)
    header      = (config: Widget_markdown_config | string)                                                  => new Spec<Widget_markdown                    >('markdown'  , typeof config === 'string' ? { markdown: config, header: true } : { header: true, ...config })
    image       = (config: Widget_image_config = {})                                                         => new Spec<Widget_image                       >('image'     , config)
    prompt      = (config: Widget_prompt_config)                                                             => new Spec<Widget_prompt                      >('prompt'    , config)
    int         = (config: Omit<Widget_number_config, 'mode'> = {})                                          => new Spec<Widget_number                      >('number'    , { mode: 'int', ...config })
    float       = (config: Omit<Widget_number_config, 'mode'> = {})                                          => new Spec<Widget_number                      >('number'    , { mode: 'float', ...config })
    number      = (config: Omit<Widget_number_config, 'mode'> = {})                                          => new Spec<Widget_number                      >('number'    , { mode: 'float', ...config })
    custom      = <TViewState>(config: Widget_custom_config<TViewState>)                                     => new Spec<Widget_custom<TViewState>          >('custom'    , config)
    list        = <const T extends Spec>(config: Widget_list_config<T>)                                      => new Spec<Widget_list<T>                     >('list'      , config)
    listExt     = <const T extends Spec>(config: Widget_listExt_config<T>)                                   => new Spec<Widget_listExt<T>                  >('listExt'   , config)
    timeline    = <const T extends Spec>(config: Widget_listExt_config<T>)                                   => new Spec<Widget_listExt<T>                  >('listExt'   , { mode: 'timeline', ...config })
    regional    = <const T extends Spec>(config: Widget_listExt_config<T>)                                   => new Spec<Widget_listExt<T>                  >('listExt'   , { mode: 'regional', ...config })
    selectOneV2 = (p: string[])                                                                              => new Spec<Widget_selectOne<BaseSelectEntry>  >('selectOne' , { choices: p.map((id) => ({ id })), appearance:'tab' }) // prettier-ignore
    selectOne   = <const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>)                      => new Spec<Widget_selectOne<T>                >('selectOne' , config)
    selectMany  = <const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>)                     => new Spec<Widget_selectMany<T>               >('selectMany', config)
    group       = <const T extends SchemaDict>(config: Widget_group_config<T>={})                            => new Spec<Widget_group<T>                    >('group'     , config)
    choice      = <const T extends { [key: string]: Spec }>(config: Omit<Widget_choices_config<T>, 'multi'>) => new Spec<Widget_choices<T>                  >('choices'   , { multi: false, ...config })
    choices     = <const T extends { [key: string]: Spec }>(config: Omit<Widget_choices_config<T>, 'multi'>) => new Spec<Widget_choices<T>                  >('choices'   , { multi: true, ...config })
    // optional wrappers
    optional    = <const T extends Spec>(p: Widget_optional_config<T>) => new Spec<Widget_optional<T>>('optional', p)

    // /** a more practical function to make widget optionals */
    // optional2   = <const T extends Spec>(spec: T, startActive: boolean = false) => new Spec<Widget_optional<Spec<T['$Widget']>>>('optional', {
    //     widget: spec,
    //     startActive: startActive,
    //     label: spec.config.label,
    //     requirements: spec.config.requirements,
    //     startCollapsed: spec.config.startCollapsed,
    //     collapsed: spec.config.collapsed,
    //     border: spec.config.border,
    // })
    /** @deprecated : use `.string(...).optional` instead */
    stringOpt   = (config: Widget_string_config                                 & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_string>    >(config, this.string)
    /** @deprecated : use `.int(...).optional` instead */
    intOpt      = (config: Omit<Widget_number_config, 'mode'>                   & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_number>    >(config, this.number)
    /** @deprecated : use `.float(...).optional` instead */
    floatOpt    = (config: Omit<Widget_number_config, 'mode'>                   & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_number>    >(config, this.number)
    /** @deprecated : use `.number(...).optional` instead */
    numberOpt   = (config: Omit<Widget_number_config, 'mode'>                   & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_number>    >(config, this.number)
    /** @deprecated : use `.image(...).optional` instead */
    imageOpt    = (config: Widget_image_config                                  & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_image>     >(config, this.image)
    /** @deprecated : use `.prompt(...).optional` instead */
    promptOpt   = (config: Widget_prompt_config                                 & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_prompt>    >(config, this.prompt)
    /** @deprecated : use `.color(...).optional` instead */
    colorOpt    = (config: Widget_color_config                                  & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_color>     >(config, this.color)
    /** @deprecated : use `.group(...).optional` instead */
    groupOpt    = <const T extends SchemaDict>(config: Widget_group_config<T>   & { startActive?: boolean } = {}) => this.wrapOptional<Spec<Widget_group<T>>  >(config, this.group)
    /** @deprecated : use `.regional(...).optional` instead */
    regionalOpt = <const T extends Spec>      (config: Widget_listExt_config<T> & { startActive?: boolean }     ) => this.wrapOptional<Spec<Widget_listExt<T>>>(config, this.regional)

    /**
     * Calling this function will mount and instanciate the subform right away
     * Subform will be register in the root form `group`, using `__${key}__` as the key
     * This is a core abstraction that enables features like
     *  - mountting a widget at several places in the form
     *  - recursive forms
     *  - dynamic widgets depending on other widgets values
     * */
    shared = <W extends Spec>(key: string, unmounted: W): Widget_shared<W> => {
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

    private wrapOptional<T extends Spec>(
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
    _HYDRATE = <T extends ISpec>(
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

        if (!(unmounted instanceof Spec)){
            console.log(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)
        }

        const type = unmounted.type
        const config = unmounted.config as any /* impossible to propagate union specification in the switch below */

        if (type === 'group'     ) return new Widget_group     (this.form, config, serial, this.form._ROOT ? undefined : (x) => { this.form._ROOT = x })
        if (type === 'shared'    ) return new Widget_shared    (this.form, config, serial)
        if (type === 'optional'  ) return new Widget_optional  (this.form, config, serial)
        if (type === 'bool'      ) return new Widget_bool      (this.form, config, serial)
        if (type === 'str'       ) return new Widget_string    (this.form, config, serial)
        if (type === 'prompt'    ) return new Widget_prompt    (this.form, config, serial)
        if (type === 'choices'   ) return new Widget_choices   (this.form, config, serial)
        if (type === 'number'    ) return new Widget_number    (this.form, config, serial)
        if (type === 'color'     ) return new Widget_color     (this.form, config, serial)
        if (type === 'enum'      ) return new Widget_enum      (this.form, config, serial)
        if (type === 'list'      ) return new Widget_list      (this.form, config, serial)
        if (type === 'orbit'     ) return new Widget_orbit     (this.form, config, serial)
        if (type === 'listExt'   ) return new Widget_listExt   (this.form, config, serial)
        if (type === 'inlineRun' ) return new Widget_inlineRun (this.form, config, serial)
        if (type === 'seed'      ) return new Widget_seed      (this.form, config, serial)
        if (type === 'matrix'    ) return new Widget_matrix    (this.form, config, serial)
        if (type === 'loras'     ) return new Widget_loras     (this.form, config, serial)
        if (type === 'image'     ) return new Widget_image     (this.form, config, serial)
        if (type === 'selectOne' ) return new Widget_selectOne (this.form, config, serial)
        if (type === 'selectMany') return new Widget_selectMany(this.form, config, serial)
        if (type === 'size'      ) return new Widget_size      (this.form, config, serial)
        if (type === 'markdown'  ) return new Widget_markdown  (this.form, config, serial)
        if (type === 'custom'    ) return new Widget_custom    (this.form, config, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)
        // exhaust(type)
        return new Widget_markdown(this.form, { markdown: `unknown widget "${type}" in serial.` })
    }
}
