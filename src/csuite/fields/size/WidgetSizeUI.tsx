import type { Field_size } from './FieldSize'

import { observer } from 'mobx-react-lite'

import { WidgetSizeX_LineUI } from './WidgetSizeX_LineUI'
import { WigetSizeXUI } from './WigetSizeXUI'

export const WigetSize_LineUI = observer(function WigetSize_LineUI_(p: { field: Field_size }) {
   return <WidgetSizeX_LineUI size={p.field} bounds={p.field.config} />
})

export const WigetSize_BlockUI = observer(function WigetSize_BlockUI_(p: { field: Field_size }) {
   return <WigetSizeXUI size={p.field} />
})
