import { type Assertion, expect } from 'vitest'

import { naiveDeepClone } from '../../../utils/naiveDeepClone'
import { potatoClone } from '../../../utils/potatoClone'

export function expectJSON<T>(a: T): Assertion<T> {
   return expect(naiveDeepClone(a))
}

export function expectPotato<T>(a: T): Assertion<T> {
   return expect(potatoClone(a))
}
