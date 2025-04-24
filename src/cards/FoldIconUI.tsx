import { Ikon } from '../csuite/icons/iconHelpers'

export const FoldIconUI = obs(function FoldIconUI_(p: {
   //
   val?: boolean
   set?: (next: boolean) => void
}) {
   const val = p.val ?? false
   return val ? <Ikon.mdiChevronRight /> : <Ikon.mdiChevronDown />
})
