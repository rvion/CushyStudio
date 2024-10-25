import type { KnownCustomNode_File } from '../custom-node-list/KnownCustomNode_File'
import type { KnownCustomNode_Title } from '../custom-node-list/KnownCustomNode_Title'
import type { KnownCustomNode_CushyName } from '../extension-node-map/KnownCustomNode_CushyName'
import type { KnownModel_Base } from '../model-list/KnownModel_Base'
import type { KnownModel_Name } from '../model-list/KnownModel_Name'
import type { ModelInfo } from '../model-list/model-list-loader-types'

/**
 * cushy-specific types to allow
 * 2024-03-13 rvion: TODO: split outside of this file, add a new type-level config for
 * project-specific FormNode metadata
 */

export type Requirements =
   // models
   | {
        type: 'modelInCivitai'
        civitaiModelId: string
        optional?: true
        base: KnownModel_Base
     }
   | { type: 'modelInManager'; modelName: KnownModel_Name; optional?: true }
   | { type: 'modelCustom'; infos: ModelInfo; optional?: true }
   // custom nodes
   | { type: 'customNodesByTitle'; title: KnownCustomNode_Title; optional?: true }
   | { type: 'customNodesByURI'; uri: KnownCustomNode_File; optional?: true }
   | { type: 'customNodesByNameInCushy'; nodeName: KnownCustomNode_CushyName; optional?: true }
