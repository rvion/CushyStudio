import type { Kolor } from '../kolor/Kolor'
import type { CurrentStyle } from './CurrentStyleCtx'

export type BoxProps = {
    /**
     * - string: absolute color
     * - relative: relative to parent
     * - number: = relative({ contrast: x / 100, chromaBlend: 1, hueShift: 0 })
     * - boolean: = contrast=0
     * - null: inherit parent's background
     * */
    base?: Kolor | string | number
    /**
     * @default { contrast: 1, chromaBlend: 1, hueShift: 0}
     * relative to base; when relative, carry to children as default strategy */
    text?: Kolor | string
    textShadow?: Kolor | string

    // TBD ❌
    shadow?: Kolor | string

    /**
     * - string: absolute color
     * - relative: relative to parent
     * - number: = relative({ contrast: x / 10 })
     * - boolean: = relative({ contrast: 0.2 })
     * - null: inherit parent's background
     * */
    border?: Kolor | string | number | boolean

    // 🔴 BAD
    /** if true; will add some contrast on hover */
    hover?: boolean | number
}

export const compileBoxClassName = (
    /** the current style retrieved from the `CurrentStyleCtx` */
    current: CurrentStyle,
    /** how the box wants to be displayed, mix of "absolute" and "relative" instructions */
    instructions: BoxProps,
) => {
    // the idea is to merge make the whole instruction compiled to some stable CSS
    // className that will remain stable no matter what the context is
    // const hash [JSONl.stringi]
    // TODO
}
