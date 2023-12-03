// https://openrouter.ai/docs#responses
// Definitions of subtypes are below

export type OpenRouterResponse = {
   id: string
   // Depending on whether you set "stream" to "true" and
   // whether you passed in "messages" or a "prompt", you
   // will get a different output shape
   choices: (NonStreamingChoice | StreamingChoice | NonChatChoice | Error)[]
   created: number // Unix timestamp
   model: string
   object: 'chat.completion'
}

// Subtypes:

type NonChatChoice = {
   finish_reason: string | null
   text: string
   message: undefined // 🔶
}

type NonStreamingChoice = {
   finish_reason: string | null // Depends on the model. Ex: 'stop' | 'length' | 'content_filter' | 'tool_calls' | 'function_call'
   message: {
      content: string | null
      role: string
      tool_calls?: ToolCall[]
      // Deprecated, replaced by tool_calls
      function_call?: FunctionCall
   }
}

type StreamingChoice = {
   finish_reason: string | null
   message: undefined // 🔶
   delta: {
      content: string | null
      role?: string
      tool_calls?: ToolCall[]
      // Deprecated, replaced by tool_calls
      function_call?: FunctionCall
   }
}

type Error = {
   code: number // See "Error Handling" section
   message: string
}

type FunctionCall = {
   name: string
   message: undefined // 🔶
   arguments: string // JSON format arguments
}

type ToolCall = {
   id: string
   message: undefined // 🔶
   type: 'function'
   function: FunctionCall
}
