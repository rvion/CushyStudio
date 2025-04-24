import { createContext, useContext } from 'react'

/**
 * provenance is an abstraction made to help track of where stuff have been define
 * so we can offer quick way to jump to code responsible for what is visible on screen.
 */
export type Provenance = {
   uri?: () => string
   open(): Promise<void> | void
}

export const ProvenanceCtx = createContext<Maybe<Provenance>>(null)

export const useProvenance = (): Maybe<Provenance> => {
   return useContext(ProvenanceCtx)
}
