/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { jsx as jsx_, jsxs as jsxs_ } from 'react/jsx-runtime'

export { Fragment } from 'react/jsx-runtime'

// type ClassLike = string | { [cls: string]: any } | null | undefined | boolean
export const joinCls = (tw /*: ClassLike[]*/) /*: string[]*/ => {
    if (typeof tw === 'string') return tw
    if (Array.isArray(tw)) {
        const out /*: string[]*/ = []
        for (const arg of tw) {
            if (arg == null) continue
            if (typeof arg === 'string') out.push(arg)
            if (typeof arg === 'object') {
                for (const key of Object.keys(arg)) {
                    if (arg[key]) out.push(key)
                }
            }
        }
        return out.join(' ')
    }
    return ''
}

export function jsx(type, props, key) {
    // case 1: no tw
    if (props.tw == null) return jsx_(type, props, key)

    const { tw, className, ...rest } = props
    // case 2: tw + className
    if (className) return jsx_(type, { ...rest, className: `${className} ${joinCls(tw)}` }, key)

    // case 3: just tw
    return jsx_(type, { ...rest, className: joinCls(tw) }, key)
}

export function jsxs(type, props, key) {
    // case 1: no tw
    if (props.tw == null) return jsxs_(type, props, key)

    const { tw, className, ...rest } = props
    // case 2: tw + className
    if (className) return jsxs_(type, { ...rest, className: `${className} ${joinCls(tw)}` }, key)

    // case 3: just tw
    return jsxs_(type, { ...rest, className: joinCls(tw) }, key)
}
