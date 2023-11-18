import type { DraftID } from 'src/models/Draft'
import type { STATE } from 'src/state/state'

import * as FL from 'flexlayout-react'
import { Actions, IJsonModel, Layout, Model } from 'flexlayout-react'

import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { FC, createRef } from 'react'
import { CardPath } from 'src/cards/CardPath'
import { LiteGraphJSON } from 'src/core/LiteGraph'
import { ImageID } from 'src/models/Image'
import { Trigger } from 'src/app/shortcuts/Trigger'
import { assets } from 'src/utils/assets/assets'

import { Panel_Draft } from '../Panel_Draft'
// import { Panel_Card } from '../../panels/Panel_Card'
import { Panel_Civitai } from '../Panel_Civitai'
import { Panel_Squoosh } from '../Panel_Squoosh'
import { Panel_LastStep } from '../Panel_Steps'
import { Panel_ViewImage } from '../Panel_ViewImage'
import { Panel_3dScene } from 'src/panels/Panel_3dScene'
import { Panel_CardPicker3UI } from 'src/panels/Panel_FullScreenLibrary'
import { RenderPanelUI } from './RenderPanelUI'
import { Panel_DraftJsonResult } from '../Panel_DraftJsonResult'
import { Panel_DraftJsonSerial } from '../Panel_DraftJsonSerial'

// still on phone
export enum Widget {
    Gallery = 'Gallery', //: { 'Gallery',}
    DisplacedImage = 'DisplacedImage', //: { 'DisplacedImage',}
    Paint = 'Paint', //: { 'Paint',}
    CardPicker3UI = 'CardPicker3UI',
    CurrentDraft = 'CurrentDraft', //: { 'CurrentDraft',}
    // Card = 'Card', //: { 'Card',}
    Draft = 'Draft', //: { 'Draft',}
    DraftJsonResult = 'DraftJsonResult', //: { 'Draft',}
    DraftJsonSerial = 'DraftJsonSerial', //: { 'Draft',}
    ComfyUI = 'ComfyUI', //: { 'ComfyUI',}
    ComfyUINodeExplorer = 'ComfyUINodeExplorer', //: { 'ComfyUINodeExplorer',}
    FileList = 'FileList', //: { 'FileList',}
    // FileList2 = 'FileList2', //: { 'FileList2',}
    LastStep = 'LastStep', //: { 'Steps',}
    Steps = 'Steps', //: { 'Steps',}
    LastGraph = 'LastGraph', //: { 'LastGraph',}
    LastImage = 'LastImage', //: { 'LastIMage',}
    LastLatent = 'LastLatent', //: { 'LastIMage',}
    Civitai = 'Civitai', //: { 'Civitai',}
    Squoosh = 'Squoosh', //: { 'Squoosh',}
    Image = 'Image', //: { 'Image',}
    Marketplace = 'Marketplace', //: { 'Marketplace',}
    Deck = 'Deck', //: { 'Deck',}
    Hosts = 'Hosts', //: { 'Hosts',}
    Config = 'Config', //: { 'Config',}
}

export type PropsOf<T> = T extends FC<infer Props> ? Props : '❌'

type PerspectiveDataForSelect = {
    label: string
    value: string
}

export class CushyLayoutManager {
    model!: Model
    private modelKey = 0
    setModel = (model: Model) => {
        this.model = model
        this.modelKey++
    }
    currentPerspectiveName = 'default'
    allPerspectives: PerspectiveDataForSelect[] = [
        //
        { label: 'default', value: 'default' },
        { label: 'test', value: 'test' },
    ]

    saveCurrent = () => this.saveCurrentAs(this.currentPerspectiveName)
    saveCurrentAsDefault = () => this.saveCurrentAs('default')
    saveCurrentAs = (perspectiveName: string) => {
        const curr: FL.IJsonModel = this.model.toJson()
        this.st.configFile.update((t) => {
            t.layouts_2 ??= {}
            t.layouts_2[perspectiveName] = curr
        })
    }

    resetCurrent = (): void => this.reset(this.currentPerspectiveName)
    resetDefault = (): void => this.reset('default')
    reset = (perspectiveName: string): void => {
        this.st.configFile.update((t) => {
            t.layouts_2 ??= {}
            delete t.layouts_2[perspectiveName]
        })
        if (perspectiveName === this.currentPerspectiveName) {
            this.setModel(Model.fromJson(this.build()))
        }
    }

