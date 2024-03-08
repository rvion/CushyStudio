import type { IWidget, IWidgetMixins } from './IWidget'

import { extendObservable } from 'mobx'

import { WidgetWithLabelUI } from './shared/WidgetWithLabelUI'

const mixin: IWidgetMixins = {
    test: 78,

    ui(this: IWidget): JSX.Element {
        return <WidgetWithLabelUI widget={this} rootKey='_' />
    },

    body(this: IWidget): JSX.Element | undefined {
        if (this.BodyUI == null) return
        return <this.BodyUI widget={this} />
    },

    header(this: IWidget): JSX.Element | undefined {
        if (this.HeaderUI == null) return
        return <this.HeaderUI widget={this} />
    },
}

// v1 ------------------------------------------------------
/** @deprecated */
export const applyWidgetMixin = (self: IWidget) => {
    extendObservable(self, mixin)
}

// v2 ------------------------------------------------------
const descriptors = Object.getOwnPropertyDescriptors(mixin)
export const applyWidgetMixinV2 = (self: IWidget) => {
    Object.defineProperties(self, descriptors)
}
