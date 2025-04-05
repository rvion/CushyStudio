import type { Field } from '../model/Field'

import { runInAction } from 'mobx'

import { defineFieldMixin } from '../model/defineFieldMixin'

export type TraversalMixin = typeof TraversalMixinImpl
export type TraverseSignal = 'stop' | 'abort' | void

export const TraversalMixinImpl = defineFieldMixin({
   zTraverse(
      fn: (c: Field) => TraverseSignal,
      p: {
         /** default to depth-first (les memory usage, usually more logical) */
         order?: 'depth-first' | 'breadth-first'

         /* default to 'active */
         cover?: 'active' | 'all'
      },
   ): void {
      if (p.order === 'depth-first' && p.cover === 'active') return this.zTraverseDepthFirst(fn)
      if (p.order === 'breadth-first' && p.cover === 'active') return this.zTraverseBreadthFirst(fn)
      if (p.order === 'depth-first' && p.cover === 'all') return this.zTraverseAllDepthFirst(fn)
      if (p.order === 'breadth-first' && p.cover === 'all') return this.zTraverseAlltraverseBreadthFirst(fn)
      return this.zTraverseDepthFirst(fn)
   },

   zTraverseDepthFirst(fn: (c: Field) => TraverseSignal): void {
      runInAction(() => {
         const stack: Field[] = [this]

         while (stack.length > 0) {
            const current = stack.pop()!
            const result = fn(current)
            if (result === 'abort') {
               return
            }

            if (result !== 'stop') {
               // Push children in reverse order to maintain left-to-right traversal
               for (let i = current.zChildrenActive.length - 1; i >= 0; i--) {
                  stack.push(current.zChildrenActive[i]!)
               }
            }
         }
      })
   },

   zTraverseAllDepthFirst(fn: (c: Field) => TraverseSignal): void {
      runInAction(() => {
         const stack: Field[] = [this]

         while (stack.length > 0) {
            const current = stack.pop()!
            const result = fn(current)
            if (result === 'abort') {
               return // Immediately halt traversal
            }

            if (result !== 'stop') {
               // Push all children in reverse order
               for (let i = current.zChildrenAll.length - 1; i >= 0; i--) {
                  stack.push(current.zChildrenAll[i]!)
               }
            }
         }
      })
   },

   zTraverseBreadthFirst(fn: (c: Field) => TraverseSignal): void {
      runInAction(() => {
         const queue: Field[] = [this]
         while (queue.length > 0) {
            const current = queue.shift()!
            const shouldEnterChildren = fn(current)
            if (shouldEnterChildren === 'abort') return
            if (shouldEnterChildren !== 'stop') {
               queue.push(...current.zChildrenActive)
            }
         }
      })
   },
   zTraverseAlltraverseBreadthFirst(fn: (c: Field) => TraverseSignal): void {
      runInAction(() => {
         const queue: Field[] = [this]
         while (queue.length > 0) {
            const current = queue.shift()!
            const shouldEnterChildren = fn(current)
            if (shouldEnterChildren === 'stop') return
            queue.push(...current.zChildrenAll)
         }
      })
   },
})

export const TraversalMixinDescriptors = Object.getOwnPropertyDescriptors(TraversalMixinImpl)
