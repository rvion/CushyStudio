import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'

export const ShellNoneUI = observer(function ShellNoneUI_(p: RevealShellProps) {
   return p.children
})
