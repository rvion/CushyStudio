import type { RenderProps } from './RenderProps'

import { typed } from '../../csuite/utils/typed'

// todo: remove
export const renderPresets = {
   noLabel: typed<RenderProps<any>>({ Title: null, Icon: null, Indent: null }),
   // inline() {},
}
