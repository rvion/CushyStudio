import type { IWidget, IWidgetMixins } from './IWidget'
import type { FC } from 'react'

import { extendObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

import { WidgetWithLabelUI } from './shared/WidgetWithLabelUI'

/** make sure the user-provided function will properly react to any mobx changes */
const ensureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
    if (fn == null) return null as T
    const isObserver = '$$typeof' in fn && fn.$$typeof === Symbol.for('react.memo')
    const FmtUI = (isObserver ? fn : observer(fn)) as T
    return FmtUI
}

const mixin: IWidgetMixins = {
    // test: 78,

    ui(this: IWidget): JSX.Element {
        return <WidgetWithLabelUI widget={this} rootKey='_' />
    },

    defaultHeader(this: IWidget): JSX.Element | undefined {
        if (this.DefaultHeaderUI == null) return
        return <this.DefaultHeaderUI widget={this} />
    },

    defaultBody(this: IWidget): JSX.Element | undefined {
        if (this.DefaultHeaderUI == null) return
        return <this.DefaultHeaderUI widget={this} />
    },

    header(this: IWidget): JSX.Element | undefined {
        const HeaderUI =
            'header' in this.config //
                ? ensureObserver(this.config.header)
                : this.DefaultHeaderUI
        if (HeaderUI == null) return
        return <HeaderUI widget={this} />
    },

    body(this: IWidget): JSX.Element | undefined {
        const BodyUI =
            'body' in this.config //
                ? ensureObserver(this.config.body)
                : this.DefaultBodyUI
        if (BodyUI == null) return
        return <BodyUI widget={this} />
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
