import type { PropsOf } from './Layout'

import { Panel_Canvas } from '../panels/Panel_Canvas/Panel_Canvas'
import { Panel_Civitai } from '../panels/Panel_Civitai'
import { Panel_ComfyNodeExplorer } from '../panels/Panel_ComfyNodeExplorer'
import { Panel_ComfyUI } from '../panels/Panel_ComfyUI'
import { Panel_ComfyUIHosts } from '../panels/Panel_ComfyUIHosts'
import { Panel_Config } from '../panels/Panel_Config'
import { Panel_Draft } from '../panels/Panel_Draft/Panel_Draft'
import { Panel_DraftJsonResult } from '../panels/Panel_DraftJsonResult'
import { Panel_DraftJsonSerial } from '../panels/Panel_DraftJsonSerial'
import { Panel_TreeExplorer } from '../panels/Panel_FileExplorer/Panel_TreeExplorer'
import { Panel_FullScreenLibrary } from '../panels/Panel_FullScreenLibrary'
import { Panel_Gallery } from '../panels/Panel_Gallery/Panel_Gallery'
import { Panel_Icons } from '../panels/Panel_Icons/Panel_Icons'
import { Panel_Iframe } from '../panels/Panel_IFrame'
import { Panel_Import } from '../panels/Panel_Import'
import { Panel_LastGraph } from '../panels/Panel_LastGraph'
import { Panel_LastStep } from '../panels/Panel_LastStep/Panel_LastStep'
import { Panel_Marketplace } from '../panels/Panel_Marketplace'
import { Panel_Minipaint } from '../panels/Panel_Minipaint'
import { Panel_Models } from '../panels/Panel_Models/Panel_Models'
import { Panel_Step } from '../panels/Panel_Output/Panel_Output'
import { Panel_Playground } from '../panels/Panel_Playground/Panel_Playground'
import { Panel_Script } from '../panels/Panel_Script'
import { Panel_Shortcuts } from '../panels/Panel_Shortcuts'
import { Panel_Squoosh } from '../panels/Panel_Squoosh'
import { Panel_Steps } from '../panels/Panel_Steps/Panel_Steps'
import { Panel_Custom } from '../panels/Panel_Temporary'
import { Panel_TypeDoc } from '../panels/Panel_TypeDoc'
import { Panel_ViewImage } from '../panels/Panel_ViewImage'
import { Panel_Welcome } from '../panels/Panel_Welcome/Panel_Welcome'
import { assets } from '../utils/assets/assets'

