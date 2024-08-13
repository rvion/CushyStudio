/** return the depth of a DOM element in the DOM tree */
export function getDOMElementDepth(element: Element): number {
    let depth = 0

    while (element.parentElement) {
        element = element.parentElement
        depth++
    }

    return depth
}
