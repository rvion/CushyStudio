declare type TableNameInDB =
    | 'comfy_workflow'
    | 'draft'
    | 'project'
    | 'step'
    | 'comfy_prompt'
    | 'comfy_schema'
    | 'media_text'
    | 'media_video'
    | 'media_image'
    | 'media_3d_displacement'
    | 'runtime_error'
    | 'media_splat'
    | 'custom_data'
    | 'cushy_script'
    | 'cushy_app'
    | 'auth'
    | 'tree_entry'
    | 'host'
    | 'media_custom'
    | 'perspective'

declare type CushyViewID = Tagged<string, { CushyViewID: true }>
declare type ComfyWorkflowID = Tagged<string, { ComfyWorkflowID: true }>
declare type DraftID = Tagged<string, { DraftID: true }>
declare type ProjectID = Tagged<string, { ProjectID: true }>
declare type StepID = Tagged<string, { StepID: true }>
declare type ComfyPromptID = Tagged<string, { ComfyPromptID: true }>
declare type ComfySchemaID = Tagged<string, { ComfySchemaID: true }>
declare type MediaTextID = Tagged<string, { MediaTextID: true }>
declare type MediaVideoID = Tagged<string, { MediaVideoID: true }>
declare type MediaImageID = Tagged<string, { MediaImageID: true }>
declare type Media3dDisplacementID = Tagged<string, { Media3dDisplacementID: true }>
declare type RuntimeErrorID = Tagged<string, { RuntimeErrorID: true }>
declare type MediaSplatID = Tagged<string, { MediaSplatID: true }>
declare type CustomDataID = Tagged<string, { CustomDataID: true }>
declare type CushyScriptID = Tagged<string, { CushyScriptID: true }>
declare type CushyAppID = Tagged<string, { CushyAppID: true }>
declare type AuthID = Tagged<string, { AuthID: true }>
declare type TreeEntryID = Tagged<string, { TreeEntryID: true }>
declare type HostID = Tagged<string, { HostID: true }>
declare type MediaCustomID = Tagged<string, { MediaCustomID: true }>
declare type PerspectiveID = Tagged<string, { PerspectiveID: true }>
