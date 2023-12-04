import { assets } from 'src/utils/assets/assets'
import { Panel_AppList } from '../Panel_AppList'
import { Panel_Civitai } from '../Panel_Civitai'
import { Panel_ComfyNodeExplorer } from '../Panel_ComfyNodeExplorer'
import { Panel_ComfyUI } from '../Panel_ComfyUI'
import { Panel_ComfyUIHosts } from '../Panel_ComfyUIHosts'
import { Panel_Config } from '../Panel_Config'
import { Panel_CurrentDraft } from '../Panel_CurrentDraft'
import { Panel_Draft } from '../Panel_Draft'
import { Panel_DraftJsonResult } from '../Panel_DraftJsonResult'
import { Panel_DraftJsonSerial } from '../Panel_DraftJsonSerial'
import { Panel_CardPicker3UI } from '../Panel_FullScreenLibrary'
import { Panel_Gallery } from '../Panel_Gallery'
import { Panel_LastGraph } from '../Panel_LastGraph'
import { Panel_Marketplace } from '../Panel_Marketplace'
import { Panel_Minipaint } from '../Panel_Minipaint'
import { Panel_Output } from '../Panel_Output'
import { Panel_Squoosh } from '../Panel_Squoosh'
import { Panel_LastStep, Panel_Steps } from '../Panel_Steps'
import { Panel_TypeDoc } from '../Panel_TypeDoc'
import { Panel_ViewImage } from '../Panel_ViewImage'
import { PropsOf } from './Layout'

// prettier-ignore
export const panels = {
    // image related
    Gallery:             { name: 'Gallery',             widget: Panel_Gallery,           header: (p: PropsOf<typeof Panel_Gallery          >) => ({title: '🎑 Gallery',          icon: undefined                               }) },
    Paint:               { name: 'Paint',               widget: Panel_Minipaint,         header: (p: PropsOf<typeof Panel_Minipaint        >) => ({title: '🎨 Paint',            icon: assets.public_minipaint_images_logo_svg }) },
    Image:               { name: 'Image',               widget: Panel_ViewImage,         header: (p: PropsOf<typeof Panel_ViewImage        >) => ({title: '🎇 Image',            icon: undefined                               }) },

    // apps & marketplace
    Marketplace:         { name: 'Marketplace',         widget: Panel_Marketplace,       header: (p: PropsOf<typeof Panel_Marketplace      >) => ({title: 'Marketplace',         icon: assets.public_CushyLogo_512_png         }) },
    Deck:                { name: 'Deck',                widget: Panel_ComfyNodeExplorer, header: (p: PropsOf<typeof Panel_ComfyNodeExplorer>) => ({title: 'Deck',                icon: undefined                               }) },
    FileList:            { name: 'FileList',            widget: Panel_AppList,          header: (p: PropsOf<typeof Panel_AppList         >) => ({title: 'FileList',            icon: undefined                               }) },

    // ComfyUI
    ComfyUI:             { name: 'ComfyUI',             widget: Panel_ComfyUI,           header: (p: PropsOf<typeof Panel_ComfyUI          >) => ({title: 'ComfyUI',             icon: assets.public_ComfyUILogo_png           }) },
    ComfyUINodeExplorer: { name: 'ComfyUINodeExplorer', widget: Panel_ComfyNodeExplorer, header: (p: PropsOf<typeof Panel_ComfyNodeExplorer>) => ({title: 'ComfyUINodeExplorer', icon: assets.public_ComfyUILogo_png           }) },

    // misc
    Output:              { name: 'Output',              widget: Panel_Output,            header: (p: PropsOf<typeof Panel_Output           >) => ({title: 'Output',              icon: undefined                               }) },
    Steps:               { name: 'Steps',               widget: Panel_Steps,             header: (p: PropsOf<typeof Panel_Steps            >) => ({title: 'Steps',               icon: undefined                               }) },
    LastGraph:           { name: 'LastGraph',           widget: Panel_LastGraph,         header: (p: PropsOf<typeof Panel_LastGraph        >) => ({title: '⏱️ LastGraph',        icon: undefined                               }) },
    LastImage:           { name: 'LastImage',           widget: Panel_ViewImage,         header: (p: PropsOf<typeof Panel_ViewImage        >) => ({title: '⏱️ LastImage',        icon: undefined                               }) },
    // LastLatent:          { name: 'LastLatent',          widget: Panel_ViewLatent,        header: (p: PropsOf<typeof Panel_ViewLatent       >) => ({title: '⏱️ LastLatent',       icon: undefined                               }) },
    LastStep:            { name: 'LastStep',            widget: Panel_LastStep,          header: (p: PropsOf<typeof Panel_LastStep         >) => ({title: 'LastStep',            icon: undefined                               }) },
    CardPicker3UI:       { name: 'CardPicker3UI',       widget: Panel_CardPicker3UI,     header: (p: PropsOf<typeof Panel_CardPicker3UI    >) => ({title: 'CardPicker3UI',       icon: undefined                               }) },
    Draft:               { name: 'Draft',               widget: Panel_Draft,             header: (p: PropsOf<typeof Panel_Draft            >) => ({title: 'Draft',               icon: undefined                               }) },
    DraftJsonResult:     { name: 'DraftJsonResult',     widget: Panel_DraftJsonResult,   header: (p: PropsOf<typeof Panel_DraftJsonResult  >) => ({title: 'DraftJsonResult',     icon: undefined                               }) },
    DraftJsonSerial:     { name: 'DraftJsonSerial',     widget: Panel_DraftJsonSerial,   header: (p: PropsOf<typeof Panel_DraftJsonSerial  >) => ({title: 'DraftJsonSerial',     icon: undefined                               }) },
    CurrentDraft:        { name: 'CurrentDraft',        widget: Panel_CurrentDraft,      header: (p: PropsOf<typeof Panel_CurrentDraft     >) => ({title: 'CurrentDraft',        icon: undefined                               }) },
    // DisplacedImage:      { name: 'DisplacedImage',      widget: Panel_3dScene,           header: (p: PropsOf<typeof Panel_3dScene          >) => ({title: 'DisplacedImage',      icon: undefined                               }) },

    // utils
    Civitai:             { name: 'Civitai',             widget: Panel_Civitai,           header: (p: PropsOf<typeof Panel_Civitai          >) => ({title: 'Civitai',             icon: assets.public_CivitaiLogo_png           }) },
    Squoosh:             { name: 'Squoosh',             widget: Panel_Squoosh,           header: (p: PropsOf<typeof Panel_Squoosh          >) => ({title: 'Squoosh',             icon: undefined                               }) },

    // config
    Config:              { name: 'Config',              widget: Panel_Config,            header: (p: PropsOf<typeof Panel_Config           >) => ({title: 'Config',              icon: undefined                               }) },
    Hosts:               { name: 'Hosts',               widget: Panel_ComfyUIHosts,    header: (p: PropsOf<typeof Panel_ComfyUIHosts   >) => ({title: 'Hosts',               icon: undefined                               }) },

    // doc & help
    TypeDoc:             { name: 'TypeDoc',             widget: Panel_TypeDoc,           header: (p: PropsOf<typeof Panel_ComfyUIHosts   >) => ({title: 'TypeDoc',             icon: assets.public_typescript_512_png        }) },

}
export type Panels = typeof panels
export type Panel = keyof Panels
