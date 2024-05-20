import { jsxDEV as jsxDEV_ } from 'react/jsx-dev-runtime'

export { Fragment } from 'react/jsx-dev-runtime'

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

export function jsxDEV(type, props, key, isStaticChildren, source, self_) {
    // case 1: no tw
    if (props.tw == null) return jsxDEV_(type, props, key, isStaticChildren, source, self_)

    const { tw, className, ...rest } = props
    // case 2: tw + className
    if (className)
        return jsxDEV_(type, { ...rest, className: `${className} ${joinCls(tw)}` }, key, isStaticChildren, source, self_)

    // case 3: just tw
    return jsxDEV_(type, { ...rest, className: joinCls(tw) }, key, isStaticChildren, source, self_)
}
