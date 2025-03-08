import { vitest } from 'vitest'

import { locoSchemaBuilder } from '../../../../../front/form/LocoSchemaBuilder'
import { Field_color } from './FieldColor'

describe('FieldColor', () => {
   describe('create perf', () => {
      describe('without a serial', () => {
         describe('without a default value', () => {
            it('should use the emptySerial without patching it', () => {
               const patchSerial = vitest.spyOn(Field_color.prototype, 'patchSerial')
               const S = locoSchemaBuilder.color()
               const E = S.create()

               expect(E.serial).toBe(S.emptySerial)
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })

         describe('with a default value', () => {
            it('should use the emptySerial and patch it', () => {
               const patchSerial = vitest.spyOn(Field_color.prototype, 'patchSerial')
               const S = locoSchemaBuilder.color({ default: '#123456' })
               const E = S.create()

               expect(E.serial).toBe(S.emptySerial)
               expect(E.serial.value).toBe('#123456')
               expect(patchSerial).not.toHaveBeenCalled()
            })
         })
      })
   })
})
