import type { IWidget, IWidgetMixins } from './IWidget'
import type { FC } from 'react'

import { observer } from 'mobx-react-lite'

import { WidgetWithLabelUI } from './shared/WidgetWithLabelUI'

/** make sure the user-provided function will properly react to any mobx changes */
const ensureObserver = <T extends null | undefined | FC<any>>(fn: T): T => {
    if (fn == null) return null as T
    const isObserver = '$$typeof' in fn && fn.$$typeof === Symbol.for('react.memo')
    const FmtUI = (isObserver ? fn : observer(fn)) as T
    return FmtUI
}

/**
 * Widget Mixin immplementation (see `IWidgetMixins` for documentation)
 *
 * /!\ Mixin method documentation should go in on the type `IWidgetMixins`
 * directly (in file `src/controls/IWidget.ts`). comments here won't be
 * displayed to users.
 *
 */
const mixin: IWidgetMixins = {
    // BUMP ----------------------------------------------------
    bumpSerial(this: IWidget) {
        this.form.serialChanged(this)
    },

    // 💬 2024-03-15 rvion: use this regexp to quickly review manual serial set patterns
    // | `serial\.[a-zA-Z_]+(\[[a-zA-Z_]+\])? = `
    bumpValue(this: IWidget) {
        this.serial.lastUpdatedAt = Date.now() as Timestamp
        this.form.valueChanged(this)
    },

    // FOLD ----------------------------------------------------
    setCollapsed(this: IWidget, val?: boolean) {
        if (this.serial.collapsed === val) return
        this.serial.collapsed = val
        this.form.serialChanged(this)
    },

    toggleCollapsed(this: IWidget) {
        this.serial.collapsed = !this.serial.collapsed
        this.form.serialChanged(this)
    },

    // UI ----------------------------------------------------
    ui(this: IWidget): JSX.Element {
        return <WidgetWithLabelUI widget={this} rootKey='_' />
    },

    defaultHeader(this: IWidget): JSX.Element | undefined {
        if (this.DefaultHeaderUI == null) return
        return <this.DefaultHeaderUI widget={this} />
    },

    defaultBody(this: IWidget): JSX.Element | undefined {
        if (this.DefaultBodyUI == null) return
        return <this.DefaultBodyUI widget={this} />
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
// ⏸️ /** @deprecated */
// ⏸️ export const applyWidgetMixin = (self: IWidget) => {
// ⏸️     extendObservable(self, mixin)
// ⏸️ }

// v2 ------------------------------------------------------
const descriptors = Object.getOwnPropertyDescriptors(mixin)
export const applyWidgetMixinV2 = (self: IWidget) => {
    Object.defineProperties(self, descriptors)
}
