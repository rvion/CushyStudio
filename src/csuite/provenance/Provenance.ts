import { createContext, useContext } from 'react'

export type Provenance = {
    uri: string
    open(): Promise<void> | void
}

export const ProvenanceCtx = createContext<Maybe<Provenance>>(null)

export const useProvenance = (): Maybe<Provenance> => {
    return useContext(ProvenanceCtx)
}
