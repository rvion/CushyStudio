import type { Tint } from './Tint'

/**
 * This function aims to "merge" two Kolor objects by
 * overriding the properties of `a` with the properties of `b`.
 *
 * 🔶 2024-05-30 rvion:
 * | for now, the semantic is such that we can only have either absolute
 * | or relative values; not both.
 */
export const overrideTint = (
   //
   a: Maybe<Tint>,
   b: Maybe<Tint>,
): Tint => {
   if (a == null && b == null) return {}
   if (a == null) return b!
   if (b == null) return a

   const out: Tint = {}
   /**/ if (b.lightness != null) out.lightness = b.lightness
   else if (b.contrast != null) out.contrast = b.contrast
   else if (a.lightness != null) out.lightness = a.lightness
   else if (a.contrast != null) out.contrast = a.contrast

   /**/ if (b.chroma != null) out.chroma = b.chroma
   else if (b.chromaBlend != null) out.chromaBlend = b.chromaBlend
   else if (a.chroma != null) out.chroma = a.chroma
   else if (a.chromaBlend != null) out.chromaBlend = a.chromaBlend

   /**/ if (b.hue != null) out.hue = b.hue
   else if (b.hueShift != null) out.hueShift = b.hueShift
   else if (a.hue != null) out.hue = a.hue
   else if (a.hueShift != null) out.hueShift = a.hueShift

   return out
}
