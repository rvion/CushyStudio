// import fetch from 'node-fetch'
import { makeAutoObservable } from 'mobx'

// https://github.com/civitai/civitai/wiki/REST-API-Reference#get-apiv1models

// civitai wrapper
export class Civitai {
    query: string = ''

    selectedResult: Maybe<CivitaiSearchResultItem> = null
    results: Maybe<CivitaiSearchResult> = null

    constructor() {
        makeAutoObservable(this)
    }

    search = async (p: {
        //
        limit?: number | string
        page?: number | string
        query?: string
        tag?: string
        username?: string
    }) => {
        console.log('[CIVITAI] search:', 'https://civitai.com/api/v1/models', p)
        const res = await fetch('https://civitai.com/api/v1/models?' + new URLSearchParams(p as any), {
            method: 'GET',
            // query: p,
            // body: Body.json(p),
        })
        // 🔴 ?
        const x: CivitaiSearchResult = (await res.json()) as any
        // console.log('[CIVITAI] found:', res.data)
        this.results = x
        return x
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
    /* The download url to get the model file for this specific version */
    downloadUrl: string
    /* The words used to trigger the model */
    trainedWords: string[]

    files: {
        /* The size of the model file*/
        sizeKb: number
        /* The format of the file */
        format: 'pickle' | 'safetensor'
        /* Status of the pickle scan*/
        pickleScanResult: 'Pending' | 'Success' | 'Danger' | 'Error'
        /* Status of the virus scan */
        virusScanResult: 'Pending' | 'Success' | 'Danger' | 'Error'
        /** The date in which the file was scanned */
        scannedAt: Date | null
        /** If the file is the primary file for the model version */
        primary: boolean | undefined
    }[]
    images: ModelImage[]
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
