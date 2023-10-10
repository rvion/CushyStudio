// import { jsx as jsx, jsxs as jsxs } from '@emotion/react/jsx-runtime'

export { Fragment } from 'react/jsx-runtime'
import { jsx as jsx_, jsxs as jsxs_ } from 'react/jsx-runtime'

export function jsx(type, props, key) {
    if (!hasOwnProperty.call(props, 'tw')) return jsx_(type, props, key)
    // Merge 'tw' with ‘className’
    const className = props.className ? `${props.className} ${props.tw}` : props.tw
    // Remove 'tw' from props and add updated ‘className’
    const newProps = { ...props, className, tw: undefined }
    return jsx_(type, newProps, key)
}

export function jsxs(type, props, key) {
    if (!hasOwnProperty.call(props, 'tw')) return jsxs_(type, props, key)
    // Merge 'tw' with ‘className’
    const className = props.className ? `${props.className} ${props.tw}` : props.tw
    // Remove 'tw' from props and add updated ‘className’
    const newProps = { ...props, className, tw: undefined }
    return jsxs_(type, newProps, key)
}
