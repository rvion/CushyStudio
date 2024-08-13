import { z } from 'zod'

import { type ComfyNodeID, ComfyNodeID$Schema } from './ComfyNodeID'

// PromptID ------------------------------------------------------
export type PromptID = ComfyPromptID // Branded<UUID, { ComfyPromptID: true }>
export const PromptID$Schema = z.string({ description: 'PromptID' })

// REQUEST PAYLOADS ------------------------------------------------
export type ApiPromptInput = {
    client_id: string
    extra_data: { extra_pnginfo: any }
    prompt: any
}

// MISC -------------------------------------------------------------
export type NodeProgress = { value: number; max: number }
export const NodeProgress$Schema = z.object({
    value: z.number(),
    max: z.number(),
})

// LIVE UPDATES ----------------------------------------------------
export type WsMsgStatus = {
    type: 'status'
    data: {
        sid?: string
        status: ComfyStatus
    }
}
export const WsMsgStatus$Schema = z.object({
    type: z.literal('status'),
    data: z.object({
        sid: z.string().nullish(),
        status: z.object({
            exec_info: z.object({ queue_remaining: z.number() }),
            sid: z.string().nullish(),
        }),
    }),
})

export type WsMsgExecutionStart = { type: 'execution_start'; data: _WsMsgExecutionStartData }
export const WsMsgExecutionStart$Schema = z.object({
    type: z.literal('execution_start'),
    data: z.object({ prompt_id: PromptID$Schema }),
})

export type WsMsgExecutionCached = { type: 'execution_cached'; data: _WsMsgExecutionCachedData }
export const WsMsgExecutionCached$Schema = z.object({
    type: z.literal('execution_cached'),
    data: z.object({
        prompt_id: PromptID$Schema,
        nodes: z.array(ComfyNodeID$Schema),
    }),
})

export type _WSMsgExecutingData = {
    prompt_id: PromptID
    node?: Maybe<ComfyNodeID>
}
export const _WSMsgExecutingData$Schema = z.object({
    prompt_id: PromptID$Schema,
    node: ComfyNodeID$Schema.nullish(),
})

export type WsMsgExecuting = { type: 'executing'; data: _WSMsgExecutingData }
export const WsMsgExecuting$Schema = z.object({
    type: z.literal('executing'),
    data: _WSMsgExecutingData$Schema,
})

export type WsMsgProgress = { type: 'progress'; data: NodeProgress } // 🔶 this one lacks a prompt_id
export const WsMsgProgress$Schema = z.object({
    type: z.literal('progress'),
    data: NodeProgress$Schema,
})

export type WsMsgExecuted = { type: 'executed'; data: _WsMsgExecutedData }
export const WsMsgExecuted$Schema = z.object({
    type: z.literal('executed'),
    data: z.lazy(() => _WsMsgExecutedData$Schema),
})

export type WsMsgExecutionError = { type: 'execution_error'; data: _WsMsgExecutionErrorData }
export const WsMsgExecutionError$Schema = z.object({
    type: z.literal('execution_error'),
    data: z.lazy(() => _WsMsgExecutionErrorData$Schema),
})

// added on 2024-03-19:
// comfy manager inject a custom node called "Terminal Log (Manager)"
// https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/085b8c1fcf33d4d4a9d970163acd6d53201b2a89.jpg
// this node allow to dislay logs without having to connect to the remote instance
// as of 2024-03-19, payload looks like this:
// {"type": "manager-terminal-feedback", "data": {"data": "#read_workflow_json_files_all"}}
export type WSMsgManagerFeedback = { type: 'manager-terminal-feedback'; data: { data: string } }
export const WSMsgManagerFeedback$Schema = z.object({
    type: z.literal('manager-terminal-feedback'),
    data: z.object({ data: z.string() }),
})

export type _WsMsgExecutionStartData = { prompt_id: PromptID }
export const _WsMsgExecutionStartData$Schema = z.object({
    prompt_id: PromptID$Schema,
})

export type _WsMsgExecutionCachedData = { nodes: ComfyNodeID[]; prompt_id: PromptID }
export const _WsMsgExecutionCachedData$Schema = z.object({
    nodes: z.array(ComfyNodeID$Schema),
    prompt_id: PromptID$Schema,
})

export type ComfyImageInfo = { filename: string; subfolder: string; type: string }
export const ComfyImageInfo$Schema = z.object({
    filename: z.string(),
    subfolder: z.string(),
    type: z.string(),
})

export type _WsMsgExecutedData = {
    node: ComfyNodeID
    output: {
        previews?: { filepath: string }[]
        images?: ComfyImageInfo[]
    }
    prompt_id: PromptID
}
export const _WsMsgExecutedData$Schema = z.object({
    node: ComfyNodeID$Schema,
    output: z.object({
        images: z.array(ComfyImageInfo$Schema).nullish(),
        previews: z.array(z.object({ filepath: z.string() })).nullish(),
    }),
    prompt_id: PromptID$Schema,
})

