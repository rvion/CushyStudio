export { Fragment } from 'react/jsx-dev-runtime'
import { jsxDEV as jsxDEV_ } from 'react/jsx-dev-runtime'

export function jsxDEV(type, props, key, isStaticChildren, source, self) {
    if (!hasOwnProperty.call(props, 'tw')) return jsxDEV_(type, props, key, isStaticChildren, source, self)
    // Merge 'tw' with ‘className’
    const className = props.className ? `${props.className} ${props.tw}` : props.tw
    // Remove 'tw' from props and add updated ‘className’
    const newProps = { ...props, className, tw: undefined }
    return jsxDEV_(type, newProps, key, isStaticChildren, source, self)
}
