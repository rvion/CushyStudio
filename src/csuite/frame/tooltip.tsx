import { observable } from 'mobx'

export const tooltipStuff: {
    tooltip: Maybe<{
        ref: Element
        text: string
    }>
} = observable({
    tooltip: null,
})
