import type { CurrentStyle } from './CurrentStyleCtx'

import { Box } from './Box'

export const compileBoxClassName = (
    /** the current style retrieved from the `CurrentStyleCtx` */
    current: CurrentStyle,
    /** how the box wants to be displayed, mix of "absolute" and "relative" instructions */
    instructions: Box,
) => {
    // the idea is to merge make the whole instruction compiled to some stable CSS
    // className that will remain stable no matter what the context is
    // const hash [JSONl.stringi]
    // TODO
}