    constructor(public st: STATE) {
        const prevLayout = st.configFile.value.layouts_2?.default
        const json = prevLayout ?? this.build()
        try {
            this.setModel(Model.fromJson(json))
        } catch (e) {
            console.log('[💠] Layout: ❌ error loading layout', e)
            // ⏸️ console.log('[💠] Layout: ❌ resetting layout')
            // ⏸️ this.st.configFile.update((t) => (t.perspectives = {}))
            this.setModel(Model.fromJson(this.build()))
            // this.setModel(Model.fromJson({ layout: { type: 'row', children: [] } }))
        }
        makeAutoObservable(this)
    }

    layoutRef = createRef<Layout>()
    updateCurrentTab = (p: Partial<FL.TabNode>) => {
        const tab = this.currentTab
        if (tab == null) return
        this.model.doAction(Actions.updateNodeAttributes(tab.getId(), p))
    }

    currentTabSet: Maybe<FL.TabSetNode> = null
    currentTab: Maybe<FL.Node> = null
    currentTabID: Maybe<string> = null
    UI = observer(() => {
        console.log('[💠] Rendering Layout')
        return (
            <Layout //
                onModelChange={(model) => {
                    runInAction(() => {
                        this.currentTabSet = model.getActiveTabset()
                        this.currentTab = this.currentTabSet?.getSelectedNode()
                        this.currentTabID = this.currentTab?.getId()
                    })
                    console.log(`[💠] Layout: 📦 onModelChange`)
                    this.saveCurrentAsDefault()
                }}
                ref={this.layoutRef}
                model={this.model}
                factory={this.factory}
            />
        )
    })

    nextPaintIDx = 0
    addMarketplace = () => this._AddWithProps(Widget.Marketplace, `/marketplace`, { title: 'Marketplace', icon: assets.public_CushyLogo_512_png }) // prettier-ignore
    addDisplacedImage = (p: PropsOf<typeof Panel_3dScene>) => this._AddWithProps(Widget.DisplacedImage, `/DisplacedImage`, { title: 'DisplacedImage', ...p }) // prettier-ignore
    addActionPicker = () => this._AddWithProps(Widget.FileList, `/Library`, { title: 'Library', icon: assets.public_CushyLogo_512_png }) // prettier-ignore
    // addActionPickerTree = () => this._AddWithProps(Widget.FileList2, `/filetree`, { title: 'Library Files', icon: assets.public_CushyLogo_512_png }) // prettier-ignore
    addCivitai = (p: PropsOf<typeof Panel_Civitai>) => this._AddWithProps(Widget.Civitai, `/civitai`, { title: 'CivitAI', icon: assets.public_CivitaiLogo_png }) // prettier-ignore
    addSquoosh = (p: PropsOf<typeof Panel_Squoosh>) => this._AddWithProps(Widget.Squoosh, `/squoosh`, { title: 'Squoosh' /*icon: assets.public_CivitaiLogo_png*/ }) // prettier-ignore
    addConfig = () => this._AddWithProps(Widget.Config, `/config`, { title: 'Config' })
    addPaint = (imgID?: ImageID) => {
        const icon = assets.public_minipaint_images_logo_svg
        if (imgID == null) {
            this._AddWithProps(Widget.Paint, `/paint/blank`, { title: 'Paint', icon })
        } else {
            this._AddWithProps(Widget.Paint, `/paint/${imgID}`, { title: 'Paint', imgID, icon })
        }
    }
    addImage = (imgID: ImageID) => this._AddWithProps(Widget.Image, `/image/${imgID}`, { title: '🎇 Image', imgID })
    addLastStep = (p: PropsOf<typeof Panel_LastStep>) => this._AddWithProps(Widget.LastStep, `/lastStep`, { title: '⎏ Last Step' }) // prettier-ignore
    addLastImage = (p: PropsOf<typeof Panel_ViewImage>) => this._AddWithProps(Widget.LastImage, `/lastImage`, { title: '🎇 Last Image' }) // prettier-ignore
    addGallery = () => this._AddWithProps(Widget.Gallery, `/gallery`, { title: 'Gallery' })
    addHosts = () => this._AddWithProps(Widget.Hosts, `/hosts`, { title: 'Hosts' })
    addComfy = (litegraphJson?: Maybe<LiteGraphJSON>) => {
        const icon = assets.public_ComfyUILogo_png
        if (litegraphJson == null) {
            return this._AddWithProps(Widget.ComfyUI, `/litegraph/blank`, { title: 'Comfy', icon, litegraphJson: null })
        } else {
            const hash = uniqueIDByMemoryRef(litegraphJson)
            return this._AddWithProps(Widget.ComfyUI, `/litegraph/${hash}`, { title: 'Comfy', icon, litegraphJson })
        }
    }
    addComfyNodeExplorer = () => {
        const icon = assets.public_ComfyUILogo_png
        this._AddWithProps(Widget.ComfyUINodeExplorer, `/ComfyUINodeExplorer`, { title: `Node Explorer`, icon })
    }

