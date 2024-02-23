import type { Runtime } from './Runtime'
import type { OpenRouter_Models } from 'src/llm/OpenRouter_models'
import type { OpenRouterRequest } from 'src/llm/OpenRouter_Request'
import type { OpenRouterResponse } from 'src/llm/OpenRouter_Response'

import { makeAutoObservable } from 'mobx'

import { OpenRouter_ask } from 'src/llm/OpenRouter_ask'
import { openRouterInfos } from 'src/llm/OpenRouter_infos'

/** namespace for all store-related utils */
export class RuntimeLLM {
    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    // ---------------------------
    // LOCAL LLM PART GOES HERE
    // 👉 .. TODO
    // ---------------------------

    /** verify key is ready */
    isConfigured = async () => {
        return !!this.rt.Cushy.configFile.value.OPENROUTER_API_KEY
    }

    /** geenric function to ask open router anything */
    ask_OpenRouter = async (p: OpenRouterRequest): Promise<OpenRouterResponse> => {
        return await OpenRouter_ask(this.rt.Cushy.configFile.value.OPENROUTER_API_KEY, p)
    }

    /** dictionary of all known openrouter models */
    allModels = openRouterInfos

    /** turn any simple request into an LLM */
    expandPrompt = async (
        /** description / instruction of  */
        basePrompt: string,
        /**
         * the list of all openRouter models available
         * 🔶 may not be up-to-date; last updated on 2023-12-03
         * */
        model: OpenRouter_Models = 'openai/gpt-3.5-turbo-instruct',
    ): Promise<{
        prompt: string
        llmResponse: OpenRouterResponse
    }> => {
        const res: OpenRouterResponse = await OpenRouter_ask(this.rt.Cushy.configFile.value.OPENROUTER_API_KEY, {
            max_tokens: 300,
            model: model,
            messages: [
                {
                    role: 'system',
                    content: [
                        //
                        `You are an assistant in charge of writing a prompt to be submitted to a stable distribution ai image generative pipeline.`,
                        `Write a prompt describing the user submited topic in a way that will help the ai generate a relevant image.`,
                        `Your answer must be arond 500 chars in length`,
                        `Start with most important words describing the prompt`,
                        `Include lots of adjective and adverbs. no full sentences. remove useless words`,
                        `try to include a long list of comma separated words.`,
                        'Once main keywords are in, if you still have character to add, include vaiours beauty or artsy words',
                        `ONLY answer with the prompt itself. DO NOT answer anything else. No Hello, no thanks, no signature, no nothing.`,
                    ].join('\n'),
                },
                {
                    role: 'user',
                    content: basePrompt,
                },
                // { role: 'user', content: 'Who are you?' },
            ],
        })
        if (res.choices.length === 0) throw new Error('no choices in response')
        const msg0 = res.choices[0].message
        if (msg0 == null) throw new Error('choice 0 is null')
        if (typeof msg0 === 'string') throw new Error('choice 0 seems to be an error')
        return {
            prompt: msg0.content ?? '',
            llmResponse: res,
        }
    }
}
