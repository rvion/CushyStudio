/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { jsx as jsx_, jsxs as jsxs_ } from 'react/jsx-runtime'

export { Fragment } from 'react/jsx-runtime'

// type ClassLike = string | { [cls: string]: any } | null | undefined | boolean
export const joinCls = (tw /*: ClassLike[]*/) /*: string[]*/ => {
    if (typeof tw === 'string') return tw
    if (Array.isArray(tw)) {
        const out /*: string[]*/ = []
        for (const arg of tw) {
            // skip null
            if (arg == null) continue

            // sub-string
            if (typeof arg === 'string') {
                // skip empty string
                if (arg === '') continue
                out.push(arg)
                continue
            }

            // sub-array
            if (Array.isArray(arg)) {
                out.push(joinCls(arg))
                continue
            }

            // sub-object
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

function extractComponentName(type) /* : Maybe<string> */ {
    if (type == null) return null // recursivity terminal condition
    if (typeof type === 'string') return null // discard 'div', 'span', etc.
    if (type.name) return type.name
    if (type.displayName) return type.displayName
    return extractComponentName(type.type) // recrusively descend into type, so we can go though HOCs, Memo, or even React Contexts
}

export function jsx(type, props, key) {
    const compName = extractComponentName(type) // .name || type.displayName || null // (typeof type === 'string' ? type : 'Component')
    const isSym = typeof type === 'symbol'
    const isPrim = typeof type === 'string'
    const compCls = compName ? `🔘${compName}` : null // 'UI-'
    const { tw, className, data__ux: ux, ...rest } = props
    const PROPS = isSym
        ? rest
        : isPrim
          ? {
                ...rest,
                // UX_: [...rest.UX, compCls],
                className: joinCls([ux, className, tw]),
            }
          : {
                ...rest,
                data__ux: ux ? [...ux, compCls] : [compCls],
                className: joinCls([className, tw]),
            }
    return jsx_(type, PROPS, key)
}

export function jsxs(type, props, key) {
    const compName = extractComponentName(type) // .name || type.displayName || null // (typeof type === 'string' ? type : 'Component')
    const isSym = typeof type === 'symbol'
    const isPrim = typeof type === 'string'
    const compCls = compName ? `🔘${compName}` : null // 'UI-'
    const { tw, className, data__ux: ux, ...rest } = props
    const PROPS = isSym
        ? rest
        : isPrim
          ? {
                ...rest,
                // UX_: [...rest.UX, compCls],
                className: joinCls([ux, className, tw]),
            }
          : {
                ...rest,
                data__ux: ux ? [...ux, compCls] : [compCls],
                className: joinCls([className, tw]),
            }
    return jsxs_(type, PROPS, key)
}
