import { runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'

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
                runInAction(() => {
                    const width = e[0].contentRect.width
                    const height = e[0].contentRect.height
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
