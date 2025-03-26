export function getFirstFocusableChild(
   element: HTMLElement,
   filter?: (el: HTMLElement) => boolean,
): HTMLElement | null {
   const inputsLike = (
      [...element.querySelectorAll('input, textarea, select, [contenteditable="true"]')] as HTMLElement[]
   ).filter((el: HTMLElement) => {
      const tabindex = el.getAttribute('tabindex')
      return (
         !(el as HTMLInputElement).disabled &&
         !el.hasAttribute('hidden') &&
         el.offsetParent !== null && // Excludes hidden elements
         (tabindex === null || parseInt(tabindex, 10) >= 0) && // Excludes tabindex="-1"
         (filter === undefined || filter(el))
      )
   })

   return inputsLike[0] ?? null
}
