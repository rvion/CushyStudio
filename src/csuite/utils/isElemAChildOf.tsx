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
