import React from 'react'

export type PanelID = string

type PanelCtxData = {
    id: PanelID
}

export const panelContext = React.createContext<PanelCtxData | null>(null)

export const usePanel = (): PanelCtxData => {
    const data = React.useContext(panelContext)
    if (data == null) throw new Error('n❌ not in a Panel')
    return data
}
