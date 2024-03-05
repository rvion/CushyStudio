import { observer } from 'mobx-react-lite'

import { wagon1 } from './wagons/wagon1'
import { WagonUI } from './engine/WagonUI'

// console.log(`[🤠] wagon1`, wagon1)
export const Panel_Playground = observer(function Panel_Playground_(p: {}) {
    console.log(`[🤠] yay`)
    // const wagon1 = (window as any).CushyObservableCache.wagon1
    return <WagonUI wagon={wagon1} />
})
