import type { RSSize } from '../types/RsuiteTypes'

export const Loader = obs((p: { size?: RSSize; className?: string }) => (
   <span
      //
      className={p.className}
      tw={[`loading loading-spinner loading-${p.size ?? 'sm'}`]}
   ></span>
))
