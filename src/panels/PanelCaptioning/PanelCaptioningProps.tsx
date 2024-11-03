import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { RegionUI } from '../../csuite/regions/RegionUI'
import { PanelCaptioningCtx } from './PanelCaptioningCtx'
import { PanelCaptioningState } from './PanelCaptioningState'
import { PanelCaptioningUI } from './PanelCaptioningUI'

export type PanelCaptioningProps = {}

export const PanelCaptioningWrapperUI = observer(function PanelCaptioningUI_(p: PanelCaptioningProps) {
   const state = useMemo(() => new PanelCaptioningState(), [])
   const doc = state
   return (
      <RegionUI regionName='Captioning' regionCtx={PanelCaptioningCtx} regionValue={state}>
         <PanelCaptioningUI />
      </RegionUI>
   )
})
