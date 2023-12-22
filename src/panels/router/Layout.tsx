import type { STATE } from 'src/state/state'

import * as FL from 'flexlayout-react'
import { Actions, IJsonModel, Layout, Model } from 'flexlayout-react'

import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { FC, createElement, createRef } from 'react'
import { Trigger } from 'src/app/shortcuts/Trigger'

import { Panel_CardPicker3UI } from 'src/panels/Panel_FullScreenLibrary'
import { Message } from 'src/rsuite/shims'
import { Panel, Panels, panels } from './PANELS'
import { RenderPanelUI } from './RenderPanelUI'
import { hashJSONObject } from './hash'

export type PropsOf<T> = T extends FC<infer Props> ? Props : '❌'

type PerspectiveDataForSelect = {
    label: string
    value: string
}

type MENU_PANE_TABSET_T = 'MENU_PANE_TABSET'
const MENU_PANE_TABSET_ID: MENU_PANE_TABSET_T = 'MENU_PANE_TABSET'

type LEFT_PANE_TABSET_T = 'LEFT_PANE_TABSET'
const LEFT_PANE_TABSET_ID: LEFT_PANE_TABSET_T = 'LEFT_PANE_TABSET'

type RIGHT_PANE_TABSET_T = 'RIGHT_PANE_TABSET'
const RIGHT_PANE_TABSET_ID: RIGHT_PANE_TABSET_T = 'RIGHT_PANE_TABSET'

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
            t.layouts_v8 ??= {}
            t.layouts_v8[perspectiveName] = curr
        })
    }

    resetCurrent = (): void => this.reset(this.currentPerspectiveName)
    resetDefault = (): void => this.reset('default')
    reset = (perspectiveName: string): void => {
        this.st.configFile.update((t) => {
            t.layouts_v8 ??= {}
            delete t.layouts_v8[perspectiveName]
        })
        if (perspectiveName === this.currentPerspectiveName) {
            this.setModel(Model.fromJson(this.build()))
        }
    }

    constructor(public st: STATE) {
        const prevLayout = st.configFile.value.layouts_v8?.default
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
        makeAutoObservable(this, { layoutRef: false })
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
                    this.saveCurrentAsDefault()
                }}
                ref={this.layoutRef}
                model={this.model}
                factory={this.factory}
            />
        )
    })

    nextPaintIDx = 0
    openAppInMainPanel = (actionPath: RelativePath) => {
        throw new Error('not implemented')
        // const card = this.st.library.getFile(actionPath)
        // if (card == null) return null /* 🔴 add popup somewhere */
        // const draft = card.getLastDraft()
        // this.st.currentDraft = draft
        // // this.FOCUS_OR_CREATE('Draft', { draftID: draft?.id ?? '❌' }, 'LEFT_PANE_TABSET')
    }

    openAppInNewPanel = (actionPath: RelativePath) => {
        throw new Error('not implemented')
        // const card = this.st.library.getFile(actionPath)
        // if (card == null) return null /* 🔴 add popup somewhere */
        // const draft = card.getLastDraft()
        // this.FOCUS_OR_CREATE('Draft', { draftID: draft?.id ?? '❌' }, 'LEFT_PANE_TABSET')
    }
    // addDraft = (p: PropsOf<typeof Panel_Draft>) => {
    //     const draftID = p.draftID
    //     const draft = this.st.db.drafts.get(p.draftID)
    //     const card = draft?.app
    //     const _img = card?.illustrationPathWithFileProtocol
    //     const icon = _img?.startsWith('<svg') ? undefined : _img
    //     const title = card?.displayName ?? 'Draft'
    //     this.GO_TO(PANELS.Draft, `/draft/${draftID}`, { title, draftID, icon }, 'current')
    // }

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
        if (this.fullPageComp != null) {
            this.fullPageComp = null
            return Trigger.Success
        }
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

    // add = <K extends Panel>(component: K, props: PropsOf<Panels[K]['widget']>) => {
    //     const { icon, title } = panels[component].header(props as any)
    //     this._AddWithProps(
    //         //
    //         component,
    //         `/${component}/${JSON.stringify(props)}`,
    //         { title: 'CardPicker3UI', ...props },
    //     )
    // }

    TOGGLE_FULL = <const K extends Panel>(component: K, props: PropsOf<Panels[K]['widget']>) => {
        if (
            this.fullPageComp == null || //
            this.fullPageComp.panel !== component
        ) {
            this.fullPageComp = { props: props, panel: component }
        } else {
            this.fullPageComp = null
        }
    }

    FOCUS_OR_CREATE = <const K extends Panel>(
        component: K,
        props: PropsOf<Panels[K]['widget']>,
        where: 'full' | 'current' | LEFT_PANE_TABSET_T | RIGHT_PANE_TABSET_T = RIGHT_PANE_TABSET_ID,
    ): Maybe<FL.Node> => {
        if (where === 'full') {
            this.TOGGLE_FULL(component, props)
            return null
        }

        // 1. ensure layout is present
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) return void console.log('❌ no currentLayout')

        // 2. get previous tab
        const tabID = `/${component}/${hashJSONObject(props ?? {})}`
        let prevTab: FL.TabNode | undefined
        prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
        console.log(`🦊 prevTab for ${tabID}:`, prevTab)

        // 3. create tab if not prev type
        const { icon, title } = panels[component].header(props as any)
        if (prevTab == null) {
            const tabsetIDToAddThePanelTo =
                where === 'current' //
                    ? this.currentTabSet?.getId() ?? LEFT_PANE_TABSET_ID
                    : where
            currentLayout.addTabToTabSet(tabsetIDToAddThePanelTo, {
                component: component,
                id: tabID,
                icon: icon,
                name: title,
                config: props,
            })
            prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
            if (prevTab == null) return void console.log('❌ no tabAdded')
        } else {
            this.model.doAction(Actions.updateNodeAttributes(tabID, { config: props }))
            this.model.doAction(Actions.selectTab(tabID))
        }

        // 4. merge props
        this.model.doAction(Actions.updateNodeAttributes(tabID, props))
        return prevTab
    }

    // 🔴 todo: ensure we correctly pass ids there too
    private _add = <const K extends Panel>(p: {
        //
        panel: K
        props: PropsOf<Panels[K]['widget']>
        width?: number
        minWidth?: number
        canClose?: boolean
    }): FL.IJsonTabNode => {
        const { panel, props } = p
        const id = `/${panel}/${hashJSONObject(props ?? {})}`
        const { icon, title } = panels[panel].header(props as any)
        return {
            id: id,
            type: 'tab',
            name: title,
            config: props,
            component: p.panel,
            enableClose: p.canClose ?? true,
            enableRename: false,
            enableFloat: true,
            icon: icon,
        }
    }

    build = (): IJsonModel => {
        const out: IJsonModel = {
            global: {
                splitterSize: 6,
                borderEnableAutoHide: true,
                borderAutoSelectTabWhenClosed: true,
                //
                // tabSetEnableSingleTabStretch: true,
            },
            borders: [
                // LEFT BORDER
                {
                    type: 'border',
                    // size: 250,
                    location: 'left',
                    selected: 0,
                    show: true,
                    children: [this._add({ panel: 'FileList', props: {}, canClose: false, width: 250 })],
                },
                // RIGHT BORDER
                {
                    type: 'border',
                    location: 'right',
                    show: true,
                    selected: 0,
                    children: [
                        this._add({ panel: 'Steps', props: {}, canClose: false }),
                        // this._add({ panel: 'LastStep', props: {}, canClose: false }),
                        // this._add({ panel: 'Steps', props: {}, canClose: false }),
                        // this._add({ panel: 'Steps', props: {}, canClose: false }),
                        // this._add({ panel: 'Gallery', props: {} }),
                        // this._add({ panel: 'LastImage', props: {} }),
                        // this._add({ panel: 'Gallery', props: {} }),
                        // this._add({ panel: 'LastStep', props: {}, canClose: false }),
                    ],
                },
            ],
            layout: {
                id: 'rootRow',
                type: 'row',
                children: [
                    // {
                    //     id: 'menuPane',
                    //     type: 'row',
                    //     width: 100,
                    //     children: [
                    //         {
                    //             type: 'tabset',
                    //             id: MENU_PANE_TABSET_ID,
                    //             minWidth: 64,
                    //             minHeight: 150,
                    //             width: 200,
                    //             enableClose: false,
                    //             enableDeleteWhenEmpty: false,
                    //             children: [
                    //                 this._add({ panel: 'FileList', props: {}, canClose: false, width: 200 }),
                    //                 // this._add({ panel: 'CurrentDraft', canClose: false, props: {}, width: 600 })
                    //             ],
                    //             enableSingleTabStretch: true,
                    //         },
                    //     ],
                    // },
                    {
                        id: 'leftPane',
                        type: 'row',
                        width: 100,
                        children: [
                            {
                                type: 'tabset',
                                id: LEFT_PANE_TABSET_ID,
                                minWidth: 150,
                                minHeight: 150,
                                width: 512,
                                enableClose: false,
                                enableDeleteWhenEmpty: false,
                                children: [this._add({ panel: 'CurrentDraft', canClose: false, props: {}, width: 512 })],
                                // enableSingleTabStretch: true,
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
                                id: RIGHT_PANE_TABSET_ID,
                                enableClose: false,
                                enableDeleteWhenEmpty: false,
                                minWidth: 100,
                                minHeight: 100,
                                children: [
                                    this._add({ panel: 'Output', props: {}, canClose: false }),
                                    // this._add({ panel: 'Outputs', props: {} }),
                                    // this._add({ panel: 'Gallery', props: {} }),
                                ],
                            },
                            // {
                            //     type: 'row',
                            //     height: 300,
                            //     children: [
                            //         {
                            //             type: 'tabset',
                            //             height: 100,
                            //             minWidth: 100,
                            //             minHeight: 100,
                            //             children: [this._add({ panel: 'Steps', props: {}, canClose: false })],
                            //         },
                            {
                                type: 'tabset',
                                height: 256,
                                minWidth: 100,
                                minHeight: 100,
                                children: [
                                    this._add({ panel: 'Gallery', props: {} }),
                                    this._add({ panel: 'LastImage', props: {} }),
                                    // // this._add({ panel: 'Steps', props: {}, canClose: false }),
                                    // this._add({ panel: 'Outputs', props: {} }),
                                    // // this._add({ panel: 'Gallery', props: {} }),
                                    // this._add({ panel: 'LastStep', props: {}, canClose: false }),
                                    // this._add({ panel: 'Steps', props: {}, canClose: false }),
                                    // this._add({ panel: 'LastImage', props: {} }),
                                    // // this._add({ panel: 'LastLatent', props: {} }),
                                    // // this._persistentTab('Hosts', Widget.Hosts),
                                ],
                            },
                            // ],
                            // },
                        ],
                    },
                ],
            },
        }

        return out
    }

    fullPageComp: Maybe<{ panel: Panel; props: PropsOf<typeof Panel_CardPicker3UI> }> = null

    factory = (node: FL.TabNode): React.ReactNode => {
        // 1. get panel name
        const panel = node.getComponent() as Maybe<Panel>
        if (panel == null)
            return (
                <Message type='error' showIcon>
                    no panel (TabNode.getComponent())
                </Message>
            )

        // 2. get panel props
        const panelProps = node.getConfig()
        if (panelProps == null)
            return (
                <Message type='error' showIcon>
                    no panel props (TabNode.getConfig())
                </Message>
            )

        return createElement(RenderPanelUI, { panel, panelProps })
    }
}
