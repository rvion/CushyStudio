/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { jsxDEV as jsxDEV_ } from 'react/jsx-dev-runtime'

export { Fragment } from 'react/jsx-dev-runtime'

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
    if (type.name) return '🔘' + type.name
    if (type.displayName) return '🔘' + type.displayName
    return extractComponentName(type.type) // recrusively descend into type, so we can go though HOCs, Memo, or even React Contexts
}

export function jsxDEV(type, props, key, isStaticChildren, source, self_) {
    const isSym = typeof type === 'symbol'
    const isPrim = typeof type === 'string'
    const $$cls = extractComponentName(type) // .name || type.displayName || null // (typeof type === 'string' ? type : 'Component')
    const { tw, className, $$clses, ...PROPS } = props
    if (isSym) {
        // do nothing
    } else if (isPrim) {
        PROPS.className = joinCls([$$clses, className, tw])
    } else {
        PROPS.className = joinCls([className, tw])
        if ($$cls && $$cls.endsWith('_')) {
            PROPS.$$clses = $$clses ? $$clses + ' ' + $$cls : $$cls
        }
    }
    return jsxDEV_(type, PROPS, key, isStaticChildren, source, self_)
}
