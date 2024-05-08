import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useContext, useEffect, useMemo } from 'react'

import { regionMonitor } from './RegionMonitor'

/** regions are wrappers around react context that enable custom shortcuts / commands inside them */
export const RegionUI = observer(function RegionUI_<T extends any>(p: {
    //
    className?: string
    ctx: React.Context<T>
    value: T
    name: string
    children?: React.ReactNode
}) {
    const uid = useMemo(() => nanoid(), [])
    useEffect(() => {
        regionMonitor.knownRegions.set(uid, { ctx: p.ctx, value: p.value })
        return () => void regionMonitor.knownRegions.delete(uid)
    })
    return (
        <p.ctx.Provider value={p.value}>
            <div className={'Region-' + p.name + '-' + uid} tw={p.className}>
                {p.children}
            </div>
        </p.ctx.Provider>
    )
})
