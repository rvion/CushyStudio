import type { RevealPlacement } from '../reveal/RevealPlacement'

import { observable } from 'mobx'

export const tooltipStuff: {
    tooltip: Maybe<{
        ref: Element
        text: string
        placement: RevealPlacement
    }>
} = observable({
    tooltip: null,
})
