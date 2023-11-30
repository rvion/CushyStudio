
declare type TableNameInDB =
    | 'migrations'
    | 'users'
    | 'graph'
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

declare type MigrationsID = Branded<string, { MigrationsID: true }>
declare type UsersID = Branded<string, { UsersID: true }>
declare type GraphID = Branded<string, { GraphID: true }>
declare type DraftID = Branded<string, { DraftID: true }>
declare type ProjectID = Branded<string, { ProjectID: true }>
declare type StepID = Branded<string, { StepID: true }>
declare type ComfyPromptID = Branded<string, { ComfyPromptID: true }>
declare type ComfySchemaID = Branded<string, { ComfySchemaID: true }>
declare type MediaTextID = Branded<string, { MediaTextID: true }>
declare type MediaVideoID = Branded<string, { MediaVideoID: true }>
declare type MediaImageID = Branded<string, { MediaImageID: true }>
declare type Media3dDisplacementID = Branded<string, { Media3dDisplacementID: true }>
declare type RuntimeErrorID = Branded<string, { RuntimeErrorID: true }>
