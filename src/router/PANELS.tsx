import { Panel_Canvas } from '../panels/Panel_Canvas/Panel_Canvas'
import { Panel_ComfyNodeExplorer } from '../panels/Panel_ComfyNodeExplorer'
import { Panel_ComfyUI } from '../panels/Panel_ComfyUI'
import { Panel_Draft } from '../panels/Panel_Draft/Panel_Draft'
import { Panel_DraftJsonResult } from '../panels/Panel_DraftJsonResult'
import { Panel_DraftJsonSerial } from '../panels/Panel_DraftJsonSerial'
import { Panel_TreeExplorer } from '../panels/Panel_FileExplorer/Panel_TreeExplorer'
import { Panel_FullScreenLibrary } from '../panels/Panel_FullScreenLibrary'
import { PanelGallery } from '../panels/Panel_Gallery/Panel_Gallery'
import { PanelIcon } from '../panels/Panel_Icons/Panel_Icons'
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
import { Panel_ViewImage } from '../panels/Panel_ViewImage'
import { Panel_Welcome } from '../panels/Panel_Welcome/Panel_Welcome'
import { PanelCivitai } from '../panels/PanelCivitai/Panel_Civitai'
import { PanelComfyHosts } from '../panels/PanelComfyHosts/Panel_ComfyUIHosts'
import { PanelConfig } from '../panels/PanelConfig/PanelConfig'
import { Panel } from './Panel'

