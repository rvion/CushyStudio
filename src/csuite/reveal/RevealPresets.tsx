import type { RevealHideTriggers, RevealPreset } from './RevealProps'

const preset = (p: RevealPreset): RevealPreset => p

/** in most case, we just want reveals to close in those case */
const standardHideTriggers: RevealHideTriggers = {
   clickAnchor: true,
   backdropClick: true,
   escapeKey: true,
}

export const revealPresets = {
   doubleClick: preset({
      show: { anchorDoubleClick: true },
      hide: standardHideTriggers,
   }),

   /** will open on hover after the showDelay */
   hover: preset({
      show: { anchorHover: true },
      hide: { mouseOutside: true },
   }),

   // if focused from anywhere outside of the revealed content => open
   // if we type any letter or number or space or enter when anchor is focused => open
   pseudofocus: preset({
      show: { anchorFocus: true, keyboardEnterOrLetterWhenAnchorFocused: true, anchorClick: true },
      hide: { ...standardHideTriggers, tabKey: true },
   }),

   /** will open on click */
   click: preset({
      show: { anchorClick: true },
      hide: standardHideTriggers,
   }),

   // weird mix of both click and hover; will probably be either
   // renamed or replaced by the trigger dict (object) notation.
   clickAndHover: preset({
      show: { anchorHover: true, anchorClick: true },
      hide: standardHideTriggers,
   }),

   none: preset({
      show: {},
      hide: { mouseOutside: true },
   }),

   rightClick: preset({
      show: { anchorRightClick: true },
      hide: standardHideTriggers,
   }),

   // complex standard menubar behaviour
   menubarItem: preset({
      show: {
         anchorClick: true,
         keyboardEnterOrLetterWhenAnchorFocused: true,
         anchorHover: (reveal, RevealState) => {
            // console.log(`[🎩🔴1] RevealState.shared.current is ${RevealState.shared.current?.uid} at depth ${RevealState.shared.current?.depth}`)
            const current = RevealState.shared.current
            if (current == null) return false
            if (current.p.revealGroup != null && current.p.revealGroup === reveal.p.revealGroup) return true
            return false
            // if I'm in a sibling (or a sibling descendant) of the current reveal, I should reveal on hover
            // if (current.parents.length >= reveal.parents.length) return true
            // console.log(`[🎩🔴2] current.parents.length(${current.parents.length}) is NOT >= this.parents.length(${this.parents.length})`)
         },
      },
      hide: standardHideTriggers,
   }),
}

export type RevealPresetName = keyof typeof revealPresets
