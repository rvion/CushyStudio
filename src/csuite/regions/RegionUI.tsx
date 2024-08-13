import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useEffect, useMemo } from 'react'

import { Frame, type FrameProps } from '../frame/Frame'
import { regionMonitor } from './RegionMonitor'

type RegionUIOwnProps<T = any> = {
    // own Props
    regionCtx: React.Context<T>
    regionValue: T
    regionName: string
}

/**
 * regions are wrappers around react context that
 * enable custom shortcuts / commands inside them
 */
export const RegionUI = observer(function RegionUI_<T extends any>({
    regionCtx,
    regionValue,
    regionName,
    ...rest
}: RegionUIOwnProps<T> & FrameProps) {
    const uid = useMemo(() => nanoid(), [])
    useEffect(() => {
        regionMonitor.knownRegions.set(uid, { ctx: regionCtx, value: regionValue })
        return (): void => void regionMonitor.knownRegions.delete(uid)
    })
    const regionCls = 'Region-' + regionName + '-' + uid
    return (
        <regionCtx.Provider value={regionValue}>
            <Frame {...rest} tw={regionCls} />
        </regionCtx.Provider>
    )
})
