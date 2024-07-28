import { PanelCanvas } from '../panels/Panel_Canvas/Panel_Canvas'
import { PanelGallery } from '../panels/Panel_Gallery/Panel_Gallery'
import { PanelIcon } from '../panels/Panel_Icons/Panel_Icons'
import { PanelModels } from '../panels/Panel_Models/Panel_Models'
import { PanelStep } from '../panels/Panel_Output/Panel_Output'
import { PanelPlayground } from '../panels/Panel_Playground/Panel_Playground'
import { PanelScript } from '../panels/Panel_Script'
import { PanelSquoosh } from '../panels/Panel_Squoosh'
import { PanelSteps } from '../panels/Panel_Steps/Panel_Steps'
import { PanelWelcome } from '../panels/Panel_Welcome/Panel_Welcome'
import { PanelAppLibrary } from '../panels/PanelAppLibrary/PanelAppLibrary'
import { PanelCivitai } from '../panels/PanelCivitai/Panel_Civitai'
import { PanelComfy } from '../panels/PanelComfy/PanelComfy'
import { PanelComfyHosts } from '../panels/PanelComfyHosts/Panel_ComfyUIHosts'
import { PanelComfyNodeExplorer } from '../panels/PanelComfyNodeExplorer/Panel_ComfyNodeExplorer'
import { PanelConfig } from '../panels/PanelConfig/PanelConfig'
import { PanelCustom } from '../panels/PanelCustom/PanelCustom'
import { PanelDraft } from '../panels/PanelDraft/Panel_Draft'
import { PanelDraftSerial } from '../panels/PanelDraftSerial/PanelDraftSerial'
import { PanelDraftValue } from '../panels/PanelDraftValue/PanelDraftValue'
import { PanelIframe } from '../panels/PanelIFrame/PanelIFrame'
import { PanelImport } from '../panels/PanelImport/PanelImport'
import { PanelLastGraph } from '../panels/PanelLastGraph/PanelLastGraph'
import { PanelLastStep } from '../panels/PanelLastStep/PanelLastStep'
import { PanelMarketplace } from '../panels/PanelMarketplace/Panel_Marketplace'
import { PanelMinipaint } from '../panels/PanelMinipaint/Panel_Minipaint'
import { PanelShortcuts } from '../panels/PanelShortcuts/PanelShortcuts'
import { PanelTreeExplorer } from '../panels/PanelTreeExplorer/PanelTreeExplorer'
import { PanelLastImage, PanelViewImage } from '../panels/PanelViewImage/Panel_ViewImage'
import { Panel } from './Panel'

export const panels = {
    // Image
    Gallery: PanelGallery,
    Paint: PanelMinipaint,
    Canvas: PanelCanvas,
    Image: PanelViewImage,

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
    Models: PanelModels,
    Hosts: PanelComfyHosts,
    Shortcuts: PanelShortcuts,
} satisfies { [k in string]: Panel<any> }

export const allPanels: Panel<any>[] = Object.values(panels)

export type Panels = typeof panels
export type PanelName = keyof Panels
