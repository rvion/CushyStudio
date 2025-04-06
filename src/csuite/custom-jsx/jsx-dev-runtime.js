/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { jsxDEV as jsxDEV_ } from 'react/jsx-dev-runtime'

export { Fragment } from 'react/jsx-dev-runtime'

// type ClassLike = string | { [cls: string]: any } | null | undefined | boolean
export const toClassName = (tw /*: ClassLike[]*/) /*: string[]*/ => {
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
            out.push(toClassName(arg))
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

export function jsxDEV(type, props, key, isStaticChildren, source, self_) {
   const isSym = typeof type === 'symbol'
   const { tw, className, ...PROPS } = props
   if (!isSym) PROPS.className = tw ? className + ' '+ toClassName(tw) : className
   return jsxDEV_(type, PROPS, key, isStaticChildren, source, self_)
}
