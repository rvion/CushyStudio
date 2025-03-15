import { describe } from 'node:test'
import { expect, it, vitest } from 'vitest'

import { simpleBuilder } from '../../SimpleFactory'
import { Field_color } from './FieldColor'

describe('FieldColor', () => {
   describe('create perf', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the defaultSerial without patching it', () => {
               const patchSerial = vitest.spyOn(Field_color.prototype, 'patchSerial')
               const S = simpleBuilder.color()
               const E = S.create()

               expect(E.serial).toBe(S.defaultSerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with a default value', () => {
            it('should use the defaultSerial and patch it', () => {
               const patchSerial = vitest.spyOn(Field_color.prototype, 'patchSerial')
               const S = simpleBuilder.color({ default: '#123456' })
               const E = S.create()

               expect(E.serial).toBe(S.defaultSerial)
               expect(E.serial.value).toBe('#123456')
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })
      })
   })
})
