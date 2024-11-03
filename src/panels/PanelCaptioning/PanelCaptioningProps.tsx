import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'

import { RegionUI } from '../../csuite/regions/RegionUI'
import { usePanel } from '../../router/usePanel'
import { PanelCaptioningCtx } from './PanelCaptioningCtx'
import { PanelCaptioningState } from './PanelCaptioningState'
import { PanelCaptioningUI } from './PanelCaptioningUI'

export type PanelCaptioningProps = {}

export const PanelCaptioningWrapperUI = observer(function PanelCaptioningUI_(p: PanelCaptioningProps) {
   // 💬 2024-11-03 rvion: save current folder to panel block storage, so we can restore it
   // both on hot-reload, or regular app restart
   const store = usePanel().usePersistentStore<{ folder: string | null }>('curr-folder', () => ({
      folder: null,
   }))

   const inputRefCaption = useRef<HTMLInputElement>(null)
   const inputRefCaptionGlobal = useRef<HTMLInputElement>(null)

   const state = useMemo(
      () =>
         new PanelCaptioningState({
            startFolder: store.data.folder,
            onFolderChange(next): void { store.saveData({ folder: next }) }, // prettier-ignore
            inputRefCaption,
            inputRefCaptionGlobal,
         }),
      [],
   )
   return (
      <RegionUI regionName='Captioning' regionCtx={PanelCaptioningCtx} regionValue={state}>
         <PanelCaptioningUI />
      </RegionUI>
   )
})
