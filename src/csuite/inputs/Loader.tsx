import type { RSSize } from '../types/RsuiteTypes'

import { observer } from 'mobx-react-lite'

export const Loader = observer((p: { size?: RSSize; className?: string }) => (
   <span
      //
      className={p.className}
      tw={[`loading loading-spinner loading-${p.size ?? 'sm'}`]}
   ></span>
))
