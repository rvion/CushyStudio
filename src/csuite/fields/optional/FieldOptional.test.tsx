import { describe, expect, it } from 'vitest'

import { simpleBuilder } from '../../simple/SimpleFactory'

const b = simpleBuilder

describe('FieldOptional', () => {
   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const E1 = b.number({ default: 5 }).optional().create()
            const E2 = b.number({ default: 6 }).optional().create()

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const schema = b.number({ default: 5 }).optional()
            const E1 = schema.create()
            const E2 = schema.create()

            E1.value = 8
            E2.value = 8

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const schema = b.number({ default: 5 }).optional()
            const E1 = schema.create()
            const E2 = schema.create()

            E1.value = 8

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const schema = b.number({ default: 5 }).optional()
            const E1 = schema.create()
            const E2 = schema.create()

            E1.value = 8
            E2.value = 9

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should change the active state to inactive', () => {
         const schema = b.number({ default: 5 }).optional()
         const E1 = schema.create()
         const E2 = schema.create()

         E1.setActive(false)

         const patches = E1.generatePatches(E2)

         E2.applyPatches(patches)

         expect(E2.active).toBe(false)
      })

      it('should change the active state to active', () => {
         const schema = b.number({ default: 5 }).optional()
         const E1 = schema.create()
         const E2 = schema.create()

         E1.value = 8

         const patches = E1.generatePatches(E2)

         E2.applyPatches(patches)

         expect(E2.active).toBe(true)
         expect(E2.value).toBe(8)
      })

      it('should patch the child when active has the same value', () => {
         const schema = b.number({ default: 5 }).optional(true)
         const E1 = schema.create()
         const E2 = schema.create()

         E1.value = 8
         E2.value = 5

         const patches = E1.generatePatches(E2)

         E2.applyPatches(patches)

         expect(E2.value).toBe(8)
      })
   })
})
