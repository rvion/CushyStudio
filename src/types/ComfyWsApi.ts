import type { ComfyNodeID } from './NodeUID'

// REQUEST PAYLOADS ------------------------------------------------
export type ApiPromptInput = {
    client_id: string
    extra_data: { extra_pnginfo: any }
    prompt: any
}

// LIVE UPDATES -----------------------------------------------------
export type WsMsg =
    | WsMsgStatus
    | WsMsgExecutionStart
    | WsMsgProgress
    | WsMsgExecuting
    | WsMsgExecuted
    | WsMsgExecutionCached
    | WsMsgExecutionError

export type WsMsgStatus = { type: 'status'; data: { sid?: string; status: ComfyStatus } }

// prompt-execution related
export type PromptRelated_WsMsg =
    | WsMsgExecutionStart
    | WsMsgExecutionCached
    | WsMsgExecuting
    | WsMsgProgress
    | WsMsgExecuted
    | WsMsgExecutionError

export type WsMsgExecutionStart = { type: 'execution_start'; data: _WsMsgExecutionStartData }
export type WsMsgExecutionCached = { type: 'execution_cached'; data: _WsMsgExecutionCachedData }
export type WsMsgExecuting = { type: 'executing'; data: _WSMsgExecutingData }
export type WsMsgProgress = { type: 'progress'; data: NodeProgress } // 🔶 this one lacks a prompt_id
export type WsMsgExecuted = { type: 'executed'; data: _WsMsgExecutedData }
export type WsMsgExecutionError = { type: 'execution_error'; data: _WsMsgExecutionErrorData }

export type _WsMsgExecutionStartData = { prompt_id: PromptID }
export type _WsMsgExecutionCachedData = { nodes: ComfyNodeID[]; prompt_id: PromptID }
export type _WSMsgExecutingData = { prompt_id: PromptID; node: ComfyNodeID }
export type _WsMsgExecutedData = { node: ComfyNodeID; output: { images: ComfyImageInfo[] }; prompt_id: PromptID }

// helper types
export type ComfyUploadImageResult = { name: Enum_LoadImage_image; subfolder: string; type: string }
export type ComfyImageInfo = { filename: string; subfolder: string; type: string }
export type NodeProgress = { value: number; max: number }
export type ComfyStatus = { exec_info: { queue_remaining: number }; sid: string }

/** payload send back when triggering a promp */
export type UUID = Tagged<string, 'UUID'>
export type PromptID = Branded<UUID, { PromptID: true }>
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
