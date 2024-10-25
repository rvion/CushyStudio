import { describe, expect, it } from 'bun:test'

import { mergeDefined } from './mergeDefined'

describe('mergeDefined', () => {
   it('works', () => {
      const base: {
         a?: Maybe<number>
         b?: Maybe<number>
         c?: Maybe<number>
      } = { a: 1, b: 2 }

      expect(mergeDefined(base, {})).toEqual(base)
      expect(mergeDefined(base, {})).toBe(base)
      expect(mergeDefined(base, { a: undefined })).toEqual(base)
      expect(mergeDefined(base, { a: undefined })).toBe(base)
      expect(mergeDefined(base, { a: undefined, c: undefined })).toBe(base)

      expect(mergeDefined(base, { c: null })).not.toEqual(base)
      expect(mergeDefined(base, { c: undefined })).toEqual(base)

      expect(mergeDefined(base, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
      expect(mergeDefined(base, { c: 3 }, { c: undefined })).toEqual({ a: 1, b: 2, c: 3 })

      // regular assign remove stuff when property is undefined
      expect({ ...base, ...{ b: undefined } } as any).toEqual({ a: 1 })
      expect(Object.assign({ a: 1 }, { a: undefined } as any)).toEqual({ a: undefined })
   })
})