export const panels = {
    // image related
    Icons: PanelIcon,
    Gallery: PanelGallery,
    Paint: new Panel({
        name: 'Paint',
        widget: () => Panel_Minipaint,
        header: (p) => ({ title: '🎨 Paint' }),
        def: () => ({}),
        icon: 'mdiPencil',
    }),
    Canvas: new Panel({
        name: 'Canvas',
        widget: () => Panel_Canvas,
        header: (p) => ({ title: 'Canvas' }),
        def: () => ({}),
        icon: 'mdiDraw',
    }),
    Image: new Panel({
        name: 'Image',
        widget: () => Panel_ViewImage,
        header: (p) => ({ title: '🎇 Image' }),
        def: () => ({}),
        icon: undefined,
    }),

    // apps & marketplace
    Marketplace: new Panel({
        name: 'Marketplace',
        widget: () => Panel_Marketplace,
        header: (p) => ({ title: 'Marketplace' }),
        def: () => ({}),
        icon: 'mdiCubeScan',
    }),
    Deck: new Panel({
        name: 'Deck',
        widget: () => Panel_ComfyNodeExplorer,
        header: (p) => ({ title: 'Deck' }),
        def: () => ({}),
        icon: undefined,
    }),
    TreeExplorer: new Panel({
        name: 'TreeExplorer',
        widget: () => Panel_TreeExplorer,
        header: (p) => ({ title: 'FileList' }),
        def: () => ({}),
        icon: undefined,
    }),
    Import: new Panel({
        name: 'Import',
        widget: () => Panel_Import,
        header: (p) => ({ title: 'Import' }),
        def: () => ({}),
        icon: undefined,
    }),

    // ComfyUI
    ComfyUI: new Panel({
        name: 'ComfyUI',
        widget: () => Panel_ComfyUI,
        header: (p) => ({ title: 'ComfyUI' }),
        def: () => ({}),
        icon: 'mdiCabinAFrame',
    }),
    ComfyUINodeExplorer: new Panel({
        name: 'ComfyUINodeExplorer',
        widget: () => Panel_ComfyNodeExplorer,
        header: (p) => ({ title: 'ComfyUINodeExplorer' }),
        def: () => ({}),
        icon: 'mdiAccessPoint',
    }),

    // misc
    Output: new Panel({
        name: 'Output',
        widget: () => Panel_Step,
        header: (p) => ({ title: 'Output' }),
        def: () => ({}),
        icon: undefined,
    }),
    Steps: new Panel({
        name: 'Steps',
        widget: () => Panel_Steps,
        header: (p) => ({ title: 'Steps' }),
        def: () => ({}),
        icon: undefined,
    }),
    LastGraph: new Panel({
        name: 'LastGraph',
        widget: () => Panel_LastGraph,
        header: (p) => ({ title: '⏱️ LastGraph' }),
        def: () => ({}),
        icon: undefined,
    }),
    LastImage: new Panel({
        name: 'LastImage',
        widget: () => Panel_ViewImage,
        header: (p) => ({ title: '⏱️ LastImage' }),
        def: () => ({}),
        icon: undefined,
    }),
    // LastLatent:       { name: 'LastLatent',          widget: () => Panel_ViewLatent,        header: (p) => ({title: '⏱️ LastLatent',       icon: undefined                      }) },
    LastStep: new Panel({
        name: 'LastStep',
        widget: () => Panel_LastStep,
        header: (p) => ({ title: 'LastStep' }),
        def: () => ({}),
        icon: undefined,
    }),
    FullScreenLibrary: new Panel({
        name: 'FullScreenLibrary',
        widget: () => Panel_FullScreenLibrary,
        header: (p) => ({ title: 'FullScreenLibrary' }),
        def: () => ({}),
        icon: undefined,
    }),
    Draft: new Panel({
        name: 'Draft',
        widget: () => Panel_Draft,
        header: (p) => ({ title: 'Draft' }),
        def: () => ({ draftID: cushy.db.draft.lastOrCrash().id }),
        icon: undefined,
    }),
    DraftJsonResult: new Panel({
        name: 'DraftJsonResult',
        widget: () => Panel_DraftJsonResult,
        header: (p) => ({ title: 'DraftJsonResult' }),
        def: () => ({ draftID: cushy.db.draft.lastOrCrash().id }),
        icon: undefined,
    }),
    DraftJsonSerial: new Panel({
        name: 'DraftJsonSerial',
        widget: () => Panel_DraftJsonSerial,
        header: (p) => ({ title: 'DraftJsonSerial' }),
        def: () => ({ draftID: cushy.db.draft.lastOrCrash().id }),
        icon: undefined,
    }),
    Script: new Panel({
        name: 'Script',
        widget: () => Panel_Script,
        header: (p) => ({ title: 'Script' }),
        def: () => ({ scriptID: '' /* 🔴 */ }),
        icon: undefined,
    }),
    Welcome: new Panel({
        name: 'Welcome',
        widget: () => Panel_Welcome,
        header: (p) => ({ title: 'Welcome' }),
        def: () => ({}),
        icon: undefined,
    }),
    Playground: new Panel({
        name: 'Playground',
        widget: () => Panel_Playground,
        header: (p) => ({ title: 'Welcome' }),
        def: () => ({}),
        icon: undefined,
    }),
    // DisplacedImage:      { name: 'DisplacedImage',      widget: Panel_3dScene,           header: (p) => ({title: 'DisplacedImage',      icon: undefined                      }) },

    // utils
    Civitai: PanelCivitai,
    Squoosh: new Panel({
        name: 'Squoosh',
        widget: () => Panel_Squoosh,
        header: (p) => ({ title: 'Squoosh' }),
        def: () => ({}),
        icon: undefined,
    }),
    IFrame: new Panel({
        name: 'IFrame',
        widget: () => Panel_Iframe,
        header: (p) => ({ title: 'IFrame' }),
        def: () => ({ url: 'https://app.posemy.art/' }),
        icon: undefined,
    }),

    // config
    Config: PanelConfig,
    Models: new Panel({
        name: 'Models',
        widget: () => Panel_Models,
        header: (p) => ({ title: 'Models' }),
        def: () => ({}),
        icon: undefined,
    }),
    Hosts: PanelComfyHosts,
    Shortcuts: new Panel({
        name: 'Shortcuts',
        widget: () => Panel_Shortcuts,
        header: (p) => ({ title: 'Shortcuts' }),
        def: () => ({}),
        icon: undefined,
    }),

    // // doc & help
    // TypeDoc: new Page({
    //     name: 'TypeDoc',
    //     widget: Panel_TypeDoc,
    //     header: (p) => ({ title: 'TypeDoc' }),
    // icon:() => assets.typescript_512_png
    // }),

    Custom: new Panel({
        name: 'Temporary',
        widget: () => Panel_Custom,
        header: (p) => ({ title: 'Temporary' }),
        def: () => ({ uid: '___', props: {} }),
        icon: 'mdiSourceRepositoryMultiple',
    }),
} satisfies { [k in string]: Panel<any> }

export const allPanels: Panel<any>[] = Object.values(panels)

export type Panels = typeof panels
export type PanelNames = keyof Panels