export const panels = {
    // image related
    Icons: {
        name: 'Icons',
        widget: Panel_Icons,
        header: (p: PropsOf<typeof Panel_Gallery>) => ({ title: 'Icons', icon: undefined }),
    },
    Gallery: {
        name: 'Gallery',
        widget: Panel_Gallery,
        header: (p: PropsOf<typeof Panel_Gallery>) => ({ title: '🎑 Gallery', icon: undefined }),
    },
    Paint: {
        name: 'Paint',
        widget: Panel_Minipaint,
        header: (p: PropsOf<typeof Panel_Minipaint>) => ({ title: '🎨 Paint', icon: assets.minipaint_images_logo_svg }),
    },
    Canvas: {
        name: 'Canvas',
        widget: Panel_Canvas,
        header: (p: PropsOf<typeof Panel_Canvas>) => ({ title: '🎨 Canvas', icon: assets.minipaint_images_logo_svg }),
    },
    Image: {
        name: 'Image',
        widget: Panel_ViewImage,
        header: (p: PropsOf<typeof Panel_ViewImage>) => ({ title: '🎇 Image', icon: undefined }),
    },

    // apps & marketplace
    Marketplace: {
        name: 'Marketplace',
        widget: Panel_Marketplace,
        header: (p: PropsOf<typeof Panel_Marketplace>) => ({ title: 'Marketplace', icon: assets.CushyLogo_512_png }),
    },
    Deck: {
        name: 'Deck',
        widget: Panel_ComfyNodeExplorer,
        header: (p: PropsOf<typeof Panel_ComfyNodeExplorer>) => ({ title: 'Deck', icon: undefined }),
    },
    TreeExplorer: {
        name: 'TreeExplorer',
        widget: Panel_TreeExplorer,
        header: (p: PropsOf<typeof Panel_TreeExplorer>) => ({ title: 'FileList', icon: undefined }),
    },
    Import: {
        name: 'Import',
        widget: Panel_Import,
        header: (p: PropsOf<typeof Panel_Import>) => ({ title: 'Import', icon: undefined }),
    },

    // ComfyUI
    ComfyUI: {
        name: 'ComfyUI',
        widget: Panel_ComfyUI,
        header: (p: PropsOf<typeof Panel_ComfyUI>) => ({ title: 'ComfyUI', icon: assets.ComfyUILogo_png }),
    },
    ComfyUINodeExplorer: {
        name: 'ComfyUINodeExplorer',
        widget: Panel_ComfyNodeExplorer,
        header: (p: PropsOf<typeof Panel_ComfyNodeExplorer>) => ({ title: 'ComfyUINodeExplorer', icon: assets.ComfyUILogo_png }),
    },

    // misc
    Output: {
        name: 'Output',
        widget: Panel_Step,
        header: (p: PropsOf<typeof Panel_Step>) => ({ title: 'Output', icon: undefined }),
    },
    Steps: {
        name: 'Steps',
        widget: Panel_Steps,
        header: (p: PropsOf<typeof Panel_Steps>) => ({ title: 'Steps', icon: undefined }),
    },
    LastGraph: {
        name: 'LastGraph',
        widget: Panel_LastGraph,
        header: (p: PropsOf<typeof Panel_LastGraph>) => ({ title: '⏱️ LastGraph', icon: undefined }),
    },
    LastImage: {
        name: 'LastImage',
        widget: Panel_ViewImage,
        header: (p: PropsOf<typeof Panel_ViewImage>) => ({ title: '⏱️ LastImage', icon: undefined }),
    },
    // LastLatent:       { name: 'LastLatent',          widget: Panel_ViewLatent,        header: (p: PropsOf<typeof Panel_ViewLatent       >) => ({title: '⏱️ LastLatent',       icon: undefined                      }) },
    LastStep: {
        name: 'LastStep',
        widget: Panel_LastStep,
        header: (p: PropsOf<typeof Panel_LastStep>) => ({ title: 'LastStep', icon: undefined }),
    },
    FullScreenLibrary: {
        name: 'FullScreenLibrary',
        widget: Panel_FullScreenLibrary,
        header: (p: PropsOf<typeof Panel_FullScreenLibrary>) => ({ title: 'FullScreenLibrary', icon: undefined }),
    },
    Draft: {
        name: 'Draft',
        widget: Panel_Draft,
        header: (p: PropsOf<typeof Panel_Draft>) => ({ title: 'Draft', icon: undefined }),
    },
    DraftJsonResult: {
        name: 'DraftJsonResult',
        widget: Panel_DraftJsonResult,
        header: (p: PropsOf<typeof Panel_DraftJsonResult>) => ({ title: 'DraftJsonResult', icon: undefined }),
    },
    DraftJsonSerial: {
        name: 'DraftJsonSerial',
        widget: Panel_DraftJsonSerial,
        header: (p: PropsOf<typeof Panel_DraftJsonSerial>) => ({ title: 'DraftJsonSerial', icon: undefined }),
    },
    Script: {
        name: 'Script',
        widget: Panel_Script,
        header: (p: PropsOf<typeof Panel_Script>) => ({ title: 'Script', icon: undefined }),
    },
    Welcome: {
        name: 'Welcome',
        widget: Panel_Welcome,
        header: (p: PropsOf<typeof Panel_Welcome>) => ({ title: 'Welcome', icon: undefined }),
    },
    Playground: {
        name: 'Playground',
        widget: Panel_Playground,
        header: (p: PropsOf<typeof Panel_Playground>) => ({ title: 'Welcome', icon: undefined }),
    },
    // DisplacedImage:      { name: 'DisplacedImage',      widget: Panel_3dScene,           header: (p: PropsOf<typeof Panel_3dScene          >) => ({title: 'DisplacedImage',      icon: undefined                      }) },

    // utils
    Civitai: {
        name: 'Civitai',
        widget: Panel_Civitai,
        header: (p: PropsOf<typeof Panel_Civitai>) => ({ title: 'Civitai', icon: assets.CivitaiLogo_png }),
    },
    Squoosh: {
        name: 'Squoosh',
        widget: Panel_Squoosh,
        header: (p: PropsOf<typeof Panel_Squoosh>) => ({ title: 'Squoosh', icon: undefined }),
    },
    IFrame: {
        name: 'IFrame',
        widget: Panel_Iframe,
        header: (p: PropsOf<typeof Panel_Squoosh>) => ({ title: 'IFrame', icon: undefined }),
    },

    // config
    Config: {
        name: 'Config',
        widget: Panel_Config,
        header: (p: PropsOf<typeof Panel_Config>) => ({ title: 'Config', icon: undefined }),
    },
    Models: {
        name: 'Models',
        widget: Panel_Models,
        header: (p: PropsOf<typeof Panel_Models>) => ({ title: 'Models', icon: undefined }),
    },
    Hosts: {
        name: 'Hosts',
        widget: Panel_ComfyUIHosts,
        header: (p: PropsOf<typeof Panel_ComfyUIHosts>) => ({ title: 'Hosts', icon: undefined }),
    },
    Shortcuts: {
        name: 'Shortcuts',
        widget: Panel_Shortcuts,
        header: (p: PropsOf<typeof Panel_Shortcuts>) => ({ title: 'Shortcuts', icon: undefined }),
    },

    // doc & help
    TypeDoc: {
        name: 'TypeDoc',
        widget: Panel_TypeDoc,
        header: (p: PropsOf<typeof Panel_TypeDoc>) => ({ title: 'TypeDoc', icon: assets.typescript_512_png }),
    },

    Custom: {
        name: 'Temporary',
        widget: Panel_Custom,
        header: (p: PropsOf<typeof Panel_Custom>) => ({ title: 'Temporary', icon: assets.typescript_512_png }),
    },
}

export type Panels = typeof panels
export type PanelNames = keyof Panels
