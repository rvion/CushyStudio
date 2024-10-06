import { describe, expect, it } from 'bun:test'

import { checkLambdaOrCtor } from './checkLambdaOrCtor'

describe('checkLambdaOrCtor', () => {
    it('should return "ctor" for a class', () => {
        class A {}
        expect(checkLambdaOrCtor(A)).toBe('ctor')
    })

    it('should return "closure" for a function', () => {
        const f = (): void => {}
        expect(checkLambdaOrCtor(f)).toBe('closure')
    })
})
