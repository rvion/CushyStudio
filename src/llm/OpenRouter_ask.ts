import type { OpenRouterRequest } from './OpenRouter_Request'
import type { OpenRouterResponse } from './OpenRouter_Response'

export const OpenRouter_ask = async (
    //
    OPENROUTER_API_KEY: Maybe<string>,
    req: OpenRouterRequest,
): Promise<OpenRouterResponse> => {
    if (!OPENROUTER_API_KEY) throw new Error('Missing OPENROUTER_API_KEY')

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
}
