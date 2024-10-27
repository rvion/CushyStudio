import { describe, expect, it } from 'bun:test'
import Color from 'colorjs.io'

import { Kolor } from './Kolor'

// most people will only have srgb monitors, without p3 nor rec 2020
// we must make sure we properly detect when our autocontrast algorithm
// offer colors outside of the available srgb gamut

describe('kolor', () => {
   // prettier-ignore
   it('can properly detect if valid for current screen', () => {
        // https://oklch.com/#61.18,0.157,0,100
        const c1 = new Kolor(0.6118, 0.16, 0)
        expect(c1.isInRec2020Gamut).toBeTrue() // ✔️
        expect(c1.isInP3Gamut     ).toBeTrue() // ✔️
        expect(c1.isInRBGGamut    ).toBeTrue() // ✔️

        // https://oklch.com/#67.35,0.26,0,100
        const c2 = new Kolor(0.6737, 0.26, 0)
        expect(c2.isInRec2020Gamut).toBeTrue() // ✔️
        expect(c2.isInP3Gamut     ).toBeTrue() // ✔️
        expect(c2.isInRBGGamut    ).toBeFalse() // ❌

        // https://oklch.com/#70.29,0.323,0,100
        const c3 = new Kolor(0.7029, 0.323, 0)
        expect(c3.isInRec2020Gamut).toBeTrue() // ✔️
        expect(c3.isInP3Gamut     ).toBeFalse() // ❌
        expect(c3.isInRBGGamut    ).toBeFalse() // ❌

        // https://oklch.com/#80,0.345,0,100
        const c4 = new Kolor(0.8, 0.345, 0)
        expect(c4.isInRec2020Gamut).toBeFalse() // ❌
        expect(c4.isInP3Gamut     ).toBeFalse() // ❌
        expect(c4.isInRBGGamut    ).toBeFalse() // ❌
    })

   it('can properly clamp to available gamut', () => {
      const c2 = new Kolor(0.6737, 0.26, 0)
      expect(c2.clampToP3()).toBe(c2)

      expect(c2.clampToRGB()).not.toBe(c2)
      expect(c2.clampToRGB().toOKLCH()).toBe('oklch(0.659 0.254 358.449)')
   })

   it('can find colors smartly', () => {
      const c1 = new Kolor(0.0, 0.0, 0)
      c1.tintFg({ contrast: 1 })
   })

   it('can find compute contrasts', () => {
      const c1 = new Kolor(0.6118, 0.16, 0)
      const col = c1.color
      const black = new Color('oklch', [0, 0, 0]).toGamut('srgb')
      const white = new Color('oklch', [1, 0, 0]).toGamut('srgb')
      const gray = new Color('oklch', [0.5, 0, 0]).toGamut('srgb')
      // expect(col.contrastWCAG21(black)).toBe(0.2441954071332088)
      // expect(col.contrastWCAG21(white)).toBe(0.048776781536359275)

      expect(black.contrastWCAG21(white)).toBeCloseTo(21, 5)

      expect(gray.contrastWCAG21(white)).toBeCloseTo(6, 5)
      expect(gray.contrastWCAG21(black)).toBeCloseTo(3.5, 5)
   })
})
