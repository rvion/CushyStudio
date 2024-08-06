/** check if an element is a child of given selector */
export function isElemAChildOf(
    //
    elem: Element | null,
    domSelector: string,
): boolean {
    let at: Maybe<Element> = elem
    while (at) {
        if (at.matches(domSelector)) return true
        at = at.parentElement
    }
    return false
}
