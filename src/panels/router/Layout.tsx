import type { STATE } from 'src/state/state'

import * as FL from 'flexlayout-react'
import { Actions, IJsonModel, Layout, Model } from 'flexlayout-react'
import { action, makeAutoObservable, runInAction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { createElement, createRef, FC } from 'react'

import { hashJSONObject } from './hash'
import { PanelNames, panels, Panels } from './PANELS'
import { RenderPanelUI } from './RenderPanelUI'
import { Trigger } from 'src/app/shortcuts/Trigger'
import { Panel_FullScreenLibrary } from 'src/panels/Panel_FullScreenLibrary'
import { Message } from 'src/rsuite/shims'

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
            t.layouts_v12 ??= {}
            t.layouts_v12[perspectiveName] = curr
        })
    }

    resetCurrent = (): void => this.reset(this.currentPerspectiveName)
    resetDefault = (): void => this.reset('default')
    reset = (perspectiveName: string): void => {
        this.st.configFile.update((t) => {
            t.layouts_v12 ??= {}
            delete t.layouts_v12[perspectiveName]
        })
        if (perspectiveName === this.currentPerspectiveName) {
            this.setModel(Model.fromJson(this.build()))
        }
    }

    constructor(public st: STATE) {
        const prevLayout = st.configFile.value.layouts_v12?.default
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
        makeAutoObservable(this, { layoutRef: false, FOCUS_OR_CREATE: action })
    }

    layoutRef = createRef<Layout>()
    updateCurrentTab = (p: Partial<FL.TabNode>) => {
        const tab = this.currentTab
        if (tab == null) return
        this.model.doAction(Actions.updateNodeAttributes(tab.getId(), p))
    }

    isVisible = (component: PanelNames): boolean => {
        const node = this.findTabsFor(component)
        const tab = node[0]
        if (tab == null) return false
        return tab.tabNode.isVisible()
    }

    currentTabSet: Maybe<FL.TabSetNode> = null
    currentTab: Maybe<FL.Node> = null
    currentTabID: Maybe<string> = null
    UI = observer(() => {
        console.log('[💠] Rendering Layout')
        return (
            <Layout //
                onAuxMouseClick={(node, event) => {
                    // Middle Mouse to close tab
                    if (event.button == 1 && node instanceof FL.TabNode) {
                        if (node.isEnableClose()) {
                            this.closeTab(node.getId())
                        }
                    }
                }}
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

    TOGGLE_FULL = <const K extends PanelNames>(component: K, props: PropsOf<Panels[K]['widget']>) => {
        if (
            this.fullPageComp == null || //
            this.fullPageComp.panel !== component
        ) {
            this.fullPageComp = { props: props, panel: component }
        } else {
            this.fullPageComp = null
        }
    }

    currentTabIs = <K extends PanelNames>(component: K): Maybe<PropsOf<Panels[K]['widget']>> => {
        const tabPrefix = `/${component}/`
        const current = this.currentTab
        if (current == null) {
            console.log(`❌ currentTabIs(...): current is null`)
            return null
        }
        const type = current.getType()
        const id = current.getId()
        if (type !== 'tab') {
            console.log(`❌ currentTabIs(...): current is not a tab`)
            return null
        }
        if (!id.startsWith(tabPrefix)) {
            console.log(`❌ currentTabIs(...): "${id}" does not start with ${tabPrefix}`)
            return null
        }
        return (current as FL.TabNode).getConfig() as Maybe<PropsOf<Panels[K]['widget']>>
    }

    findTabsFor = <K extends PanelNames>(
        component: K,
    ): {
        //
        tabNode: FL.TabNode
        config: PropsOf<Panels[K]['widget']>
    }[] => {
        const tabPrefix = `/${component}/`
        const tabs: FL.TabNode[] = []
        this.model.visitNodes((node) => {
            const id = node.getId()
            const type = node.getType()
            if (type === 'tab' && id.startsWith(tabPrefix)) tabs.push(node as FL.TabNode)
        })
        const out = tabs
            .filter((tab) => tab.getId().startsWith(tabPrefix))
            .map((tab) => ({
                config: toJS(tab.getConfig()) as PropsOf<Panels[K]['widget']>,
                tabNode: tab,
            }))
        return out
    }

    /** practical way to keep a tab properly named (synced with it's content) */
    syncTabTitle = <const K extends PanelNames>(
        //
        component: K,
        props: PropsOf<Panels[K]['widget']>,
        title: string,
    ) => {
        const tabID = `/${component}/${hashJSONObject(props ?? {})}`
        const tab = this.model.getNodeById(tabID)
        if (tab == null) return
        runInAction(() => {
            this.model.doAction(Actions.renameTab(tabID, title || component))
        })
    }

    FOCUS_OR_CREATE = <const PanelName extends PanelNames>(
        panelName: PanelName,
        panelProps: PropsOf<Panels[PanelName]['widget']>,
        where: 'full' | 'current' | LEFT_PANE_TABSET_T | RIGHT_PANE_TABSET_T = RIGHT_PANE_TABSET_ID,
    ): Maybe<FL.Node> => {
        if (where === 'full') {
            this.TOGGLE_FULL(panelName, panelProps)
            return null
        }

        // 1. ensure layout is present
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) return void console.log('❌ no currentLayout')

        // 2. get previous tab
        const tabID = `/${panelName}/${hashJSONObject(panelProps ?? {})}`
        let prevTab: FL.TabNode | undefined
        prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
        console.log(`🦊 prevTab for ${tabID}:`, prevTab)

        // 3. create tab if not prev type
        const { icon, title } = panels[panelName].header(panelProps as any)
        if (prevTab == null) {
            const tabsetIDToAddThePanelTo =
                where === 'current' //
                    ? this.currentTabSet?.getId() ?? LEFT_PANE_TABSET_ID
                    : where
            const addition = currentLayout.addTabToTabSet(tabsetIDToAddThePanelTo, {
                component: panelName,
                id: tabID,
                icon: icon,
                name: title,
                config: panelProps,
            })
            prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
            if (prevTab == null) {
                console.log(`[👙] addition:`, addition, { component: panelName, tabID, icon, title, props: panelProps })
                return void console.log('❌ no new tab')
            }
        } else {
            this.model.doAction(Actions.updateNodeAttributes(tabID, { config: panelProps }))
            this.model.doAction(Actions.selectTab(tabID))
        }

        // 4. merge props
        this.model.doAction(Actions.updateNodeAttributes(tabID, panelProps))
        return prevTab
    }

    // 🔴 todo: ensure we correctly pass ids there too
    private _add = <const K extends PanelNames>(p: {
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
            enableFloat: false,
            icon: icon,
        }
    }

    build = (): IJsonModel => {
        const out: IJsonModel = {
            global: {
                tabEnableFloat: false,
                splitterSize: 6,
                tabEnableRename: false,
                borderEnableAutoHide: true,
                borderAutoSelectTabWhenClosed: true,
                //
                // tabSetEnableSingleTabStretch: true,
            },
            borders: [
                // LEFT BORDER
                // {
                //     type: 'border',
                //     // size: 350,
                //     location: 'left',
                //     // selected: 0,
                //     show: true,
                //     children: [this._add({ panel: 'TreeExplorer', props: {}, canClose: false, width: 300 })],
                //     size: 300,
                // },
                // RIGHT BORDER
                {
                    type: 'border',
                    location: 'right',
                    show: true,
                    selected: 0,
                    size: 150,
                    children: [
                        //
                        this._add({ panel: 'Gallery', props: {} }),
                        this._add({ panel: 'Steps', props: {}, canClose: false }),
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
                        width: 512,
                        children: [
                            {
                                type: 'tabset',
                                id: LEFT_PANE_TABSET_ID,
                                minWidth: 150,
                                minHeight: 150,
                                width: 512,
                                enableClose: false,
                                enableDeleteWhenEmpty: false,
                                children: [this._add({ panel: 'Welcome', props: {}, width: 512 })],
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
                                selected: 1,
                                children: [
                                    this._add({ panel: 'Output', props: {}, canClose: false }),
                                    // this._add({ panel: 'Hosts', props: {}, canClose: false }),
                                ],
                            },
                        ],
                    },
                ],
            },
        }

        return out
    }

    fullPageComp: Maybe<{ panel: PanelNames; props: PropsOf<typeof Panel_FullScreenLibrary> }> = null

    factory = (node: FL.TabNode): React.ReactNode => {
        // 1. get panel name
        const panel = node.getComponent() as Maybe<PanelNames>
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

        return createElement(RenderPanelUI, {
            node,
            panel,
            panelProps,
        })
    }
}
