export { Fragment } from 'react/jsx-dev-runtime'
import { jsxDEV as jsxDEV_ } from 'react/jsx-dev-runtime'

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

export function jsxDEV(type, props, key, isStaticChildren, source, self) {
    if (!hasOwnProperty.call(props, 'tw')) return jsxDEV_(type, props, key, isStaticChildren, source, self)
    const className = props.className ? `${props.className} ${joinCls(props.tw)}` : joinCls(props.tw)
    const newProps = { ...props, className, tw: undefined }
    return jsxDEV_(type, newProps, key, isStaticChildren, source, self)
}
