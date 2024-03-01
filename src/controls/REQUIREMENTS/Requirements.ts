import type { KnownCustomNode_File } from 'src/manager/custom-node-list/KnownCustomNode_File'
import type { KnownCustomNode_Title } from 'src/manager/custom-node-list/KnownCustomNode_Title'
import type { KnownCustomNode_CushyName } from 'src/manager/extension-node-map/KnownCustomNode_CushyName'
import type { KnownModel_Base } from 'src/manager/model-list/KnownModel_Base'
import type { KnownModel_Name } from 'src/manager/model-list/KnownModel_Name'
import type { ModelInfo } from 'src/manager/model-list/model-list-loader-types'

export type Requirements =
    // models
    | { type: 'modelInCivitai'; civitaiURL: string; optional?: true; base: KnownModel_Base }
    | { type: 'modelInManager'; modelName: KnownModel_Name; optional?: true }
    | { type: 'modelCustom'; infos: ModelInfo; optional?: true }
    // custom nodes
    | { type: 'customNodesByTitle'; title: KnownCustomNode_Title; optional?: true }
    | { type: 'customNodesByURI'; uri: KnownCustomNode_File; optional?: true }
    | { type: 'customNodesByNameInCushy'; nodeName: KnownCustomNode_CushyName; optional?: true }
