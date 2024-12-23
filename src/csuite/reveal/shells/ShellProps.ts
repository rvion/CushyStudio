import type { RevealComputedPosition } from '../RevealPlacement'
import type { RevealState } from '../RevealState'
import type { ReactNode } from 'react'

export type RevealShellProps = {
   //
   pos: RevealComputedPosition
   reveal: RevealState
   children?: ReactNode
   shellRef: React.RefObject<HTMLDivElement>
}

export type RevealContentProps = {
   reveal: RevealState
}
