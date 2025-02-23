import { describe, expect, it } from 'vitest'

import { naiveDeepClone } from '../utils/naiveDeepClone'
import { toJSONError } from './toJSONError'

describe('convertThrownObjectToDict', () => {
   // prettier-ignore
   // eslint-disable-next-line vitest/expect-expect
   it('works with everything', () => {
        assertCanBeTransformedToErrorDict('test')
        assertCanBeTransformedToErrorDict(1)
        assertCanBeTransformedToErrorDict(['foo','bar'])
        assertCanBeTransformedToErrorDict({foo:new Date()})

        class FooBar{ x = new Set([1,2,3]) } // prettier-ignore
        assertCanBeTransformedToErrorDict(new FooBar())
        assertCanBeTransformedToErrorDict(FooBar)
        assertCanBeTransformedToErrorDict(new Error())
        assertCanBeTransformedToErrorDict(new Error('A'))
        assertCanBeTransformedToErrorDict(new Error('B' ,{cause:'B1'}))

        class ErrorCustom extends Error{
            constructor(public customField: string, public bar: Set<string>){
                super('test')
            }
        }
        assertCanBeTransformedToErrorDict(new ErrorCustom('test',new Set(['1','2','3'])))


    })
})

function assertCanBeTransformedToErrorDict(thrown: unknown): void {
   const dict = toJSONError(thrown)
   expect(typeof dict).toBe('object')
   expect(dict).toMatchObject(naiveDeepClone(dict))
   // console.log(`[🤠]`, JSON.stringify(dict, null, 4))
}
