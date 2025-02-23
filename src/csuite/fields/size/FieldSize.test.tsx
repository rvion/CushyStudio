import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { simpleBuilder } from '../../simple/SimpleFactory'

const spyOn = vi.spyOn

describe('FieldSize', () => {
   describe('generatePatches & applyPatches', () => {
      beforeEach(() => {
         spyOn(console, 'log').mockReturnValue(undefined)
      })
      afterEach(() => {
         vi.restoreAllMocks()
         // mock.restore()
      })

      it('should change the size', () => {
         const S = simpleBuilder.size({ default: { width: 5, height: 5 } })
         const E1 = S.create()
         const E2 = S.create()

         E1.setAspectRatio('3:2')

         E2.width = 5
         E2.height = 5

         const patches = E1.generatePatches(E2)

         E2.applyPatches(patches)

         expect(E2.width).toBe(1024)
         expect(E2.height).toBe(683)
         // Aspect ratio and modelType are not working as expected for now
         // as they don't seem to be saved in the serial
      })
   })
})
