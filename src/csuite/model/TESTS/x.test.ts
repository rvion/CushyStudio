/* eslint-disable vitest/require-to-throw-message */
import { describe, expect, it } from 'vitest'

import { simpleBuilder as b } from '../../simple/SimpleFactory'
import { expectJSON } from './utils/expectJSON'

describe('default values', () => {
   const S1 = b.bool_()
   const S2 = b.fields({ x: b.bool_() })

   describe('createDraft', () => {
      it('works', () => {
         expect(() => S1.createDraft().zValidateOrNull()).not.toThrow()
         expect(S1.createDraft().zValidateOrNull()).toBeNull()
         expect(() => S1.createDraft().zValidateOrThrow()).toThrow()
      })
   })

   describe('schema.create', () => {
      it('should not throw time despite missing values', () => {
         const E1 = S1.create()
         expect(() => E1.zValue).toThrow()
         expect(E1.zValue_unchecked).toBeUndefined()
         expect(E1.zValue_or_zero).toBe(false)

         const E2 = S2.create()
         expect(() => E2.zValue).not.toThrow()
         expect(() => E2.zValue.x).toThrow()
         expect(() => E2.zToValueJSON()).toThrow()
      })
   })

   describe('schema.createOrThrowIfInvalid', () => {
      it('throw at creation time', () => {
         expect(() => S1.create().zValidateOrThrow()).toThrow()
      })

      it('throw at creation time (part 2)', () => {
         expect(() => S2.create().zValidateOrThrow()).toThrow()
      })
   })
})
