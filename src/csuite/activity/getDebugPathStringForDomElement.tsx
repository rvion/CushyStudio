export const getDebugPathStringForDomElement = (node: Maybe<Element>): string => {
   const path: string[] = []
   if (node === null) return '✅'
   let at: Maybe<Element> = node
   while (at != null) {
      path.unshift(at.tagName.toLowerCase())
      at = at.parentElement
   }
   return path.join(' > ')
}
