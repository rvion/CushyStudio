import { type IReactionOptions, reaction, runInAction } from 'mobx'
import { type DependencyList, useEffect } from 'react'

export function useReaction(
   expression: () => void,
   effect: () => void,
   options?: IReactionOptions<any, any>,
   deps?: DependencyList,
): void {
   useEffect(() => {
      return reaction(expression, effect, options)
   }, deps)
}