    addCard = (actionPath: CardPath) => {
        const card = this.st.library.getCard(actionPath)
        if (card == null) return null /* 🔴 add popup somewhere */
        const draft = card.getLastDraft()
        this.addDraft({ draftID: draft?.id ?? '❌' })
        // const icon = af?.illustrationPathWithFileProtocol
        // this._AddWithProps(Widget.Draft, `/action/${actionPath}`, { title: actionPath, actionPath, icon })
    }

    addCurrentDraft = () => this._AddWithProps(Widget.CurrentDraft, `/draft`, { title: 'Current Draft' })

    addDraftJsonResult = (p: PropsOf<typeof Panel_DraftJsonResult>) =>
        this._AddWithProps(Widget.DraftJsonResult, `/DraftJsonResult`, { title: 'Draft JSON Result' })

    addDraftJsonSerial = (p: PropsOf<typeof Panel_DraftJsonSerial>) =>
        this._AddWithProps(Widget.DraftJsonSerial, `/DraftJsonSerial`, { title: 'Draft JSON Serial' })

    addDraft = (p: PropsOf<typeof Panel_Draft>) => {
        const draftID = p.draftID
        const draft = this.st.db.drafts.get(p.draftID)
        const card = draft?.app
        const _img = card?.illustrationPathWithFileProtocol
        const icon = _img?.startsWith('<svg') ? undefined : _img
        const title = card?.displayName ?? 'Draft'
        this._AddWithProps(Widget.Draft, `/draft/${draftID}`, { title, draftID, icon }, 'current')
    }

    renameTab = (tabID: string, newName: string) => {
        const tab = this.model.getNodeById(tabID)
        if (tab == null) return
        this.model.doAction(Actions.renameTab(tabID, newName))
    }

    /** quickly rename the current tab */
    renameCurrentTab = (newName: string) => {
        const tabset = this.model.getActiveTabset()
        if (tabset == null) return
        const tab = tabset.getSelectedNode()
        if (tab == null) return
        const tabID = tab.getId()
        this.model.doAction(Actions.renameTab(tabID, newName))
    }

    closeCurrentTab = () => {
        // 1. find tabset
        const tabset = this.model.getActiveTabset()
        if (tabset == null) return Trigger.UNMATCHED_CONDITIONS
        // 2. find active tab
        const tab = tabset.getSelectedNode()
        if (tab == null) return Trigger.UNMATCHED_CONDITIONS
        // 3. close tab
        const tabID = tab.getId()
        this.model.doAction(Actions.deleteTab(tabID))
        // 4. focus preview tab in the tabset if it exists
        const prevTab = tabset.getSelectedNode()
        if (prevTab != null) this.model.doAction(Actions.selectTab(prevTab.getId()))
        // 5. mark action as success
        return Trigger.Success
    }

    closeTab = (tabID: string) => {
        const shouldRefocusAfter = this.currentTabID === tabID
        this.model.doAction(Actions.deleteTab(tabID))
        return Trigger.Success
    }

    private _AddWithProps = <T extends { icon?: string; title: string }>(
        //
        widget: Widget,
        tabID: string,
        p: T,
        where: 'current' | 'main' = 'main',
    ): Maybe<FL.Node> => {
        // 1. ensure layout is present
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) return void console.log('❌ no currentLayout')

        // 2. get previous tab
        let prevTab: FL.TabNode | undefined
        prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
        console.log(`🦊 prevTab for ${tabID}:`, prevTab)

