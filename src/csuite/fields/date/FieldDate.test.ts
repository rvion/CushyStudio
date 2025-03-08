/* eslint-disable vitest/require-to-throw-message */
import { Temporal } from '@js-temporal/polyfill'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Severity } from '../../model/Validation'
import { simpleBuilder as b } from '../../simple/SimpleFactory'
import { Field_date } from './FieldDate'

const spyOn = vi.spyOn
const mock = vi.mock

describe('FieldDate', () => {
   afterEach(() => {
      // mock.restore()
      vi.restoreAllMocks()
   })

   describe('Create', () => {
      it('should create a field', () => {
         const field = b.date().create()

         expect(field).toBeDefined()
         expect(field.value_unchecked).toBeUndefined()
      })

      describe('default value', () => {
         it('should have the default value', () => {
            const field = b.date({ default: new Date(2025, 1, 3, 4, 5) }).create()

            expect(field.value_unchecked).toEqual(new Date(2025, 1, 3, 4, 5))
         })

         it('should have the default value specified by a function', () => {
            const field = b.date({ default: () => new Date(2025, 1, 3, 4, 5) }).create()

            expect(field.value_unchecked).toEqual(new Date(2025, 1, 3, 4, 5))
         })

         it('should set an invalid value if the default value is invalid', () => {
            const field = b.date({ default: new Date('INVALID') }).create()

            expect(field.value_unchecked).toBeNull()
            expect(field.hasOwnErrors).toBeTruthy()
         })
      })

      describe('Create with a serial', () => {
         it('should correctly load the value from the serial', () => {
            const originalField = b.date().create()
            originalField.value = new Date(2025, 1, 3, 4, 5)
            const serial = originalField.serial

            const newField = b.date().create(serial)

            expect(newField.value).toEqual(new Date(2025, 1, 3, 4, 5))
         })

         it('should load an invalid serial and just return the appropriate error', () => {
            const serial: Field_date<Date>['serial'] = {
               value: 'invalid',
               $: 'date',
            }
            const newField = b.date().create(serial)

            expect(newField.serial).toEqual(serial)
            expect(newField.ownErrors).toEqual([
               { path: newField.path, message: 'Invalid date', severity: Severity.Error },
            ])
            expect(newField.value_unchecked).toBeNull()
            expect(() => newField.value).toThrowError()
         })
      })

      describe('perf', () => {
         describe('without a serial', () => {
            describe('without a default value', () => {
               it('should use the emptySerial without patching it', () => {
                  const S = b.date()
                  const E = S.create()

                  expect(E.serial).toBe(S.emptySerial)
               })
            })

            describe('with a default value', () => {
               it('should use the emptySerial and patch it', () => {
                  const S = b.date({ default: new Date(2025, 1, 3, 4, 5) })
                  const E = S.create()

                  expect(E.serial).toBe(S.emptySerial)
               })

               it('should use the emptySerial and patch it (default as function)', () => {
                  const S = b.date({ default: () => new Date(2025, 1, 3, 4, 5) })
                  const E = S.create()

                  expect(E.serial).toBe(S.emptySerial)
               })
            })
         })
      })
   })

   describe('Migrate serial', () => {
      describe('When the serial comes from a previous date time zoned field', () => {
         it('should migrate the serial by just changing the type', () => {
            const date = Temporal.ZonedDateTime.from({
               year: 2025,
               month: 2,
               day: 3,
               hour: 4,
               minute: 5,
               timeZone: Temporal.Now.timeZoneId(),
            })
            const originalSerial = {
               $: 'datetimezoned',
               value: date.toString(),
            }

            const result = Field_date.migrateSerial(originalSerial)

            expect(result).toEqual({
               $: 'date',
               value: originalSerial.value,
            })
         })

         it('should migrate the serial when the value is null', () => {
            const originalSerial = {
               $: 'datetimezoned',
               value: null,
            }

            const result = Field_date.migrateSerial(originalSerial)

            expect(result).toEqual({
               $: 'date',
               value: null,
            })
         })
      })

      describe('When the serial comes from a plain date field', () => {
         it('should just return the serial', () => {
            const date = Temporal.PlainDate.from({
               year: 2025,
               month: 2,
               day: 3,
            })
            const originalSerial = {
               $: 'plaindate',
               value: date.toString(),
            }

            const result = Field_date.migrateSerial(originalSerial)

            expect(result).toEqual({
               $: 'date',
               value: originalSerial.value,
            })
         })

         it('should migrate the serial when the value is null', () => {
            const originalSerial = {
               $: 'plaindate',
               value: null,
            }

            const result = Field_date.migrateSerial(originalSerial)

            expect(result).toEqual({
               $: 'date',
               value: null,
            })
         })
      })
   })

   describe('Value', () => {
      it('should set the value with a valid date', () => {
         const field = b.date().create()

         const d = new Date(2025, 1, 3, 4, 5)
         field.value = d

         expect(field.value_unchecked).toEqual(d)
         expect(field.value).toEqual(d)
         expect(field.value_or_fail).toEqual(d)
         expect(field.value_or_zero).toEqual(d)
      })

      it('should set null', () => {
         const field = b.date().create()

         field.value = null as any as Date

         expect(field.value_unchecked).toBeNull()
         expect(() => field.value).toThrowError()
         expect(() => field.value_or_fail).toThrowError()
         expect(field.value_or_zero).toBeInstanceOf(Date)
      })

      it('should set undefined', () => {
         const field = b.date().create()

         field.value = undefined as any as Date

         expect(field.value_unchecked).toBeUndefined()
         expect(() => field.value).toThrowError()
         expect(() => field.value_or_fail).toThrowError()
         expect(field.value_or_zero).toBeInstanceOf(Date)
      })

      it('should patch the serial in a transaction if the value is valid', () => {
         const field = b.date().create()

         spyOn(field.repo, 'runInTransaction')

         field.value = new Date(2025, 1, 3, 4, 5)

         expect(field.repo.runInTransaction).toHaveBeenCalledTimes(1)
      })
   })

   describe('setValueFromString', () => {
      it('should correctly set a valid date', () => {
         const field = b.date().create()

         field.setValueFromString('3/2/25, 04:05 AM')

         expect(field.value_unchecked).toEqual(new Date(2025, 2, 2, 4, 5))
      })

      it('should trim the string', () => {
         const field = b.date().create()

         field.setValueFromString('  3/2/25, 04:05 AM  ')

         expect(field.value_unchecked).toEqual(new Date(2025, 2, 2, 4, 5))
      })

      it('should set an invalid date', () => {
         const field = b.date().create()

         field.setValueFromString('invalid')

         expect(field.value_unchecked).toBeNull()
      })

      it('should set null if the string is empty', () => {
         const field = b.date().create()

         field.setValueFromString('')

         expect(field.value_unchecked).toBeNull()
      })

      it('should set null if the string contains only spaces', () => {
         const field = b.date().create()

         field.setValueFromString('   ')

         expect(field.value_unchecked).toBeNull()
      })

      it('should set the serial even if the string is invalid', () => {
         const field = b.date().create()

         field.setValueFromString('invalid')

         expect(field.serial).toMatchObject({
            value: 'invalid',
         })
      })

      it('should patch the serial in a transaction', () => {
         const field = b.date().create()

         spyOn(field.repo, 'runInTransaction')

         field.setValueFromString('03/02/2025 04:05')

         expect(field.repo.runInTransaction).toHaveBeenCalledTimes(1)

         expect(field.serial).toMatchObject({
            value: expect.any(String),
         })
      })

      it('should patch the serial in a transaction if the value is invalid', () => {
         const field = b.date().create()

         spyOn(field.repo, 'runInTransaction')
         field.setValueFromString('invalid')

         expect(field.repo.runInTransaction).toHaveBeenCalledTimes(1)
      })
   })

   describe('ownTypeSpecificProblems', () => {
      it('should not return an error if the value is valid', () => {
         const field = b.date().create()

         field.setValueFromString('03/02/2025 04:05')

         expect(field.ownTypeSpecificProblems).toBeNull()
      })

      it('should return an error if the value is null', () => {
         const field = b.date().create()

         expect(field.ownTypeSpecificProblems).toEqual({
            path: field.path,
            severity: Severity.Error,
            message: 'Field is not set',
         })
      })

      it('should return an error if the value is invalid', () => {
         const field = b.date().create()

         field.setValueFromString('invalid')

         expect(field.ownTypeSpecificProblems).toEqual({
            path: field.path,
            severity: Severity.Error,
            message: 'Invalid date',
         })
      })
   })

   describe('ownConfigSpecificProblems', () => {
      it('should return an error if the value is not a valid date', () => {
         const field = b.date().create()

         field.value = new Date('ABCDEF')

         expect(field.ownCustomConfigCheckProblems).toEqual([
            {
               path: field.path,
               severity: Severity.Error,
               message: 'Invalid date',
            },
         ])
      })

      it('should also apply checks passed in the config', () => {
         const field = b
            .date({
               check: (f) => {
                  if (f.value_unchecked?.getFullYear() !== 2025) {
                     return {
                        path: '$',
                        severity: Severity.Error,
                        message: 'Invalid year',
                     }
                  }
               },
            })
            .create()

         field.value = new Date(2024, 1, 3, 4, 5)

         expect(field.ownCustomConfigCheckProblems).toEqual([
            {
               path: field.path,
               severity: Severity.Error,
               message: 'Invalid year',
            },
         ])
      })
   })

   describe('ownErrors', () => {
      it('should return an invalid error if the value is invalid', () => {
         const field = b.date().create()

         field.setValueFromString('invalid')

         expect(field.ownErrors).toMatchObject([{ message: 'Invalid date' }])
      })

      it('should remove the error once the value is valid', () => {
         const field = b.date().create()

         field.setValueFromString('invalid')
         field.setValueFromString('03/02/2025 04:05')

         expect(field.ownErrors).toEqual([])
      })
   })

   describe('isOwnSet', () => {
      it('should return false if the value has not been set', () => {
         const field = b.date().create()

         expect(field.isOwnSet).toBeFalsy()
      })

      it('should return true if the value has been set', () => {
         const field = b.date().create()

         field.setValueFromString('03/02/2025 04:05')

         expect(field.isOwnSet).toBeTruthy()
      })

      it('should return true if the value is null', () => {
         const field = b.date().create()

         field.setValueFromString('03/02/2025 04:05')
         field.value = null as any as Date

         expect(field.isOwnSet).toBeTruthy()
      })

      it('should return true if the value is invalid', () => {
         const field = b.date().create()

         field.setValueFromString('invalid')

         expect(field.isOwnSet).toBeTruthy()
      })
   })

   describe('isValueEqual', () => {
      describe('equality', () => {
         it('should return true if both fields are unset', () => {
            const S = b.date()
            const E1 = S.create()
            const E2 = S.create()

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })

         it('should return true if both fields are set to the same value', () => {
            const S = b.date()
            const E1 = S.create()
            const E2 = S.create()

            E1.value = new Date(2025, 1, 3, 4, 5)
            E2.value = new Date(2025, 1, 3, 4, 5)

            expect(E1.isValueEqual(E2)).toBeTruthy()
         })
      })

      describe('inequality', () => {
         it('should return false if one field is unset and the other is set', () => {
            const S = b.date()
            const E1 = S.create()
            const E2 = S.create()

            E1.value = new Date(2025, 1, 3, 4, 5)

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if both fields are set to different values', () => {
            const S = b.date()
            const E1 = S.create()
            const E2 = S.create()

            E1.value = new Date(2025, 1, 3, 4, 5)
            E2.value = new Date(2025, 1, 3, 4, 6)

            expect(E1.isValueEqual(E2)).toBeFalsy()
         })

         it('should return false if the other field is not a date', () => {
            const S = b.date()
            const E1 = S.create()
            const E2 = b.text().create()

            E1.value = new Date(2025, 1, 3, 4, 5)
            E2.value = new Date(2025, 1, 3, 4, 5).toISOString()

            expect(E1.isValueEqual(E2 as any)).toBeFalsy()
         })
      })
   })
})
