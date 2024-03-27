import { runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'

import { bang } from '../../utils/misc/bang'

type RefFn = (e: HTMLDivElement | null) => void
type DynamicSize = {
    width: Maybe<number>
    height: Maybe<number>
    observer: ResizeObserver
}

export const useSizeOf = (): { refFn: RefFn; size: DynamicSize } => {
    const size = useLocalObservable(
        (): DynamicSize => ({
            observer: new ResizeObserver((e, obs) => {
                const e0 = bang(e[0])
                runInAction(() => {
                    const width = e0.contentRect.width
                    const height = e0.contentRect.height
                    size.width = width
                    size.height = height
                })
            }),
            width: undefined as Maybe<number>,
            height: undefined as Maybe<number>,
        }),
    )
    const ro = size.observer
    const refFn = (e: HTMLDivElement | null) => {
        if (e == null) return ro.disconnect()
        ro.observe(e)
    }
    return { refFn, size }
}
