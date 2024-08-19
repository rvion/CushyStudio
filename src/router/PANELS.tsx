import { PanelScript } from '../panels/Panel_Script'
import { PanelSquoosh } from '../panels/Panel_Squoosh'
import { PanelAppLibrary } from '../panels/PanelAppLibrary/PanelAppLibrary'
import { PanelCanvas } from '../panels/PanelCanvas/PanelCanvas'
import { PanelCivitai } from '../panels/PanelCivitai/Panel_Civitai'
import { PanelComfy } from '../panels/PanelComfy/PanelComfy'
import { PanelComfyHosts } from '../panels/PanelComfyHosts/Panel_ComfyUIHosts'
import { PanelComfyNodeExplorer } from '../panels/PanelComfyNodeExplorer/Panel_ComfyNodeExplorer'
import { PanelConfig, PanelSettings } from '../panels/PanelConfig/PanelConfig'
import { PanelCustom } from '../panels/PanelCustom/PanelCustom'
import { PanelDraft } from '../panels/PanelDraft/PanelDraft'
import { PanelDraftSerial } from '../panels/PanelDraftSerial/PanelDraftSerial'
import { PanelDraftValue } from '../panels/PanelDraftValue/PanelDraftValue'
import { PanelGallery } from '../panels/PanelGallery/PanelGallery'
import { PanelIcon } from '../panels/PanelIcons/PanelIcons'
import { PanelIframe } from '../panels/PanelIFrame/PanelIFrame'
import { PanelImport } from '../panels/PanelImport/PanelImport'
import { PanelLastGraph } from '../panels/PanelLastGraph/PanelLastGraph'
import { PanelLastStep } from '../panels/PanelLastStep/PanelLastStep'
import { PanelMarketplace } from '../panels/PanelMarketplace/Panel_Marketplace'
import { PanelMinipaint } from '../panels/PanelMinipaint/Panel_Minipaint'
import { PanelModels } from '../panels/PanelModels/Panel_Models'
import { PanelStep } from '../panels/PanelOutput/PanelOutput'
import { PanelPlayground } from '../panels/PanelPlayground/PanelPlayground'
import { PanelSafetyRatings } from '../panels/PanelSafetyRatings/PanelSafetyRatings'
import { PanelShortcuts } from '../panels/PanelShortcuts/PanelShortcuts'
import { PanelSteps } from '../panels/PanelSteps/Panel_Steps'
import { PanelTreeExplorer } from '../panels/PanelTreeExplorer/PanelTreeExplorer'
import { PanelLastImage, PanelViewImage } from '../panels/PanelViewImage/Panel_ViewImage'
import { PanelWelcome } from '../panels/PanelWelcome/PanelWelcome'
import { Panel } from './Panel'

export const panels = {
    // Image
    Gallery: PanelGallery,
    Paint: PanelMinipaint,
    Canvas: PanelCanvas,
    Image: PanelViewImage,
    SafetyRatings: PanelSafetyRatings,

    // apps & marketplace
    Marketplace: PanelMarketplace,
    TreeExplorer: PanelTreeExplorer,
    Import: PanelImport,

    // ComfyUI
    ComfyUI: PanelComfy,
    ComfyUINodeExplorer: PanelComfyNodeExplorer,

    // misc
    Output: PanelStep,
    Steps: PanelSteps,
    LastGraph: PanelLastGraph,
    LastImage: PanelLastImage,
    LastStep: PanelLastStep,
    Custom: PanelCustom,

    // App
    Welcome: PanelWelcome,
    PanelAppLibrary: PanelAppLibrary,

    // Draft
    Draft: PanelDraft,
    DraftJsonResult: PanelDraftValue,
    DraftJsonSerial: PanelDraftSerial,
    Script: PanelScript,

    // DevTools
    Icons: PanelIcon,
    Playground: PanelPlayground,

    // iframe utils
    IFrame: PanelIframe,
    Civitai: PanelCivitai,
    Squoosh: PanelSquoosh,

    // config
    Config: PanelConfig,
    Settings: PanelSettings,
    Models: PanelModels,
    Hosts: PanelComfyHosts,
    Shortcuts: PanelShortcuts,
} satisfies { [k in string]: Panel<any> }

export const allPanels: Panel<any>[] = Object.values(panels)

export type Panels = typeof panels
export type PanelName = keyof Panels