        // 3. create tab if not prev type
        if (prevTab == null) {
            currentLayout.addTabToTabSet('MAINTYPESET', {
                component: widget,
                id: tabID,
                icon: p.icon,
                name: p.title,
                config: p,
            })
            prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
            if (prevTab == null) return void console.log('❌ no tabAdded')
        } else {
            this.model.doAction(Actions.updateNodeAttributes(tabID, { config: p }))
            this.model.doAction(Actions.selectTab(tabID))
        }
        // 4. merge props
        this.model.doAction(Actions.updateNodeAttributes(tabID, p))
        return prevTab
    }

    fullPageComp: Maybe<{ widget: Widget; extra: PropsOf<typeof Panel_CardPicker3UI> }> = null

    factory = (node: FL.TabNode): React.ReactNode => {
        const component = node.getComponent() as Widget
        const extra = node.getConfig()
        return <RenderPanelUI widget={component} widgetProps={extra} />
    }

    // 🔴 todo: ensure we correctly pass ids there too
    private _persistentTab = (p: {
        //
        id: string
        name: string
        widget: Widget
        icon?: string
        width?: number
        minWidth?: number
        enableClose?: boolean
    }): FL.IJsonTabNode => {
        return {
            id: p.id,
            type: 'tab',
            name: p.name,
            component: p.widget,
            enableClose: p.enableClose ?? true,
            enableRename: false,
            enableFloat: true,
            icon: p.icon,
        }
    }
    build = (): IJsonModel => {
        const out: IJsonModel = {
            global: { tabSetEnableSingleTabStretch: true },
            borders: [
                // LEFT BORDER
                {
                    type: 'border',
                    size: 300,
                    location: 'left',
                    selected: 0,
                    show: true,
                    children: [
                        this._persistentTab({
                            name: 'Library',
                            widget: Widget.FileList,
                            enableClose: false,
                            id: '/Library',
                            width: 300,
                        }),
                    ],
                },
                // RIGHT BORDER
                {
                    type: 'border',
                    location: 'right',
                    show: true,
                    selected: 0,
                    children: [
                        this._persistentTab({
                            name: '⎏ Last step',
                            widget: Widget.LastStep,
                            id: '/LastStep',
                            enableClose: false,
                        }),
                        this._persistentTab({
                            name: 'Runs',
                            id: '/steps',
                            widget: Widget.Steps,
                            enableClose: false,
                        }),
                    ],
                },
            ],
            layout: {
                id: 'rootRow',
                type: 'row',
                children: [
                    {
                        id: 'leftPane',
                        type: 'row',
                        weight: 100,
                        children: [
                            {
                                type: 'tabset',
                                enableSingleTabStretch: true,
                                id: 'MAINTYPESET',
                                enableClose: false,
                                enableDeleteWhenEmpty: false,
                                children: [
                                    this._persistentTab({
                                        name: 'Current Draft',
                                        widget: Widget.CurrentDraft,
                                        enableClose: false,
                                        id: '/draft',
                                    }),
                                ],
                            },
                            // {
                            //     type: 'tabset',
                            //     height: 200,
                            //     minWidth: 150,
                            //     minHeight: 150,
                            //     children: [
                            //         this._persistentTab({ name: '⎏ Last step', widget: Widget.LastStep, id: '/LastStep' }),
                            //         // this._persistentTab('Hosts', Widget.Hosts),
                            //     ],
                            // },
                        ],
                    },
                    {
                        id: 'rightPane',
                        type: 'row',
                        weight: 100,
                        children: [
                            {
                                type: 'tabset',
                                minWidth: 150,
                                minHeight: 300,
                                children: [
                                    this._persistentTab({
                                        name: 'Last Image',
                                        id: '/lastImage',
                                        widget: Widget.LastImage,
                                        enableClose: false,
                                    }),
                                ],
                            },
                            {
                                type: 'tabset',
                                height: 200,
                                minWidth: 150,
                                minHeight: 150,
                                children: [
                                    this._persistentTab({ name: '🎆 Gallery', widget: Widget.Gallery, id: '/gallery' }),
                                    this._persistentTab({ name: '🎆 Latent', widget: Widget.LastLatent, id: '/LastLatent' }),
                                    // this._persistentTab('Hosts', Widget.Hosts),
                                ],
                            },
                        ],
                    },
                ],
            },
        }

        return out
    }
}

export const exhaust = (x: never) => x

const memoryRefByUniqueID = new WeakMap<object, string>()
export const uniqueIDByMemoryRef = (x: object): string => {
    let id = memoryRefByUniqueID.get(x)
    if (id == null) {
        id = nanoid()
        memoryRefByUniqueID.set(x, id)
    }
    return id
}
