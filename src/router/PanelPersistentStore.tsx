import type { Json } from '../csuite/types/Json'
import type { PanelPersistedJSON } from './PanelPersistedJSON'
import type { PanelState } from './PanelState'

import { isObservable } from 'mobx'

// import { makeAutoObservable } from 'mobx'

export class PanelPersistentStore<X extends Json = Json> {
    /** data is loaded lazilly, but is not synced automatically
     * you need to call `save` to set it back in the tab data
     */
    data: X

    constructor(
        //
        public panelState: PanelState,
        public storeKey: string,
        /** default value */
        public init: () => X,
    ) {
        this.data = this.loadData()
        // makeAutoObservable(this)
    }

    saveData(data: X): void {
        const tabId = this.panelState.uri
        const prevConfig = this.panelState.getConfig()
        this.data = data
        this.panelState.layout.do((a) => {
            const nextConfig: PanelPersistedJSON = {
                ...prevConfig,
                $store: {
                    ...prevConfig.$store,
                    [this.storeKey]: data,
                },
            }
            // ⏸️ console.log(`[🔴] prevConfig`, JSON.stringify(prevConfig, null, 4))
            // ⏸️ console.log(`[🔴] nextConfig`, JSON.stringify(nextConfig, null, 4))
            return a.updateNodeAttributes(tabId, { config: nextConfig })
        })
    }

    /** return the store JSON or initialize it */
    loadData(): X {
        const config = this.panelState.getConfig()
        if (isObservable(config)) {
            throw new Error('❌nope❌')
        }
        const store = config.$store
        const prevValue = store?.[this.storeKey]
        return prevValue == null //
            ? this.init()
            : (prevValue as X)
    }
}
