import type { Field_number } from '../number/FieldNumber'

import { describe, expect, it, vitest } from 'vitest'

import { simpleBuilder } from '../../simple/SimpleFactory'
import { Field_optional, type Field_optional_serial } from './FieldOptional'

const b = simpleBuilder

describe('FieldOptional', () => {
   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const E1 = b.number({ default: 5 }).optional().create()
            const E2 = b.number({ default: 6 }).optional().create()

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const schema = b.number({ default: 5 }).optional()
            const E1 = schema.create()
            const E2 = schema.create()

            E1.zValue = 8
            E2.zValue = 8

            expect(E1.zIsValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const schema = b.number({ default: 5 }).optional()
            const E1 = schema.create()
            const E2 = schema.create()

            E1.zValue = 8
            expect(E1.zIsValueEqual(E2)).toBeFalsy()

            E1.zValue = 5
            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const schema = b.number({ default: 5 }).optional()
            const E1 = schema.create()
            const E2 = schema.create()

            E1.zValue = 8
            E2.zValue = 9

            expect(E1.zIsValueEqual(E2)).toBeFalsy()
         })
      })
   })

   describe('generatePatches & applyPatches', () => {
      it('should change the active state to inactive', () => {
         const schema = b.number({ default: 5 }).optional()
         const E1 = schema.create()
         const E2 = schema.create()

         E1.setActive(false)

         const patches = E1.zGeneratePatches(E2)

         E2.zApplyPatches(patches)

         expect(E2.isActive).toBe(false)
      })

      it('should change the active state to active', () => {
         const schema = b.number({ default: 5 }).optional()
         const E1 = schema.create()
         const E2 = schema.create()

         E1.zValue = 8

         const patches = E1.zGeneratePatches(E2)

         E2.zApplyPatches(patches)

         expect(E2.isActive).toBe(true)
         expect(E2.zValue).toBe(8)
      })

      it('should patch the child when active has the same value', () => {
         const schema = b.number({ default: 5 }).optional(true)
         const E1 = schema.create()
         const E2 = schema.create()

         E1.zValue = 8
         E2.zValue = 5

         const patches = E1.zGeneratePatches(E2)

         E2.zApplyPatches(patches)

         expect(E2.zValue).toBe(8)
      })
   })

   describe('create', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should create the field and use the empty serial without patching it', () => {
               const patchSerial = vitest.spyOn(Field_optional.prototype, 'zPatchSerial')
               const S = b.number_().optional()
               const E = S.create()

               expect(E.zSerial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })

            it('should not be set', () => {
               const E = b.number_().optional_().create()
               expect(() => {
                  console.log(E.zValue)
               }).toThrowError('not set')
               expect(E.zIsOwnSet).toBe(false)
               expect(E.zHasOwnErrors).toBe(true)
               expect(E.zOwnErrors).toEqual([
                  {
                     longerMessage: 'Field is not set (@optional)',
                     message: 'Field is not set',
                     path: '$',
                  },
               ])
               expect(E.zValue_unchecked).toBeUndefined()
            })
         })

         describe('with a default value', () => {
            it('should create the field and use the default serial without patching it', () => {
               const patchSerial = vitest.spyOn(Field_optional.prototype, 'zPatchSerial')
               const S = b.number_().optional(true)
               const E = S.create()

               expect(E.zSerial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })

            describe('when the target field has a default value', () => {
               it('should create the field and use the default serial without patching it', () => {
                  const patchSerial = vitest.spyOn(Field_optional.prototype, 'zPatchSerial')
                  const S = b.number_({ default: 42 }).optional(true)
                  const E = S.create()

                  expect(E.zSerial).toBe(S.defaultSerial)
                  expect(patchSerial).not.toHaveBeenCalled()
               })
            })
         })
      })

      describe('with a serial', () => {
         it('should create the field and use the serial without patching it', () => {
            const patchSerial = vitest.spyOn(Field_optional.prototype, 'zPatchSerial')
            const S = b.number_().optional()
            const serial: Field_optional_serial<Field_number['z$Schema']> = {
               $: 'optional',
               y: { $: 'number', value: 42 },
            }
            const E = S.create(serial)

            expect(E.zSerial).toBe(serial)
            expect(patchSerial).not.toHaveBeenCalled()
         })

         describe('startActive', () => {
            describe('when true', () => {
               it('should apply the startActive when the value is undefined', () => {
                  const S = b.number().optional(true)
                  const serial = S.generateSerial(undefined)
                  const E = S.create(serial)

                  expect(E.isActive).toBe(true)
                  expect(E.zValue_unchecked).toBe(0)
               })

               it('should be inactive when the value is null', () => {
                  const S = b.number_().optional(true)
                  const serial = S.generateSerial(null)
                  const E = S.create(serial)

                  expect(E.isActive).toBe(false)
                  expect(E.zValue).toBeNull()
               })
            })

            describe('when false', () => {
               it('should set the value to null when the value is undefined', () => {
                  const S = b.number_().optional(false)
                  const serial = S.generateSerial(undefined)
                  const E = S.create(serial)

                  expect(E.isActive).toBe(false)
                  expect(E.zValue).toBeNull()
               })

               it('should keep the null value', () => {
                  const S = b.number_().optional(false)
                  const serial = S.generateSerial(null)
                  const E = S.create(serial)

                  expect(E.isActive).toBe(false)
                  expect(E.zValue).toBeNull()
               })
            })

            describe('when not set', () => {
               it('should keep the unset state', () => {
                  const S = b.number_().optional_()
                  const serial = S.generateSerial(undefined)
                  const E = S.create(serial)
                  expect(E.zSerial).toEqual({ $: 'optional' })

                  expect(E.isActive).toBe(false)
                  expect(() => {
                     console.log(E.zValue)
                  }).toThrowError('not set')
                  expect(E.zIsOwnSet).toBe(false)
                  expect(E.zHasOwnErrors).toBe(true)
                  expect(E.zOwnErrors).toEqual([
                     {
                        longerMessage: 'Field is not set (@optional)',
                        message: 'Field is not set',
                        path: '$',
                     },
                  ])
                  expect(E.zValue_unchecked).toBeUndefined()
               })

               it('should keep the null value', () => {
                  const S = b.number_().optional_()
                  const serial = S.generateSerial(null)
                  const E = S.create(serial)

                  expect(E.isActive).toBe(false)
                  expect(E.zValue).toBeNull()
               })

               it('should keep the value', () => {
                  const S = b.number_().optional_()

                  const serialUnset = S.generateSerial(undefined)
                  expect(serialUnset).toEqual({ $: 'optional' })

                  const seriaNull = S.generateSerial(null)
                  expect(seriaNull).toEqual({ $: 'optional', n: { $: 'number' } })

                  const serial = S.generateSerial(42)
                  expect(serial).toEqual({ $: 'optional', y: { $: 'number', value: 42 } })

                  const E = S.create(serial)
                  console.log(`[🤠HHHAA] `, E.zSerial, serial)
                  expect(E.zSerial).toEqual(serial)
                  expect(E.isActive).toBe(true)
                  expect(E.zValue).toBe(42)
               })
            })
         })
      })
   })
})
