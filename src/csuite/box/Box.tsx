import type { TintExt } from '../kolor/Tint'

export type Box = {
   // 1. BASE ------------------------------------------------------------
   /**
    * BASE (relative to its parent's BASE)
    * INHERITED
    *
    * quick setters:
    *   - true: contrast: 0.2 from non hovered base
    *   - string : absolute color
    *   - number : contrast: x / 100, chromaBlend: 1, hueShift: 0
    */
   base?: TintExt

   /** slightly different from base; allow to change the background without affecting the base */
   shock?: TintExt

   /**
    * BASE when hovered (relative to its parent's BASE)
    * NOT INHERITED
    *
    * quick setters:
    *   - true: contrast: 0.2 from non hovered base
    *   - string : absolute color
    *   - number: contrast: x / 100 from non hovered base
    */
   hover?: TintExt

   // 2. RELATIVE TO BASE ------------------------------------------------------------
   /**
    * relative to BASE
    * e.g. { contrast: 1, chromaBlend: 1, hueShift: 0}
    * relative to base; when relative, carry to children as default strategy */
   text?: TintExt

   // 2.2 NOT INHERITED -----------------------------------------------------
   /**
    * NOT INHERITED
    */
   textShadow?: TintExt

   /** Box shadow (external) */
   shadow?: TintExt

   /**
    * - string: absolute color
    * - relative: relative to parent
    * - number: = relative({ contrast: x / 10 })
    * - boolean: = relative({ contrast: 0.2 })
    * - null: inherit parent's background
    * */
   border?: TintExt
}
