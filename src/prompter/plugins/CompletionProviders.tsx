import { STATE } from 'src/front/state'
import { wildcards } from 'src/wildcards/wildcards'
import { LexicalNode } from 'lexical'
import { makeAutoObservable } from 'mobx'
import { ReactElement, ReactNode } from 'react'
import { $createBooruNode } from '../nodes/BooruNode'
import { $createEmbeddingNode } from '../nodes/EmbeddingNode'
import { $createLoraNode } from '../nodes/LoraNode'
import { $createWildcardNode } from '../nodes/WildcardNode'
import { CompletionOption } from './CushyCompletionPlugin'
import { DanbooruTag } from 'src/booru/BooruLoader'
import { EmbeddingName } from 'src/models/Schema'

const _providerCache = new Map<string, CopmletionProvider>()
// ----------------------------------------------------------------------
export class CompletionState {
    // COMPLETIONS
    static getEmbeddingCompletionProvider = (st: STATE) => {
        const key = 'embedding'
        if (_providerCache.has(key)) return _providerCache.get(key)!
        const createNode = (t: EmbeddingName) => $createEmbeddingNode(t)
        const menuLabel = <span tw='text-red-500'>embedding:</span>
        const provider = new CopmletionProvider({
            getValues: () =>
                st.schema.data.embeddings.map((x) => ({
                    trigger: ':',
                    title: x,
                    keywords: [x],
                    value: x,
                    createNode,
                    menuLabel,
                })),
        })
        _providerCache.set(key, provider)
        return provider
    }

    // LORA
    static getLoraCompletionProvider = (st: STATE) => {
        const key = 'Completion'
        if (_providerCache.has(key)) return _providerCache.get(key)!
        const menuLabel = <span tw='text-blue-500'>lora:</span>
        const createNode = (t: Enum_LoraLoader_lora_name) =>
            $createLoraNode({ name: t as any, strength_clip: 1, strength_model: 1 })
        const provider = new CopmletionProvider({
            getValues: () =>
                st.schema.getLoras().map((x) => ({
                    trigger: '@',
                    title: x.replaceAll('\\', '/').replace('.safetensors', ''),
                    keywords: [x],
                    value: x,
                    createNode,
                    menuLabel,
                })),
        })
        _providerCache.set(key, provider)
        return provider
    }
    static getWildcardCompletionProvider = (st: STATE) => {
        const key = 'Wildcard'
        if (_providerCache.has(key)) return _providerCache.get(key)!
        const createNode = (t: string) => $createWildcardNode(t)
        const menuLabel = <span tw='text-yellow-500'>wildcard:</span>
        const provider = new CopmletionProvider({
            getValues: () =>
                Object.entries(wildcards).map(([x, values]) => ({
                    trigger: '*',
                    menuLabel,
                    title: x,
                    keywords: values,
                    value: x,
                    createNode,
                })),
        })
        _providerCache.set(key, provider)
        return provider
    }
    static getBooruCompletionProvider = (st: STATE) => {
        const key = 'Booru'
        if (_providerCache.has(key)) return _providerCache.get(key)!
        const createNode = (t: DanbooruTag) => $createBooruNode(t)
        const menuLabel = <span tw='text-yellow-500'>danbooru:</span>
        const provider = new CopmletionProvider({
            getValues: () =>
                st.danbooru.tags.map((x) => ({
                    trigger: '&',
                    title: x.text,
                    keywords: x.aliases,
                    value: x,
                    createNode,
                    menuLabel,
                })),
        })
        _providerCache.set(key, provider)
        return provider
    }

    providers: CopmletionProvider[] = []
    constructor(
        public st: STATE,
        features: {
            lora?: boolean
            embedding?: boolean
            wildcard?: boolean
            booru?: boolean
        },
    ) {
        if (features.embedding) this.providers.push(CompletionState.getEmbeddingCompletionProvider(st))
        if (features.lora) this.providers.push(CompletionState.getLoraCompletionProvider(st))
        if (features.wildcard) this.providers.push(CompletionState.getWildcardCompletionProvider(st))
        if (features.booru) this.providers.push(CompletionState.getBooruCompletionProvider(st))
        makeAutoObservable(this)
    }
    get rawCandidates(): CompletionCandidate<any>[] {
        return this.providers.flatMap((p) => p.values)
    }
    get completionOptions(): CompletionOption<any>[] {
        return this.rawCandidates.map((x) => new CompletionOption(x))
    }
}

// ----------------------------------------------------------------------
export type CompletionCandidate<T> = {
    title: string
    keywords: string[]
    value: T
    createNode: (value: T) => LexicalNode
    menuLabel: ReactElement
    trigger: string
}
export type CompletionProviderProps<T> = {
    getValues: () => Array<CompletionCandidate<T>>
}

// ----------------------------------------------------------------------
export class CopmletionProvider<T = any> {
    constructor(public p: CompletionProviderProps<T>) {
        makeAutoObservable(this)
    }
    get values() {
        return this.p.getValues()
    }
}
