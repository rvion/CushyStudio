import type { Tint } from './Tint'

export function overrideTintV2(...tints: Maybe<Tint | boolean>[]): Tint {
   const out: Tint = {}
   for (const tint of tints) {
      if (typeof tint === 'boolean') continue
      if (tint == null) continue
      // L
      if (tint.lightness != null) {
         out.lightness = tint.lightness
         delete out.contrast
      } else if (tint.contrast != null) {
         out.contrast = tint.contrast
         delete out.lightness
      }
      // C
      if (tint.chroma != null) {
         out.chroma = tint.chroma
         delete out.chromaBlend
      } else if (tint.chromaBlend != null) {
         out.chromaBlend = tint.chromaBlend
         delete out.chroma
      }
      // H
      if (tint.hue != null) {
         out.hue = tint.hue
         delete out.hueShift
      } else if (tint.hueShift != null) {
         out.hueShift = tint.hueShift
         delete out.hue
      }
   }
   return out
}
