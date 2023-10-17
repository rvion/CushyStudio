import { observer, useLocalObservable } from 'mobx-react-lite'

import { PafUI } from '../actions/ActionPanel'

export const GraphUI = observer(function GraphUI_(p: { depth: number }) {
    const uiSt = useLocalObservable(() => ({ sizes: [100, 300, 150] }))

    return (
        // todo move elsewhere
        <div style={{ height: '100%' }}>
            <PafUI />
        </div>
    )
})
