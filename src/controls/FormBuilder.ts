import type { ComfySchemaL } from 'src/models/Schema'

import { makeAutoObservable } from 'mobx'
import { exhaust } from 'src/utils/misc/ComfyUtils'
import { _FIX_INDENTATION } from '../utils/misc/_FIX_INDENTATION'
import * as W from './Widget'

import { AutoBuilder, mkFormAutoBuilder } from './AutoBuilder'
import { EnumBuilder, EnumBuilderOpt } from './EnumBuilder'
import { Widget_bool, type Widget_bool_config } from './widgets/bool/WidgetBool'
import { Widget_choices, type Widget_choices_config } from './widgets/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from './widgets/color/WidgetColor'
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

export class FormBuilder {
    /** (@internal) don't call this yourself */
    constructor(public schema: ComfySchemaL) {
        makeAutoObservable(this, { auto: false })
    }

    // string
    promptV2 = (config: Widget_prompt_config) => new Widget_prompt(this, config)
    string = (config: Widget_string_config) => new Widget_string(this, config)
    stringOpt = (config: Widget_string_config & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_string(this, { ...config, startCollapsed: undefined }),
        })

    /** @deprecated */
    str = this.string

    /** @deprecated */
    strOpt = this.stringOpt

    // boolean
    boolean = (opts: Widget_bool_config) => new Widget_bool(this, opts) // prettier-ignore
    bool    = (opts: Widget_bool_config) => new Widget_bool(this, opts) // prettier-ignore

    // number
    int       = (opts: Omit<Widget_number_config,'mode'>) => new Widget_number(this, { mode: 'int',   ...opts }) // prettier-ignore
    float     = (opts: Omit<Widget_number_config,'mode'>) => new Widget_number(this, { mode: 'float', ...opts }) // prettier-ignore
    number    = (opts: Omit<Widget_number_config,'mode'>) => new Widget_number(this, { mode: 'float', ...opts }) // prettier-ignore

    intOpt = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_number(this, { mode: 'int', ...config, startCollapsed: undefined }),
        })
    floatOpt = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_number(this, { mode: 'float', ...config, startCollapsed: undefined }),
        })
    numberOpt = (config: Omit<Widget_number_config, 'mode'> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_number(this, { mode: 'float', ...config, startCollapsed: undefined }),
        })

    image = (config: Widget_image_config) => new Widget_image(this, config)
    imageOpt = (config: Widget_image_config & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_image(this, { ...config, startCollapsed: undefined }),
        })

    // --------------------
    prompt = (config: Widget_prompt_config) => new Widget_prompt(this, config)
    promptOpt = (config: Widget_prompt_config & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => new Widget_prompt(this, { ...config, startCollapsed: undefined }),
        })

    // --------------------

    // enum = /*<const T extends KnownEnumNames>*/ (config: Widget_enum_config<any, any>) => new Widget_enum(this, config)
    auto = mkFormAutoBuilder(this) /*<const T extends KnownEnumNames>*/
    autoField = mkFormAutoBuilder(this)
    enum = new EnumBuilder(this) /*<const T extends KnownEnumNames>*/
    enumOpt = new EnumBuilderOpt(this)
    //  <const T extends KnownEnumNames>(config: Widget_enum_config<T> & { startActive?: boolean }) =>
    //     this.optional({
    //         label: config.label,
    //         startActive: config.startActive,
    //         widget: () => new Widget_enum(this, config),
    //     })
    // --------------------

    color     = (opts: Widget_color_config)       => new Widget_color(this, opts) // prettier-ignore
    size      = (opts: Widget_size_config)      => new Widget_size(this, opts) // prettier-ignore
    orbit     = (opts: Widget_orbit_config)     => new Widget_orbit(this, opts) // prettier-ignore
    seed      = (opts: W.Widget_seed_config)      => new W.Widget_seed(this, opts) // prettier-ignore

    matrix = (opts: W.Widget_matrix_config) => new W.Widget_matrix(this, opts)

    inlineRun = (opts: W.Widget_inlineRun_config) => new W.Widget_inlineRun(this, opts)
    loras = (opts: W.Widget_loras_config) => new W.Widget_loras(this, opts)

    markdown = (opts: W.Widget_markdown_config | string) =>
        new W.Widget_markdown(this, typeof opts === 'string' ? { markdown: opts } : opts)
    custom = <TViewState>(opts: W.Widget_custom_config<TViewState>) => new W.Widget_custom<TViewState>(this, opts)

    list = <const T extends W.Widget>(p: Widget_list_config<T>) => new Widget_list(this, p)

    optional = <const T extends W.Widget>(p: Widget_optional_config<T>) => new Widget_optional(this, p)

    listExt = <const T extends W.Widget>(p: Widget_listExt_config<T>) => new Widget_listExt(this, p)

    timeline = <const T extends W.Widget>(p: Widget_listExt_config<T>) => new Widget_listExt(this, { mode: 'timeline', ...p })

    regional = <const T extends W.Widget>(p: Widget_listExt_config<T>) => new Widget_listExt(this, { mode: 'regional', ...p })

    groupOpt = <const T extends { [key: string]: W.Widget }>(config: Widget_group_config<T> & { startActive?: boolean }) =>
        this.optional({
            label: config.label,
            requirements: config.requirements,
            startActive: config.startActive,
            startCollapsed: config.startCollapsed,
            widget: () => this.group({ ...config, startCollapsed: undefined }),
        })

    group = <const T extends { [key: string]: W.Widget }>(p: Widget_group_config<T>) => new Widget_group(this, p)

    // List API--------------
    selectOne = <const T extends W.BaseSelectEntry>(p: W.Widget_selectOne_config<T>) => new W.Widget_selectOne(this, p)

    selectMany = <const T extends W.BaseSelectEntry>(p: W.Widget_selectMany_config<T>) => new W.Widget_selectMany(this, p)

    // Object API-------------
    choice = <const T extends { [key: string]: () => W.Widget }>(p: Omit<Widget_choices_config<T>, 'multi'>) =>
        new Widget_choices(this, { multi: false, ...p })
    choices = <const T extends { [key: string]: () => W.Widget }>(p: Omit<Widget_choices_config<T>, 'multi'>) =>
        new Widget_choices(this, { multi: true, ...p })

    _FIX_INDENTATION = _FIX_INDENTATION

    /** (@internal); */
    _cache: { count: number } = { count: 0 }

    /** (@internal) will be set at builer creation, to allow for dyanmic recursive forms */
    _ROOT!: Widget_group<any>

    /** (@internal) advanced way to restore form state. used internally */
    _HYDRATE = (type: W.Widget['type'], input: any, serial?: any): any => {
        if (type === 'optional') return new Widget_optional(this, input, serial)
        if (type === 'bool') return new Widget_bool(this, input, serial)
        if (type === 'str') return new Widget_string(this, input, serial)
        if (type === 'prompt') return new Widget_prompt(this, input, serial)
        if (type === 'choices') return new Widget_choices(this, input, serial)
        if (type === 'number') return new Widget_number(this, input, serial)
        if (type === 'group') return new Widget_group(this, input, serial)
        if (type === 'color') return new Widget_color(this, input, serial)
        if (type === 'enum') return new Widget_enum(this, input, serial)
        if (type === 'list') return new Widget_list(this, input, serial)
        if (type === 'orbit') return new Widget_orbit(this, input, serial)
        if (type === 'listExt') return new Widget_listExt(this, input, serial)

        if (type === 'inlineRun') return new W.Widget_inlineRun(this, input, serial)
        if (type === 'seed') return new W.Widget_seed(this, input, serial)
        if (type === 'matrix') return new W.Widget_matrix(this, input, serial)
        if (type === 'loras') return new W.Widget_loras(this, input, serial)
        if (type === 'image') return new Widget_image(this, input, serial)
        if (type === 'selectOne') return new W.Widget_selectOne(this, input, serial)
        if (type === 'selectMany') return new W.Widget_selectMany(this, input, serial)
        if (type === 'size') return new Widget_size(this, input, serial)
        if (type === 'markdown') return new W.Widget_markdown(this, input, serial)
        if (type === 'custom') return new W.Widget_custom(this, input, serial)

        console.log(`🔴 unknown type ${type}`)
        exhaust(type)
    }
}
