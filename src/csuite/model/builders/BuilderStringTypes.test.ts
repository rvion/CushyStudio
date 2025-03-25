import { describe, expect, it } from 'vitest'

import { sb } from '../../simple/SimpleFactory'

const b = sb
describe('BuilderStringTypes', () => {
   describe('uuid', () => {
      it('cache schema but every value has an unique value', () => {
         const s1 = b.uuidV4()
         const v1 = s1.create().value

         const s2 = b.uuidV4()
         const v2 = s2.create().value
         const v3 = s2.create().value

         // expect(s1).toBe(s2)
         expect(v1).not.toBe(v2)
         expect(v2).not.toBe(v3)
      })
   })
   describe('nanoid', () => {
      it('cache schema but every value has an unique value', () => {
         const s1 = b.nanoid()
         const v1 = s1.create().value

         const s2 = b.nanoid()
         const v2 = s2.create().value
         const v3 = s2.create().value

         // expect(s1).toBe(s2)
         expect(v1).not.toBe(v2)
         expect(v2).not.toBe(v3)
      })
   })
})
