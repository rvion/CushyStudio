import type { Tagged, Branded } from 'src/utils/types'
import type { ComfyNodeUID } from './NodeUID'

// REQUEST PAYLOADS ------------------------------------------------
export type ApiPromptInput = {
    client_id: string
    extra_data: { extra_pnginfo: any }
    prompt: any
}

// LIVE UPDATES -----------------------------------------------------
export type WsMsg = WsMsgStatus | WsMsgExecutionStart | WsMsgProgress | WsMsgExecuting | WsMsgExecuted | WsMsgExecutionCached

export type WsMsgStatus = { type: 'status'; data: { sid?: string; status: ComfyStatus } }

// prompt-execution related
export type PromptRelated_WsMsg = WsMsgExecutionStart | WsMsgExecutionCached | WsMsgExecuting | WsMsgProgress | WsMsgExecuted
export type WsMsgExecutionStart = { type: 'execution_start'; data: _WsMsgExecutionStartData }
export type WsMsgExecutionCached = { type: 'execution_cached'; data: _WsMsgExecutionCachedData }
export type WsMsgExecuting = { type: 'executing'; data: _WSMsgExecutingData }
export type WsMsgProgress = { type: 'progress'; data: NodeProgress } // 🔶 this one lacks a prompt_id
export type WsMsgExecuted = { type: 'executed'; data: _WsMsgExecutedData }

export type _WsMsgExecutionStartData = { prompt_id: PromptID }
export type _WsMsgExecutionCachedData = { nodes: ComfyNodeUID[]; prompt_id: PromptID }
export type _WSMsgExecutingData = { prompt_id: PromptID; node: ComfyNodeUID }
export type _WsMsgExecutedData = { node: ComfyNodeUID; output: { images: ComfyImageInfo[] }; prompt_id: PromptID }

// helper types
export type ComfyImageInfo = { filename: string; subfolder: string; type: string }
export type NodeProgress = { value: number; max: number }
export type ComfyStatus = { exec_info: { queue_remaining: number }; sid: string }

// upload
export type ComfyUploadImageResult = { name: string }

/** payload send back when triggering a promp */
export type UUID = Tagged<string, 'UUID'>
export type PromptID = Branded<UUID, 'PromptID'>
export type PromptInfo = {
    prompt_id: PromptID /** uuid */
}
