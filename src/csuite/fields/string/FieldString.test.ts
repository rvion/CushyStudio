import type { Field_string_serial } from './FieldString'

import { describe, expect, it } from 'vitest'

import { simpleBuilder } from '../../index'

const b = simpleBuilder

// ------------------------------------------------------------------------------
describe('field string', () => {
   it('preserves ref equality check when using setSerial', () => {
      const S = b.string({ default: 'abc' })
      const ser1: Field_string_serial = { $: 'str', value: 'ser 1' }
      const ser2: Field_string_serial = { $: 'str', value: 'ser 2', custom: { yolo: 12 } }

      const E = S.create(ser1)
      expect(E.serial === ser1).toBeTruthy()

      E.setSerial(ser1)
      expect(E.serial === ser1).toBeTruthy()
      expect(E.value).toBe('ser 1')
      expect(E.serial === ser1).toBeTruthy()
      expect(E.__version__).toBe(1)

      E.setSerial(ser2)
      expect(E.value).toBe('ser 2')
      expect(E.serial.custom.yolo === 12).toBeTruthy()
      expect(E.serial === ser2).toBeTruthy()
      expect(E.__version__).toBe(2)

      E.setSerial(ser2)
      E.setSerial(ser2)
      E.setSerial(ser2)
      E.setSerial(ser2)
      expect(E.__version__).toBe(2)
   })

   describe('generatePatches & applyPatches', () => {
      it('should generate a patch that sets the value', () => {
         const S = b.string({ default: 'abc' })
         const E1 = S.create()
         const E2 = S.create()

         E1.value = 'def'

         const patches = E1.generatePatches(E2)

         E2.applyPatches(patches)

         expect(E2.value).toBe('def')
      })
   })
})
