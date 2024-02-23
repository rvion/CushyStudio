import type { Runtime } from './Runtime'

import { makeAutoObservable } from 'mobx'

import { ImageStore, ImageStoreT } from 'src/back/ImageStore'
import { LiveTable } from 'src/db/LiveTable'
import { CustomData_C, CustomDataT } from 'src/db/TYPES.gen'
import { CustomDataL } from 'src/models/CustomData'
import { bang } from 'src/utils/misc/bang'
import { exhaust } from 'src/utils/misc/ComfyUtils'

export type StoreScope = 'global' | 'app' | 'draft' | 'run'

/** namespace for all store-related utils */
export class RuntimeStore {
    private CustomDataTable: LiveTable<CustomDataT, CustomData_C, CustomDataL<any>>
    private imageStoresIndex = new Map<string, ImageStore>()

    constructor(private rt: Runtime) {
        this.CustomDataTable = rt.Cushy.db.custom_datas
        makeAutoObservable(this)
    }

    // generic stores
    // you can type them the way you want when creating them
    getOrThrow = <T>(p: {
        /** scope key */
        key: string
        /**
         * used to prefix the store key
         * @defaults to 'app'
         */
        scope?: StoreScope
    }): CustomDataL<T> => {
        const scope = p.scope ?? 'app'
        const prefix = this.mkPrefixForScope(scope)
        const finalKey = `${prefix}/${p.key}`
        return this.CustomDataTable.getOrThrow(finalKey)
    }

    getOrCreate = <T>(p: {
        /** scope key */
        key: string
        /**
         * used to prefix the store key
         * @defaults to 'app'
         */
        scope?: StoreScope
        makeDefaultValue: () => T
    }): CustomDataL<T> => {
        const scope = p.scope ?? 'app'
        const prefix = this.mkPrefixForScope(scope)
        const finalKey = `${prefix}/${p.key}`
        return this.CustomDataTable.getOrCreate(
            //
            finalKey,
            () => ({
                id: finalKey,
                json: p.makeDefaultValue(),
            }),
        )
    }

    /**
     * those are specifically made for images, and hoked into ComfyUI workflows
     * all tagged ComfyUI nodes outputing an image will updte the store
     */
    getImageStore = (
        //
        storeName: string,
        /** default to 'app' */
        scope: StoreScope = 'app',
    ): ImageStore => {
        const prefix = this.mkPrefixForScope(scope)
        const storeID = `${prefix}/imageStore/${storeName}`
        const prev = this.imageStoresIndex.get(storeID)
        if (prev) return prev
        const rawStore: CustomDataL<ImageStoreT> = this.getOrCreate({
            key: storeID,
            scope: 'global',
            makeDefaultValue: () => ({}),
        })
        const store = new ImageStore(rawStore /*p.autoUpdate*/)
        this.imageStoresIndex.set(storeID, store)
        return store
    }

    private mkPrefixForScope = (scope: StoreScope) => {
        if (scope === 'global') return ''
        if (scope === 'app') return `app:${this.rt.step.app.id}`
        if (scope === 'draft') return `draft:${bang(this.rt.step.data.draftID)}`
        if (scope === 'run') return `run:${this.rt.step.id}`
        return exhaust(scope)
    }
}
