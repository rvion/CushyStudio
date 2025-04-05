import { beforeEach, describe, expect, it, vitest } from 'vitest'

import { simpleBuilder } from '../../simple/SimpleFactory'
import { Field_string, type Field_string_serial } from './FieldString'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('field string', () => {
   beforeEach(() => {
      vitest.restoreAllMocks()
   })

   it('preserves ref equality check when using setSerial', () => {
      const S = b.string({ default: 'abc' })
      const ser1: Field_string_serial = { $: 'str', value: 'ser 1' }
      const ser2: Field_string_serial = { $: 'str', value: 'ser 2', custom: { THING: 12 } }

      const E = S.create(ser1)
      expect(E.zSerial === ser1).toBeTruthy()

      E.zSetSerial(ser1)
      expect(E.zSerial === ser1).toBeTruthy()
      expect(E.zValue).toBe('ser 1')
      expect(E.zSerial === ser1).toBeTruthy()
      // expect(E.__version__).toBe(1)

      E.zSetSerial(ser2)
      expect(E.zValue).toBe('ser 2')
      expect(E.zSerial.custom.THING === 12).toBeTruthy()
      expect(E.zSerial === ser2).toBeTruthy()
      // expect(E.__version__).toBe(2)

      E.zSetSerial(ser2)
      E.zSetSerial(ser2)
      E.zSetSerial(ser2)
      E.zSetSerial(ser2)
      // expect(E.__version__).toBe(2)
   })

   describe('generatePatches & applyPatches', () => {
      it('should generate a patch that sets the value', () => {
         const S = b.string({ default: 'abc' })
         const E1 = S.create()
         const E2 = S.create()

         E1.zValue = 'def'

         const patches = E1.zGeneratePatches(E2)

         E2.zApplyPatches(patches)

         expect(E2.zValue).toBe('def')
      })
   })

   describe('create', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the default serial and not modify it', () => {
               const patchSerial = vitest.spyOn(Field_string.prototype, 'zPatchSerial')

               const S = b.string_()

               const E = S.create()

               expect(E.zSerial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with a default value', () => {
            it('should use the default serial and not modify it', () => {
               const patchSerial = vitest.spyOn(Field_string.prototype, 'zPatchSerial')

               const S = b.string({ default: 'abc' })

               const E = S.create()

               expect(E.zSerial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })
      })

      describe('with a serial', () => {
         it('should use the serial without patching it', () => {
            const patchSerial = vitest.spyOn(Field_string.prototype, 'zPatchSerial')

            const S = b.string({ default: 'abc' })
            const serial: Field_string_serial = { $: 'str', value: 'def' }

            const E = S.create(serial)

            expect(E.zSerial).toBe(serial)
            expect(patchSerial).not.toHaveBeenCalled()
         })
      })
   })
})
