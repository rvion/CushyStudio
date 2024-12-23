import type { DisplaySlots } from './RenderSlots'

import { typed } from '../../csuite/utils/typed'

export const renderPresets = {
   noLabel: typed<DisplaySlots<any>>({ Title: null, Icon: null, Indent: null }),
   // inline() {},
}
