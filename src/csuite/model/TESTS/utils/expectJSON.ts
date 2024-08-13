import { expect, type Matchers } from 'bun:test'

import { naiveDeepClone } from '../../../utils/naiveDeepClone'
import { potatoClone } from '../../../utils/potatoClone'

export function expectJSON(a: any): Matchers<any> {
    return expect(naiveDeepClone(a))
}

export function expectPotato(a: any): Matchers<any> {
    return expect(potatoClone(a))
}
