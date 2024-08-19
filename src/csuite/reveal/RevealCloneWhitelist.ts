import type { FC } from 'react'

export const whitelistedClonableComponents = new WeakSet<any>()

/**
 * THIS OPTIMIZATION IS NOT RECOMMENDED
 * it is very cool, but quite dangerous.
 * 🔶 you need to make sure your compoenent will properly forward all of its props ! 🔶
 */
export function registerComponentAsClonableWhenInsideReveal(comp: FC<any>): void {
    whitelistedClonableComponents.add(comp)
}
