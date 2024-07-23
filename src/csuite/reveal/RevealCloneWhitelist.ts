import type { FC } from 'react'

export const whitelistedClonableComponents = new WeakSet<any>()
export function registerComponentAsClonableWhenInsideReveal(comp: FC<any>): void {
    whitelistedClonableComponents.add(comp)
}
