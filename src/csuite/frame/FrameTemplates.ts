import { type BoxNormalized, normalizeBox } from '../box/BoxNormalized'

const frame_ghost: BoxNormalized = normalizeBox({
   textShadow: 100,
   border: 10,
   base: 0,
})

const frame_subtle: BoxNormalized = normalizeBox({
   textShadow: 100,
   border: 0.05,
   base: 0,
})

const frame_default: BoxNormalized = normalizeBox({
   textShadow: 100,
   border: 0.25,
   base: 0.2,
})

const frame_link: BoxNormalized = normalizeBox({
   border: 0,
   text: { hue: 220, chroma: 0.3, contrast: 0.4 },
})

const frame_primary: BoxNormalized = normalizeBox({
   textShadow: 100,
   base: { contrast: 0.1, chroma: 0.1 },
   border: 0.1,
})

const frame_primarySuccess: BoxNormalized = normalizeBox({
   textShadow: 100,
   base: { contrast: 1, chroma: 0.1, hue: 135 },
   border: 0.1,
})
const frame_primaryWarning: BoxNormalized = normalizeBox({
   textShadow: 100,
   base: { contrast: 0.1, chroma: 0.1, hue: 60 },
   border: 0.1,
})
const frame_primaryInfo: BoxNormalized = normalizeBox({
   textShadow: 100,
   base: { contrast: 0.1, chroma: 0.1, hue: 240 },
   border: 0.1,
})
const frame_primaryError: BoxNormalized = normalizeBox({
   textShadow: 100,
   base: { contrast: 0.1, chroma: 0.1, hue: 0 },
   border: 0.1,
})

const frame_secondary: BoxNormalized = normalizeBox({
   border: 0.3,
   base: { contrast: 0.3, chroma: 0.2, hueShift: 180 },
})

export const frameTemplates = {
   link: frame_link,
   ghost: frame_ghost,
   subtle: frame_subtle,
   default: frame_default,
   primary: frame_primary,
   success: frame_primarySuccess,
   info: frame_primaryInfo,
   warning: frame_primaryWarning,
   error: frame_primaryError,
   secondary: frame_secondary,
}
export const frameTemplateNames = Object.keys(frameTemplates) as FrameAppearance[]
export type FrameAppearance = keyof typeof frameTemplates
