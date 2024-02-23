// import fetch from 'node-fetch'
import { makeAutoObservable } from 'mobx'

import { Kwery } from 'src/utils/misc/Kwery'

// https://github.com/civitai/civitai/wiki/REST-API-Reference#get-apiv1models

export class Debounced<T> {
    constructor(
        //
        private _value: T,
        public delay: number = 700 /* ms */,
    ) {
        makeAutoObservable(this)
    }

    private _debouncedValue: T = this._value
    get debouncedValue(): T {
        return this._debouncedValue
    }

    get value(): T { return this._value } // prettier-ignore
    set value(v: T) {
        this._value = v
        this.setDebouncedValue(v)
    }

    _timer: any = null
    setDebouncedValue = (v: T) => {
        clearTimeout(this._timer)
        this._timer = setTimeout(() => {
            this._debouncedValue = this._value
        }, 300)
    }
}

// civitai wrapper
export class Civitai {
    query = new Debounced(cushy.civitaiConf.fields.defaultQuery.value ?? '', 300)
    selectedResult: Maybe<CivitaiSearchResultItem> = null

    get results(): Maybe<Kwery<CivitaiSearchResult>> {
        if (!this.query.debouncedValue) return null
        return this.search({ query: this.query.debouncedValue })
    }

    constructor() {
        console.log(`[🤠] CREATING CIVITAI wrapper 🔴`)
        makeAutoObservable(this)
    }

    search = (p: {
        //
        limit?: number | string
        page?: number | string
        query?: string
        tag?: string
        username?: string
    }): Kwery<CivitaiSearchResult> => {
        return Kwery.get('civitai-search', p, async (): Promise<CivitaiSearchResult> => {
            console.log('[CIVITAI] search:', 'https://civitai.com/api/v1/models', p)
            const res = await fetch('https://civitai.com/api/v1/models?' + new URLSearchParams(p as any), {
                method: 'GET',
                // query: p,
                // body: Body.json(p),
            })
            // 🔴 ?
            const x: CivitaiSearchResult = (await res.json()) as any
            return x
        })
        // console.log('[CIVITAI] found:', res.data)
        // this.results = x
    }
}

export type CivitaiSearchResult = {
    items: CivitaiSearchResultItem[]
    metadata: SearchResultMetadata
}

export type CivitaiSearchResultItem = {
    /*	The identifier for the model */
    id: number
    /*	The name of the model */
    name: string
    /*	The description of the model (HTML) */
    description: string
    /* The model type */
    type: 'Checkpoint' | 'TextualInversion' | 'Hypernetwork' | 'AestheticGradient' | 'LORA' | 'Controlnet' | 'Poses'
    /*	Whether the model is NSFW or not */
    nsfw: boolean
    /* The tags associated with the model */
    tags: string[]
    creator: {
        /* The name of the creator */
        username: string
        /* The url of the creators avatar */
        image: string | null
    }
    modelVersions: CivitaiModelVersion[]
}

export type CivitaiModelVersion = {
    /* The identifier for the model version */
    id: number
    /* The name of the model version */
    name: string
    /* The description of the model version (usually a changelog) */
    description: string
    /* The date in which the version was created */
    createdAt: Date
    /* The base model used to train the model */
    baseModel: string
    /* The download url to get the model file for this specific version */
    downloadUrl: string
    /* The words used to trigger the model */
    trainedWords: string[]

    files: CivitaiDownloadableFile[]
    images: ModelImage[]
}

export type CivitaiDownloadableFile = {
    id: number
    sizeKB: number
    name: string
    type: 'Model' | 'VAE' | string // 'Model'
    metadata: { fp: string; size: string; format: string } //{ fp: 'fp16'; size: 'pruned'; format: 'SafeTensor' }
    pickleScanResult: Maybe<string> // 'Success'
    pickleScanMessage: Maybe<string> // 'No Pickle imports'
    virusScanResult: Maybe<string> // 'Success'
    virusScanMessage: Maybe<string> // null
    scannedAt: Maybe<string> // '2024-01-08T04:52:42.578Z'
    hashes: {
        [key: string]: string
        // AutoV1: 'E577480D'
        // AutoV2: '67AB2FD8EC'
        // SHA256: '67AB2FD8EC439A89B3FEDB15CC65F54336AF163C7EB5E4F2ACC98F090A29B0B3'
        // CRC32: 'CFAD6694'
        // BLAKE3: 'E0BB278C0127A4AC4267498174E0226D6A0A77A636BDF82B770CF05D5B85D3CA'
        // AutoV3: 'E023C143436DDAEFFAB33359D830E02E26545BBD97D3E28ABFC78A921A33618B'
    }
    downloadUrl: string // 'https://civitai.com/api/download/models/290640'
    primary: boolean // true
}

export type ModelImage = {
    /** The url for the image */
    url: string
    /** Whether or not the image is NSFW (note: if the model is NSFW, treat all images on the model as NSFW) */
    nsfw: string
    /** The original width of the image */
    width: number
    /** The original height of the image */
    height: number
    /** The blurhash of the image */
    hash: string
    /** The generation params of the image */
    meta: object | null
}

type SearchResultMetadata = {
    /*The total number of items available*/
    totalItems: string
    /*The the current page you are at*/
    currentPage: string
    /*The the size of the batch*/
    pageSize: string
    /*The total number of pages*/
    totalPages: string
    /*The url to get the next batch of items*/
    nextPage: string
    /*The url to get the previous batch of items*/
    prevPage: string
}
