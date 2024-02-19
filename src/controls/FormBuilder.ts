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

    shared = <W extends W.Widget>(baseName: string, widget: W): Widget_shared<W> => {
        return new Widget_shared<W>(this.form, { rootKey: baseName, widget }) as any
    }

    // string
    promptV2 = (config: Widget_prompt_config = {}) => new Widget_prompt(this.form, config)
    time = (config: Widget_string_config = {}) => new Widget_string(this.form, { inputType: 'time', ...config })
    string = (config: Widget_string_config = {}) => new Widget_string(this.form, config)
    stringOpt = (config: Widget_string_config & { startActive?: boolean } = {}) =>
        this.optional({
            label: config.label,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_string(this.form, { ...config, startCollapsed: undefined }),
        })

    /** @deprecated */
    str = this.string

    /** @deprecated */
    strOpt = this.stringOpt

    // boolean
    boolean = (opts: Widget_bool_config = {}) => new Widget_bool(this.form, opts) // prettier-ignore
    bool    = (opts: Widget_bool_config = {}) => new Widget_bool(this.form, opts) // prettier-ignore

    // number
    int       = (opts: Omit<Widget_number_config, 'mode'> = {}) => new Widget_number(this.form, { mode: 'int',   ...opts }) // prettier-ignore
    float     = (opts: Omit<Widget_number_config, 'mode'> = {}) => new Widget_number(this.form, { mode: 'float', ...opts }) // prettier-ignore
    number    = (opts: Omit<Widget_number_config, 'mode'> = {}) => new Widget_number(this.form, { mode: 'float', ...opts }) // prettier-ignore

    intOpt = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_number(this.form, { mode: 'int', ...config, startCollapsed: undefined }),
        })
    floatOpt = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_number(this.form, { mode: 'float', ...config, startCollapsed: undefined }),
        })
    numberOpt = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_number(this.form, { mode: 'float', ...config, startCollapsed: undefined }),
        })

    image = (config: Widget_image_config = {}) => new Widget_image(this.form, config)
    imageOpt = (config: Widget_image_config & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_image(this.form, { ...config, startCollapsed: undefined }),
        })

    // --------------------
    prompt = (config: Widget_prompt_config) => new Widget_prompt(this.form, config)
    promptOpt = (config: Widget_prompt_config & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_prompt(this.form, { ...config, startCollapsed: undefined }),
        })

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

    color     = (opts: Widget_color_config)       => new Widget_color(this.form, opts) // prettier-ignore
    colorOpt = <const T extends { [key: string]: W.Widget }>(
        //
        config: Widget_color_config & { startActive?: boolean },
    ) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => this.color({ ...config, startCollapsed: undefined }),
        })

    size      = (opts: Widget_size_config)      => new Widget_size(this.form, opts) // prettier-ignore
    orbit     = (opts: Widget_orbit_config)     => new Widget_orbit(this.form, opts) // prettier-ignore
    seed      = (opts: W.Widget_seed_config)      => new W.Widget_seed(this.form, opts) // prettier-ignore

    matrix = (opts: Widget_matrix_config) => new Widget_matrix(this.form, opts)

    inlineRun = (opts: W.Widget_inlineRun_config) => new W.Widget_inlineRun(this.form, opts)
    loras = (opts: W.Widget_loras_config) => new W.Widget_loras(this.form, opts)

    markdown = (opts: W.Widget_markdown_config | string) =>
        new W.Widget_markdown(this.form, typeof opts === 'string' ? { markdown: opts } : opts)
    custom = <TViewState>(opts: Widget_custom_config<TViewState>) => new Widget_custom<TViewState>(this.form, opts)

    list = <const T extends W.Widget>(p: Widget_list_config<T>) => new Widget_list(this.form, p)

    optional = <const T extends W.Widget>(p: Widget_optional_config<T>) => new Widget_optional(this.form, p)

    listExt = <const T extends W.Widget>(p: Widget_listExt_config<T>) => new Widget_listExt(this.form, p)

    timeline = <const T extends W.Widget>(p: Widget_listExt_config<T>) =>
        new Widget_listExt(this.form, { mode: 'timeline', ...p })

    regional = <const T extends W.Widget>(p: Widget_listExt_config<T>) =>
        new Widget_listExt(this.form, { mode: 'regional', ...p })

    groupOpt = <const T extends { [key: string]: W.Widget }>(config: Widget_group_config<T> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => this.group({ ...config, startCollapsed: undefined }),
        })

    group = <const T extends { [key: string]: W.Widget }>(p: Widget_group_config<T>) => new Widget_group(this.form, p)

    // List API--------------
    selectOne = <const T extends W.BaseSelectEntry>(p: W.Widget_selectOne_config<T>) => new W.Widget_selectOne(this.form, p)
    selectOneV2 = <const T extends W.BaseSelectEntry>(p: string[]) => new W.Widget_selectOne(this.form, { choices: p.map((id) => ({ id })), appearance:'tab' }) // prettier-ignore

    selectMany = <const T extends W.BaseSelectEntry>(p: W.Widget_selectMany_config<T>) => new W.Widget_selectMany(this.form, p)

    // Object API-------------
    choice = <const T extends { [key: string]: () => W.Widget }>(p: Omit<Widget_choices_config<T>, 'multi'>) =>
        new Widget_choices(this.form, { multi: false, ...p })
    choices = <const T extends { [key: string]: () => W.Widget }>(p: Omit<Widget_choices_config<T>, 'multi'>) =>
        new Widget_choices(this.form, { multi: true, ...p })

    _FIX_INDENTATION = _FIX_INDENTATION

    /** (@internal); */
    _cache: { count: number } = { count: 0 }

    /** (@internal) advanced way to restore form state. used internally */
    // prettier-ignore
    _HYDRATE = (type: W.Widget['type'], input: any, serial?: any): any => {
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
