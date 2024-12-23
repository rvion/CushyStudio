import type { Field } from '../model/Field'

import { runInAction } from 'mobx'

import { defineFieldMixin } from '../model/defineFieldMixin'

export type TraversalMixin = typeof TraversalMixinImpl
export type TraverseSignal = 'stop' | 'abort' | void

export const TraversalMixinImpl = defineFieldMixin({
    /** @since 2024-10-07 */
    traverse(
        fn: (c: Field) => TraverseSignal,
        p: {
            /** default to depth-first (les memory usage, usually more logical) */
            order?: 'depth-first' | 'breadth-first'

            /* default to 'active */
            cover?: 'active' | 'all'
        },
    ): void {
        if (p.order === 'depth-first' && p.cover === 'active') return this.traverseDepthFirst(fn)
        if (p.order === 'breadth-first' && p.cover === 'active') return this.traverseBreadthFirst(fn)
        if (p.order === 'depth-first' && p.cover === 'all') return this.traverseAllDepthFirst(fn)
        if (p.order === 'breadth-first' && p.cover === 'all') return this.traverseAlltraverseBreadthFirst(fn)
        return this.traverseDepthFirst(fn)
    },

    // 💬 2024-12-04 rvion: legacy non-abortable traversals

    // | /** @since 2024-10-07 */
    // | traverseDepthFirst(fn: (c: Field) => TraverseSignal): void {
    // |     runInAction(() => {
    // |         const shouldEnterChildren = fn(this)
    // |         if (shouldEnterChildren === 'stop') return
    // |         for (const child of this.childrenActive) {
    // |             child.traverseDepthFirst(fn)
    // |         }
    // |     })
    // | },

    // |  /** @since 2024-10-07 */
    // |  traverseAllDepthFirst(fn: (c: Field) => TraverseSignal): void {
    // |      runInAction(() => {
    // |          const shouldEnterChildren = fn(this)
    // |          if (shouldEnterChildren === 'stop') return
    // |          for (const child of this.childrenAll) {
    // |              child.traverseAllDepthFirst(fn)
    // |          }
    // |      })
    // |  },

    /** @since 2024-10-07 */
    traverseDepthFirst(fn: (c: Field) => TraverseSignal): void {
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
                    for (let i = current.childrenActive.length - 1; i >= 0; i--) {
                        stack.push(current.childrenActive[i]!)
                    }
                }
            }
        })
    },

    /** @since 2024-10-07 */
    traverseAllDepthFirst(fn: (c: Field) => TraverseSignal): void {
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
                    for (let i = current.childrenAll.length - 1; i >= 0; i--) {
                        stack.push(current.childrenAll[i]!)
                    }
                }
            }
        })
    },

    /** @since 2024-10-07 */
    traverseBreadthFirst(fn: (c: Field) => TraverseSignal): void {
        runInAction(() => {
            const queue: Field[] = [this]
            while (queue.length > 0) {
                const current = queue.shift()!
                const shouldEnterChildren = fn(current)
                if (shouldEnterChildren === 'abort') return
                if (shouldEnterChildren !== 'stop') {
                    queue.push(...current.childrenActive)
                }
            }
        })
    },
    /** @since 2024-10-07 */
    traverseAlltraverseBreadthFirst(fn: (c: Field) => TraverseSignal): void {
        runInAction(() => {
            const queue: Field[] = [this]
            while (queue.length > 0) {
                const current = queue.shift()!
                const shouldEnterChildren = fn(current)
                if (shouldEnterChildren === 'stop') return
                queue.push(...current.childrenAll)
            }
        })
    },
})

export const TraversalMixinDescriptors = Object.getOwnPropertyDescriptors(TraversalMixinImpl)
