import type { RevealCloseEvent } from './RevealCloseEvent'
import type { RevealPlacement } from './RevealPlacement'
import type { RevealState } from './RevealState'
import type { RevealStateLazy } from './RevealStateLazy'
import type { RevealContentProps, RevealShellProps } from './shells/ShellProps'
import type React from 'react'
import type { FC } from 'react'

// prettier-ignore
export type KnownShells =
    | 'none'
    | 'popover'
    | 'popup'
    | 'popup-xs'
    | 'popup-sm'
    | 'popup-lg'
    | 'popup-xl'

export type RevealPreset = {
   show: RevealShowTriggers
   hide: RevealHideTriggers
}

const preset = (p: RevealPreset): RevealPreset => p

/** in most case, we just want reveals to close in those case */
const standardHideTriggers: RevealHideTriggers = {
   clickAnchor: true,
   backdropClick: true,
   escapeKey: true,
}

export const revealPresets = {
   doubleClick: preset({
      show: { anchorDoubleClick: true }, //                                                               🟢
      hide: standardHideTriggers, //                                                                      🟢
   }),

   /** will open on hover after the showDelay */
   hover: preset({
      show: { anchorHover: true }, //                                                                     🟢
      hide: { mouseOutside: true }, //                                                                    🟢
   }),

   // if focused from anywhere outside of the revealed content => open
   // if we type any letter or number or space or enter when anchor is focused => open
   pseudofocus: preset({
      show: { anchorFocus: true, keyboardEnterOrLetterWhenAnchorFocused: true, anchorClick: true }, //    🟢
      hide: standardHideTriggers, //                                                                      🟢
   }),

   /** will open on click */
   click: preset({
      show: { anchorClick: true }, //                                                                     🟢
      hide: standardHideTriggers, //                                                                      🟢
   }),

   // weird mix of both click and hover; will probably be either
   // renamed or replaced by the trigger dict (object) notation.
   clickAndHover: preset({
      show: { anchorHover: true, anchorClick: true }, //                                                  🟢
      hide: standardHideTriggers, //                                                                      🟢
   }),

   none: preset({
      show: {}, //                                                                                        🟢
      hide: { mouseOutside: true }, //                                                                    🟢
   }),

   rightClick: preset({
      show: { anchorRightClick: true }, //                                                                🟢
      hide: standardHideTriggers, //                                                                      🟢
   }),

   // complex standard menubar behaviour
   menubarItem: preset({
      show: {
         anchorClick: true,
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

export type RevealShowTriggersExt = RevealShowTriggers | RevealShowTrigger
export type RevealShowTriggers = {
   [key in RevealShowTrigger]?:
      | boolean
      | ((reveal: RevealState, Reveal: typeof RevealState) => boolean | undefined)
}
export type RevealShowTrigger =
   | 'anchorFocus'
   | 'anchorClick'
   | 'anchorDoubleClick'
   | 'anchorHover'
   | 'anchorRightClick'
   | 'keyboardEnterOrLetterWhenAnchorFocused'

// ❓ |  () => ...
// ❓ |  { chick: ..., hover: ..., focus: ... }

export type RevealHideTriggers = { [key in RevealHideTrigger]?: boolean }
export type RevealHideTrigger =
   | 'mouseOutside' //
   | 'escapeKey'
   | 'blurAnchor'
   | 'clickAnchor'
   | 'backdropClick' // via shell backdrop
   | 'shellClick' // via shell (not backdrop)
   | 'none'
// | 'blurTooltip' // not sure we need this one

export type RevealHideReason =
   | 'leftClickAnchor' //
   | 'rightClickAnchor' //
   | 'backdropClick'
   | 'shellClick' // via shell (not backdrop)
   | 'mouseOutside'
   | 'tabKey'
   | 'shiftTabKey'
   | 'escapeKey'
   | 'pickOption'
   | 'blurAnchor'
   | 'closeButton' // ex: in modals
   | 'an-other-reveal-opened' // another reveal appearing caused the closure
   | 'programmatic'
   | 'unknown'
   | 'RevealUI-is-unmounted'

export type RevealOpenReason =
   | 'doubleClickAnchor' //
   | 'leftClickAnchor' //
   | 'rightClickAnchor' //
   | 'tabKey'
   | 'shiftTabKey'
   | 'programmatically-via-open-function'
   | 'unknown'
   | 'child-is-opening-so-as-parent-I-must-open-too'
   | 'mouse-enter-anchor-(no-parent-open)'
   | 'mouse-enter-anchor-(with-parent-open)'
   | 'focus-anchor'
   | 'KeyboardEnterOrLetterWhenAnchorFocused'
   | 'default-visible'

export type RevealProps = {
   /** used to identify reveal when src/csuite/reveal/DEBUG_REVEAL.tsx set to true */
   debugName?: string

   /** so you can check if the reveal is part of the same semantic group */
   revealGroup?: string

   /** @since 2024-07-23 */
   relativeTo?: `#${string}` | 'mouse' | 'anchor'

   // placement
   placement?: RevealPlacement

   /**
    * @deprecated
    * unused for now, backword compatibility with rsuite
    */
   enterable?: boolean

   // components / slots -------------------------------------------------------------
   /** @since 2024-07-23 */
   shell?: FC<RevealShellProps> | KnownShells
   content: FC<RevealContentProps> // | null
   children?: React.ReactNode //, React.ReactNode]
   title?: React.ReactNode // only for popup

   // callbacks if we need to add side effects after reveal/hide
   onAnchorKeyDown?: (ev: React.KeyboardEvent) => void
   onRevealed?: (rst: RevealState) => void
   onBeforeHide?: (ev: RevealCloseEvent) => void
   onHidden?: (reason: RevealHideReason) => void

   // SHOW triggers ------------------------------------------------------------------
   /** preset that comes with a bunch show and hide triggers */
   trigger?: RevealPresetName | RevealPresetName[]

   hideTriggers?: RevealHideTriggers
   showTriggers?: RevealShowTriggers

   // delays ------------------------------------------------------------------
   hideDelay?: number /** only for hover */
   showDelay?: number /** only for hover */

   // ... ------------------------------------------------------------------
   defaultVisible?: boolean

   // look and feel ------------------------------------------------------------------
   shellClassName?: string
   className?: string
   style?: React.CSSProperties

   // avoid extra div ------------------------------------------------------------------
   UNSAFE_cloned?: boolean

   sharedAnchorRef?: React.RefObject<HTMLDivElement>

   // #region backdrop stuff
   backdropColor?: string
   hasBackdrop?: boolean
   showBackdrop?: boolean

   /**
    * when we have nested Reveals but they actually are independent
    */
   useSeparateTower?: boolean

   /**
    * Advanced feature:
    * if you need to open modal programmatically, outside of
    * a react component, the RevealUI won't be able to retrieve
    * it's parent tower from the react context. in that case, you'll need
    * to pass that.
    *
    */
   parentRevealState?: RevealStateLazy

   // 🔴 actually the child may not accept DovProps...
   anchorProps?: React.HTMLAttributes<HTMLDivElement>
}
