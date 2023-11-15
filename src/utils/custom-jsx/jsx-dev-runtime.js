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
    if (
        !hasOwnProperty.call(props, 'tw') && //
        !hasOwnProperty.call(props, 'x')
    )
        return jsxDEV_(type, props, key, isStaticChildren, source, self)
    let className = props.className ?? ''
    if (props.tw) className += ' ' + joinCls(props.tw)
    if (props.x) className += ' ' + joinCls(props.x)
    const newProps = { ...props, className, tw: undefined, x: undefined }
    return jsxDEV_(type, newProps, key, isStaticChildren, source, self)
}
