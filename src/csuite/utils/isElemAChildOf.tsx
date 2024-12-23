/** check if an element is a child of given selector */
export function isElemAChildOf(
   //
   elem: Element | null,
   domSelector: string,
): boolean {
   let at: Maybe<Element> = elem
   // In tests, at.matches is not working in every case
   while (at && at.matches) {
      if (at.matches(domSelector)) return true
      at = at.parentElement
   }
   return false
}
