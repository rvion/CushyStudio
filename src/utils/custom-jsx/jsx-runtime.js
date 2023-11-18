export { Fragment } from 'react/jsx-runtime'
import { jsx as jsx_, jsxs as jsxs_ } from 'react/jsx-runtime'

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
    if (
        !hasOwnProperty.call(props, 'tw') // && //
        // !hasOwnProperty.call(props, 'x')
    )
        return jsx_(type, props, key)
    let className = props.className ?? ''
    if (props.tw) className += ' ' + joinCls(props.tw)
    // if (props.x) className += ' ' + joinCls(props.x)

    const newProps = { ...props, className, tw: undefined }
    return jsx_(type, newProps, key)
}

export function jsxs(type, props, key) {
    if (
        !hasOwnProperty.call(props, 'tw') // && //
        // !hasOwnProperty.call(props, 'x')
    )
        return jsxs_(type, props, key)
    let className = props.className ?? ''
    if (props.tw) className += ' ' + joinCls(props.tw)
    // if (props.x) className += ' ' + joinCls(props.x)

    const newProps = { ...props, className, tw: undefined }
    return jsxs_(type, newProps, key)
}
