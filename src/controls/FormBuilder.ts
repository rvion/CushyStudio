import type { ImageL, ImageT } from 'src/models/Image'
import type { Requestable } from './InfoRequest'
import type * as R from './InfoRequest'

// prettier-ignore
export class FormBuilder {
    /** str */
    string =    (p: Omit<R.Requestable_str,       'type'>): R.Requestable_str      => ({ type: 'str',  ...p })
    stringOpt = (p: Omit<R.Requestable_strOpt,    'type'>): R.Requestable_strOpt   => ({ type: 'str?', ...p })

    str =       (p: Omit<R.Requestable_str,       'type'>): R.Requestable_str      => ({ type: 'str',  ...p })
    strOpt =    (p: Omit<R.Requestable_strOpt,    'type'>): R.Requestable_strOpt   => ({ type: 'str?', ...p })

    prompt =    (p: Omit<R.Requestable_prompt,    'type'>): R.Requestable_prompt   => ({ type: 'prompt',  ...p })
    promptOpt = (p: Omit<R.Requestable_promptOpt, 'type'>): R.Requestable_promptOpt=> ({ type: 'prompt?', ...p })

    /** nums */
    int =       (p: Omit<R.Requestable_int,       'type'>): R.Requestable_int      => ({ type: 'int',  ...p })
    intOpt =    (p: Omit<R.Requestable_intOpt,    'type'>): R.Requestable_intOpt   => ({ type: 'int?', ...p })

    float =     (p: Omit<R.Requestable_float,     'type'>): R.Requestable_float    => ({ type: 'float',  ...p })
    floatOpt =  (p: Omit<R.Requestable_floatOpt,  'type'>): R.Requestable_floatOpt => ({ type: 'float?', ...p })

    number =    (p: Omit<R.Requestable_float,     'type'>): R.Requestable_float    => ({ type: 'float',  ...p })
    numberOpt = (p: Omit<R.Requestable_floatOpt,  'type'>): R.Requestable_floatOpt => ({ type: 'float?', ...p })

    matrix    = (p: Omit<R.Requestable_matrix,    'type'>): R.Requestable_matrix   => ({ type: 'matrix', ...p })
    /** bools */
    boolean =   (p: Omit<R.Requestable_bool,      'type'>): R.Requestable_bool => ({ type: 'bool' as const, ...p })
    bool =      (p: Omit<R.Requestable_bool,      'type'>): R.Requestable_bool => ({ type: 'bool' as const, ...p })
    boolOpt =   (p: Omit<R.Requestable_boolOpt,   'type'>) => ({ type: 'bool?' as const, ...p })

    /** embedding */
    embeddings = (label?: string) => ({ type: 'embeddings' as const, label })

    /** embedding */
    enum = <const T extends keyof Requirable>(
        //
        x: Omit<R.Requestable_enum<T>, 'type'>,
    ): R.Requestable_enum<T> => ({
        type: 'enum',
        ...x,
    })
    enumOpt = <const T extends keyof Requirable>(
        x: Omit<R.Requestable_enumOpt<T>, 'type'>,
    ): R.Requestable_enumOpt<T> => ({
        type: 'enum?',
        ...x,
    })

    /** loras */
    // lora = (label?: string) => ({ type: 'lora' as const, label })
    loras = (p: Omit<R.Requestable_loras, 'type'>) => ({ type: 'loras' as const, ...p })

    /** painting */
    private _toImageInfos = () => {}
    samMaskPoints = (label: string, img: ImageL | ImageT) => ({
        type: 'samMaskPoints' as const,
        imageInfo: toImageInfos(img),
    })
    image = (p: Omit<R.Requestable_image, 'type'>): R.Requestable_image => ({
        type: 'image' as const,
        ...p,
    })
    imageOpt = (p: Omit<R.Requestable_imageOpt, 'type'>): R.Requestable_imageOpt => ({
        type: 'image?' as const,
        ...p,
    })
    manualMask = (label: string, img: ImageL | ImageT) => ({
        type: 'manualMask' as const,
        label,
        imageInfo: toImageInfos(img),
    })
    paint = (label: string, url: string) => ({ type: 'paint' as const, label, url })

    /** optional group */
    groupOpt = <const T extends { [key: string]: Requestable }>(
        p: Omit<R.Requestable_itemsOpt<T>, 'type'>,
    ): R.Requestable_itemsOpt<T> => ({ type: 'items?', ...p })

    // group
    group = <const T extends { [key: string]: Requestable }>(
        p: Omit<R.Requestable_items<T>, 'type'>,
    ): R.Requestable_items<T> => ({ type: 'items', ...p })

    // group
    list = <const T extends Requestable>(
        p: Omit<R.Requestable_list<T>, 'type'>,
    ): R.Requestable_list<T> => ({ type: 'list', ...p })

    /** select one */
    selectOne = <const T>(label: string, choices: T): { type: 'selectOne'; choices: T } => ({ type: 'selectOne', choices })
    selectOneOrCustom = (label: string, choices: string[]): { type: 'selectOneOrCustom'; choices: string[] } => ({
        type: 'selectOneOrCustom',
        choices,
    })

    /** select many */
    selectMany = <const T>(label: string, choices: T): { type: 'selectMany'; choices: T } => ({ type: 'selectMany', choices })
    selectManyOrCustom = (label: string, choices: string[]): { type: 'selectManyOrCustom'; choices: string[] } => ({
        type: 'selectManyOrCustom',
        choices,
    })
}

// -------------
type ImageInBackend = ImageL | ImageT
export const toImageInfos = (img: ImageInBackend): ImageT => {
    try {
        return (img as any).toJSON ? (img as any).toJSON() : img
    } catch (error) {
        console.info('🔴 UNRECOVERABLE ERROR 🔴' + JSON.stringify(img))
        throw error
    }
}