// helper types
export type ComfyUploadImageResult = {
    name: Enum_LoadImage_image
    subfolder: string
    type: string
}

export type ComfyStatus = { exec_info: { queue_remaining: number }; sid: string }

export type PromptInfo = {
    prompt_id: PromptID /** uuid */
}

export type _WsMsgExecutionErrorData = {
    prompt_id: PromptID // '0fb0dda2-f4a3-4cfe-b7fe-7a9d86afc70f'
    node_id: ComfyNodeID //  'SICMTxvV25dfKQ_d5LV-4'
    node_type: string //  'CLIPTextEncode'
    executed: ComfyNodeID[] // ['KAB-bO_kp2P64k6nD5Wfw', 'vGgpI72fJSaT81NRgmH8D']
    exception_message: string // "shape '[4096, 1024]' is invalid for input of size 2359296"
    exception_type: string // 'RuntimeError'
    traceback: string[]
    //     [
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\execution.py", line 141, in recursive_execute\n    output_data, output_ui = get_output_data(obj, input_data_all)\n',
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\execution.py", line 75, in get_output_data\n    return_values = map_node_over_list(obj, input_data_all, obj.FUNCTION, allow_interrupt=True)\n',
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\execution.py", line 68, in map_node_over_list\n    results.append(getattr(obj, func)(**slice_dict(input_data_all, i)))\n',
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\nodes.py", line 52, in encode\n    return ([[clip.encode(text), {}]], )\n',
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\comfy\\sd.py", line 515, in encode\n    return self.encode_from_tokens(tokens)\n',
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\comfy\\sd.py", line 506, in encode_from_tokens\n    raise e\n',
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\comfy\\sd.py", line 501, in encode_from_tokens\n    self.patcher.patch_model()\n',
    //     '  File "C:\\Users\\user\\dev\\intuition\\ComfyUI\\comfy\\sd.py", line 382, in patch_model\n    weight += (alpha * torch.mm(mat1.flatten(start_dim=1).float(), mat2.flatten(start_dim=1).float())).reshape(weight.shape).type(weight.dtype).to(weight.device)\n',
    // ]
    current_inputs: any
    //  {
    //     text: ['some text']
    //     clip: ['<comfy.sd.CLIP object at 0x000001CFDF5FD450>']
    // }
    current_outputs: any
    // {
    //     'KAB-bO_kp2P64k6nD5Wfw': [
    //         ['<comfy.sd.ModelPatcher object at 0x000001CF14DAE6B0>'],
    //         ['<comfy.sd.CLIP object at 0x000001CF14BEECB0>'],
    //         ['<comfy.sd.VAE object at 0x000001D0B3E5BC10>'],
    //         [null],
    //     ]
    //     vGgpI72fJSaT81NRgmH8D: [
    //         ['<comfy.sd.ModelPatcher object at 0x000001D0B3E5BA90>'],
    //         ['<comfy.sd.CLIP object at 0x000001CFDF5FD450>'],
    //     ]
    // }
}
export const _WsMsgExecutionErrorData$Schema = z.object({
    prompt_id: PromptID$Schema,
    node_id: ComfyNodeID$Schema,
    node_type: z.string(),
    executed: z.array(ComfyNodeID$Schema),
    exception_message: z.string(),
    exception_type: z.string(),
    traceback: z.array(z.string()),
    current_inputs: z.record(z.any()),
    current_outputs: z.record(z.any()),
})

// UNION TYPES ----------------------------------------------------
// prompt-execution related
export type PromptRelated_WsMsg =
    | WsMsgExecutionStart
    | WsMsgExecutionCached
    | WsMsgExecuting
    | WsMsgProgress
    | WsMsgExecuted
    | WsMsgExecutionError

export const ProptRelated_WsMsg_Schema = () =>
    z.discriminatedUnion('type', [
        WsMsgExecutionStart$Schema,
        WsMsgExecutionCached$Schema,
        WsMsgExecuting$Schema,
        WsMsgProgress$Schema,
        WsMsgExecuted$Schema,
        WsMsgExecutionError$Schema,
    ])

// LIVE UPDATES ----------------------------------------------------
export type WsMsg =
    | WsMsgStatus
    | WSMsgManagerFeedback
    //
    | WsMsgExecutionStart
    | WsMsgExecutionCached
    | WsMsgExecuting
    | WsMsgProgress
    | WsMsgExecuted
    | WsMsgExecutionError

export const WsMsg$Schema = z.discriminatedUnion('type', [
    WsMsgStatus$Schema,
    WSMsgManagerFeedback$Schema,
    //
    WsMsgExecutionStart$Schema,
    WsMsgExecutionCached$Schema,
    WsMsgExecuting$Schema,
    WsMsgProgress$Schema,
    WsMsgExecuted$Schema,
    WsMsgExecutionError$Schema,
])
