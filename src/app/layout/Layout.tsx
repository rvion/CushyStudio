import type { DraftID } from 'src/models/Draft'
import type { STATE } from 'src/state/state'

import * as FL from 'flexlayout-react'
import { Actions, IJsonModel, Layout, Model } from 'flexlayout-react'

import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { FC, createRef } from 'react'
import { Message } from 'rsuite'
import { CardPath } from 'src/cards/CardPath'
import { LiteGraphJSON } from 'src/core/LiteGraph'
import { ImageID } from 'src/models/Image'
import { Panel_DeckList } from 'src/panels/Panel_DeckList'
import { Trigger } from 'src/app/shortcuts/Trigger'
import { assets } from 'src/utils/assets/assets'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'

import { Panel_Draft } from '../../panels/Panel_Draft'
import { Panel_FileTree } from '../../panels/Panel_FileTree'
// import { Panel_Card } from '../../panels/Panel_Card'
import { Panel_Civitai } from '../../panels/Panel_Civitai'
import { Panel_ComfyNodeExplorer } from '../../panels/Panel_ComfyNodeExplorer'
import { Panel_ComfyUI } from '../../panels/Panel_ComfyUI'
import { Panel_Config } from '../../panels/Panel_Config'
import { Panel_CurrentDraft } from '../../panels/Panel_CurrentDraft'
import { Panel_Gallery } from '../../panels/Panel_Gallery'
import { Panel_LastGraph } from '../../panels/Panel_LastGraph'
import { Panel_MachineManager } from '../../panels/Panel_MachineManager'
import { Panel_Marketplace } from '../../panels/Panel_Marketplace'
import { Panel_Minipaint } from '../../panels/Panel_Minipaint'
import { Panel_Squoosh } from '../../panels/Panel_Squoosh'
import { Panel_Steps } from '../../panels/Panel_Steps'
import { Panel_ViewImage } from '../../panels/Panel_ViewImage'
import { Panel_3dScene } from 'src/panels/Panel_3dScene'

// still on phone
enum Widget {
    Gallery = 'Gallery', //: { 'Gallery',}
    DisplacedImage = 'DisplacedImage', //: { 'DisplacedImage',}
    Paint = 'Paint', //: { 'Paint',}
    CurrentDraft = 'CurrentDraft', //: { 'CurrentDraft',}
    // Card = 'Card', //: { 'Card',}
    Draft = 'Draft', //: { 'Draft',}
    ComfyUI = 'ComfyUI', //: { 'ComfyUI',}
    ComfyUINodeExplorer = 'ComfyUINodeExplorer', //: { 'ComfyUINodeExplorer',}
    FileList = 'FileList', //: { 'FileList',}
    FileList2 = 'FileList2', //: { 'FileList2',}
    Steps = 'Steps', //: { 'Steps',}
    LastGraph = 'LastGraph', //: { 'LastGraph',}
    LastImage = 'LastImage', //: { 'LastIMage',}
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
    addActionPickerTree = () => this._AddWithProps(Widget.FileList2, `/filetree`, { title: 'Library Files', icon: assets.public_CushyLogo_512_png }) // prettier-ignore
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
    addLastImage = () => this._AddWithProps(Widget.LastImage, `/lastImage`, { title: '🎇 Last Image' })
    addGallery = () => this._AddWithProps(Widget.Gallery, `/gallery`, { title: 'Gallery' })
    addHosts = () => this._AddWithProps(Widget.Hosts, `/hosts`, { title: 'Hosts' })
    addComfy = (litegraphJson?: LiteGraphJSON) => {
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

    addCurrentDraft = () => {
        this._AddWithProps(Widget.CurrentDraft, `/draft`, { title: 'Current Draft' })
    }

    addDraft = (p: PropsOf<typeof Panel_Draft>) => {
        const draftID = p.draftID
        const draft = this.st.db.drafts.get(p.draftID)
        const card = draft?.card
        const icon = card?.illustrationPathWithFileProtocol
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

    factory = (node: FL.TabNode): React.ReactNode => {
        const component = node.getComponent() as Widget
        const extra = node.getConfig()

        // prettier-ignore
        try {
            if (component === Widget.Gallery)             return <Panel_Gallery />
            if (component === Widget.Paint)               return <Panel_Minipaint {...extra} /> // You can now use imgID to instantiate your paint component properly
            if (component === Widget.Image)               return <Panel_ViewImage imageID={extra.imgID}></Panel_ViewImage> // You can now use imgID to instantiate your paint component properly
            // if (component === Widget.Card)                return <Panel_Card      actionPath={extra.actionPath} />
            if (component === Widget.ComfyUI)             return <Panel_ComfyUI   litegraphJson={extra.litegraphJson} />
            if (component === Widget.FileList)            return <Panel_DeckList />
            if (component === Widget.FileList2)           return <Panel_FileTree />
            if (component === Widget.Steps)               return <Panel_Steps />
            if (component === Widget.LastGraph)           return <Panel_LastGraph />
            if (component === Widget.LastImage)           return <Panel_ViewImage />
            if (component === Widget.Civitai)             return <Panel_Civitai />
            if (component === Widget.Squoosh)             return <Panel_Squoosh />
            if (component === Widget.Hosts)               return <Panel_MachineManager />
            if (component === Widget.Marketplace)         return <Panel_Marketplace />
            if (component === Widget.Config)              return <Panel_Config />
            if (component === Widget.Draft)               return <Panel_Draft     {...extra} />
            if (component === Widget.CurrentDraft)        return <Panel_CurrentDraft />
            if (component === Widget.ComfyUINodeExplorer) return <Panel_ComfyNodeExplorer />
            if (component === Widget.Deck)                return <div>🔴 todo: action pack page: show readme</div>
            if (component === Widget.DisplacedImage)      return <Panel_3dScene {...extra} />
        } catch (e) {
            return (
                <pre tw='text-red-500'>
                    <div>component "{component}" failed to render:</div>
                    error: {stringifyUnknown(e)}
                </pre>
            )
        }

        exhaust(component)
        return (
            <Message type='error' showIcon>
                unknown component
            </Message>
        )
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
                {
                    //
                    type: 'border',
                    location: 'left',
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
                                    // this._persistentTab('Hosts', Widget.Hosts),
                                ],
                            },
                        ],
                    },
                    {
                        id: 'middlePane',
                        type: 'row',
                        children: [
                            {
                                type: 'tabset',
                                width: 250,
                                children: [this._persistentTab({ name: 'Runs', id: '/steps', widget: Widget.Steps })],
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
