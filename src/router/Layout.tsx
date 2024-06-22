import type { STATE } from '../state/state'

import * as FL from 'flexlayout-react'
import { Actions, IJsonModel, Layout, Model } from 'flexlayout-react'
import { action, makeAutoObservable, runInAction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { createElement, createRef, FC } from 'react'

import { hashJSONObjectToNumber } from '../csuite/hashUtils/hash'
import { getIconAsDataSVG } from '../csuite/icons/iconStr'
import { Message } from '../csuite/inputs/shims'
import { regionMonitor } from '../csuite/regions/RegionMonitor'
import { Trigger } from '../csuite/trigger/Trigger'
import { toastError } from '../csuite/utils/toasts'
import { type CustomPanelRef, registerCustomPanel } from '../panels/Panel_Temporary'
import { PanelNames, panels, Panels } from './PANELS'
import { RenderPanelUI } from './RenderPanelUI'

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

    constructor(public st: STATE) {
        const prevLayout = st.configFile.value.layouts_v12?.default
        const json = prevLayout ?? this.makeDefaultLayout()
        try {
            this.setModel(Model.fromJson(json))
        } catch (e) {
            console.log('[💠] Layout: ❌ error loading layout', e)
            this.setModel(Model.fromJson(this.makeDefaultLayout()))
        }
        makeAutoObservable(this, {
            layoutRef: false,
            FOCUS_OR_CREATE: action,
        })
    }

    /** pretty print model layout as json  */
    prettyPrintLayoutModel() {
        console.log(`[💠] model:`, JSON.stringify(this.model.toJson(), null, 4))
    }

    /** quick method to maximize a tabset */
    _maximizeToggle = (tabsetNodeID: string): Trigger => {
        return this._doAction(Actions.maximizeToggle(tabsetNodeID))
    }

    /** wrap model.doAction, and return Trigger.Success */
    _doAction = (action: FL.Action) => {
        this.model.doAction(action)
        return Trigger.Success
    }

    /** utility to apply a function on the active tabset */
    _withActiveTabset = <Ret extends any>(fn: (tabset: FL.TabSetNode) => Ret): Ret | Trigger => {
        const tabset: FL.TabSetNode | undefined = this.getActiveOrFirstTabset_orThrow()
        return fn(tabset)
    }

    /** utility to apply a function on the hovered tabset */
    _withHoveredTabset = <Ret extends any>(fn: (tabset: FL.TabSetNode) => Ret): Ret | Trigger => {
        const tabset: Maybe<FL.TabSetNode> = this.hoveredTabset
        if (tabset == null) {
            console.log(`[❌] maximizHoveredTabset: tabset is null`)
            return Trigger.UNMATCHED
        }
        return fn(tabset)
    }

    /** utility to apply a function on the whole layout */
    _withLayout = <Ret extends any>(fn: (layout: Layout) => Ret): Ret | Trigger => {
        const layout: FL.Layout | null = this.layoutRef.current
        if (layout == null) {
            console.log(`[❌] _withLayout: layout is null`)
            return Trigger.UNMATCHED
        }
        return fn(layout)
    }

    closeAllTabs = (): Trigger => {
        let tabset = this.getActiveOrFirstTabset_orNull()
        if (tabset == null) return Trigger.UNMATCHED
        while (tabset != null) {
            this._doAction(Actions.deleteTabset(tabset.getId()))
            tabset = this.getActiveOrFirstTabset_orNull()
        }
        return Trigger.Success
    }

    closeCurrentTabset = (): Trigger => {
        let tabset = this.getActiveOrFirstTabset_orNull()
        if (tabset == null) return Trigger.UNMATCHED
        this._doAction(Actions.deleteTabset(tabset.getId()))
        return Trigger.Success
    }

    /** maximize the active(=selected; with focus) tabset */
    maximizeActiveTabset = (): Trigger => {
        return this._withActiveTabset((tabset) => this._maximizeToggle(tabset.getId()))
    }

    /** maximize the tabset under the mouse */
    maximizHoveredTabset = (): Trigger => {
        return this._withHoveredTabset((tabset) => this._maximizeToggle(tabset.getId()))
    }

    /** access hovered tabset */
    get hoveredTabset(): Maybe<FL.TabSetNode> {
        // get hovered tab
        const hoveredTab = this.hoveredTab
        if (hoveredTab == null) return null

        // get it's parent tabset
        const tabSet = hoveredTab.getParent()
        if (tabSet == null) {
            console.log(`[🔴] INVARIANT VIOLATION; tab parent is null (expected: tabset)`)
            return null
        }
        if (tabSet.getType() !== 'tabset')
            console.log(`[🔴] INVARIANT VIOLATION; panelID correspond to a '${tabSet.getType()}', not a 'tabset'`)
        return tabSet as FL.TabSetNode
    }

    /** access hovered tab */
    get hoveredTab(): Maybe<FL.TabNode> {
        const tabNodeID = cushy.region.hoveredPanel
        if (tabNodeID == null) return null
        const tabNode = this.model.getNodeById(tabNodeID)
        if (tabNode == null) return null
        if (tabNode.getType() !== 'tab') console.log(`[🔴] INVARIANT VIOLATION; panelID correspond to a ${tabNode.getType()}`)
        return tabNode as FL.TabNode
    }

    // PERSPECTIVE SYSTEM --------------------------------------------------------------
    currentPerspectiveName = 'default'
    allPerspectives: PerspectiveDataForSelect[] = [
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
            this.setModel(Model.fromJson(this.makeDefaultLayout()))
        }
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

    private _isTabset = (node: FL.Node): node is FL.TabSetNode => node.getType() === 'tabset'
    moveActiveTabToRight = (): Trigger => {
        // 1. get tabset
        const surroundings = this.getTabsetSurroundings()
        if (surroundings == null) return Trigger.UNMATCHED
        const tabset = surroundings.curr

        // 2. get tab
        const tabIx = tabset.getSelected()
        if (tabIx == null) return toastError('No active tab')
        const tab = tabset.getChildren()[tabIx]
        if (tab == null) return toastError('No active tab')
        const tabID = tab.getId()

        if (surroundings.next == null) {
            // 3. move tab into split
            this.model.doAction(Actions.moveNode(tabID, tabset.getId(), FL.DockLocation.RIGHT, -1))
            this.prettyPrintLayoutModel()
            return Trigger.Success
        } else {
            // 3. move tab to right tabset
            this.model.doAction(Actions.moveNode(tabID, surroundings.next.getId(), FL.DockLocation.CENTER, -1))
            this.prettyPrintLayoutModel()
            return Trigger.Success
        }
    }

    moveActiveTabToLeft = (): Trigger => {
        // 1. get tabset
        const surroundings = this.getTabsetSurroundings()
        if (surroundings == null) return Trigger.UNMATCHED
        const tabset = surroundings.curr

        // 2. get tab
        const tabIx = tabset.getSelected()
        if (tabIx == null) return toastError('No active tab')
        const tab = tabset.getChildren()[tabIx]
        if (tab == null) return toastError('No active tab')
        const tabID = tab.getId()

        if (surroundings.prev == null) {
            // 3. move tab into split
            this.model.doAction(Actions.moveNode(tabID, tabset.getId(), FL.DockLocation.LEFT, -1))
            this.prettyPrintLayoutModel()
            return Trigger.Success
        } else {
            // 3. move tab to left split
            this.model.doAction(Actions.moveNode(tabID, surroundings.prev.getId(), FL.DockLocation.CENTER, -1))
            this.prettyPrintLayoutModel()
            return Trigger.Success
        }
    }

    getTabsetSurroundings = (): Maybe<{
        row: FL.RowNode
        curr: FL.TabSetNode
        prev: Maybe<FL.TabSetNode>
        next: Maybe<FL.TabSetNode>
    }> => {
        const tabset = this.getActiveOrFirstTabset_orThrow()

        const parent = tabset.getParent()
        if (parent == null) return void toastError('tabset has no parent')
        if (parent.getType() !== 'row') return void toastError(`parent is a '${parent.getType()}', not a tabset`)

        const children = parent.getChildren()
        const selfX = children.indexOf(tabset)
        console.log(`[🤠] children`, `${selfX + 1} / ${children.length}`)

        return {
            row: parent as FL.RowNode,
            curr: tabset,
            prev: children[selfX - 1] as Maybe<FL.TabSetNode>,
            next: children[selfX + 1] as Maybe<FL.TabSetNode>,
        }
        // let next = children[selfX + 1]
        // if (next == null) {
        //     console.log(`[🤠] last tabset`)
        //     this.model.doAction(Actions.moveNode(tabID, tabset.getId(), FL.DockLocation.LEFT, -1))
        // } else {
        //     this.model.doAction(Actions.selectTab(next.getId()))
        // }

        // return parent as FL.TabSetNode
    }

    UI = observer(() => {
        console.log('[💠] Rendering Layout')
        return (
            <Layout //
                ref={this.layoutRef}
                model={this.model}
                factory={this.factory}
                /* This is more responsive and better for stuff like the gallery, where you may want to match the size of the panel to the size of the images.
                 * Click => Dragging => Unclick is very annoying when you want something a specific way and need to see the changes quickly. */
                realtimeResize
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
                        const tabset = this.getActiveOrFirstTabset_orThrow()
                        this.currentTabSet = tabset
                        this.currentTab = tabset?.getSelectedNode()
                        this.currentTabID = this.currentTab?.getId()
                    })
                    this.saveCurrentAsDefault()
                }}
            />
        )
    })

    /** rename tab by ID */
    renameTab = (tabID: string, newName: string) => {
        const tab = this.model.getNodeById(tabID)
        if (tab == null) return
        this.model.doAction(Actions.renameTab(tabID, newName))
    }

    private _assertTabsetNode_orThrow = (node: FL.Node): FL.TabSetNode => {
        if (node.getType() !== 'tabset') throw new Error(`[❌] node is not a tabset`)
        return node as FL.TabSetNode
    }

    private _assertTabsetNode_orNull = (node: FL.Node): Maybe<FL.TabSetNode> => {
        if (node.getType() !== 'tabset') return null
        return node as FL.TabSetNode
    }

    getActiveOrFirstTabset_orThrow = (): FL.TabSetNode => {
        return (
            this.model.getActiveTabset() ?? //
            this._assertTabsetNode_orThrow(this.model.getFirstTabSet())
        )
    }

    getActiveOrFirstTabset_orNull = (): Maybe<FL.TabSetNode> => {
        return (
            this.model.getActiveTabset() ?? //
            this._assertTabsetNode_orNull(this.model.getFirstTabSet())
        )
    }
    /** quickly rename the current tab */
    renameCurrentTab = (newName: string) => {
        const tabset = this.getActiveOrFirstTabset_orThrow()
        if (tabset == null) return
        const tab = tabset.getSelectedNode()
        if (tab == null) return
        const tabID = tab.getId()
        this.model.doAction(Actions.renameTab(tabID, newName))
    }

    closeCurrentTab = (): Trigger => {
        // 1. find tabset
        const tabset = this.getActiveOrFirstTabset_orThrow()
        if (tabset == null) return Trigger.UNMATCHED

        // 2. find active tab
        const tab = tabset.getSelectedNode()
        if (tab == null) return Trigger.UNMATCHED

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

    currentHoveredTabIs = <K extends PanelNames>(component: K) => {
        return regionMonitor.hoveredRegion?.type === component
    }

    currentTabIs = <K extends PanelNames>(component: K): Maybe<Panels[K]['$Props']> => {
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
        config: Panels[K]['$Props']
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
        const tabID = `/${component}/${hashJSONObjectToNumber(props ?? {})}`
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
        this.prettyPrintLayoutModel()
        // if (where === 'full') {
        //     this.TOGGLE_FULL(panelName, panelProps)
        //     return null
        // }

        // 1. ensure layout is present
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) return void console.log('❌ no currentLayout')

        // 2. get previous tab
        const tabID = `/${panelName}/${hashJSONObjectToNumber(panelProps ?? {})}`
        let prevTab: FL.TabNode | undefined
        prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
        // console.log(`🦊 prevTab for ${tabID}:`, prevTab)

        // 3. create tab if not prev type
        const panel = panels[panelName]
        const { title } = panel.header(panelProps as any)
        const icon = panel.icon
        if (prevTab == null) {
            const tabsetIDToAddThePanelTo = this.getActiveOrFirstTabset_orThrow().getId()
            // const tabsetIDToAddThePanelTo =
            //     where === 'current' //
            //         ? this.currentTabSet?.getId() ?? LEFT_PANE_TABSET_ID
            //         : where

            // const prevTabset = this.model.getNodeById(tabsetIDToAddThePanelTo)
            // if (prevTabset == null) {
            //     // add new tabset
            //     const rootRow = this.model.getRoot() as FL.RowNode
            //     const tabsetJSON: FL.IJsonTabSetNode = {
            //         type: 'tabset',
            //         id: tabsetIDToAddThePanelTo,
            //         children: [],
            //         active: true,
            //     }
            //     this._doAction(FL.Actions.addNode(tabsetJSON, rootRow.getId(), FL.DockLocation.TOP, 0, true))
            //     console.log(`[🤠] rootRow`, JSON.stringify(rootRow.toJson(), null, 3))
            //     console.log(`[❌] prevTabset is null`)
            //     return
            // }

            const addition = currentLayout.addTabToTabSet(tabsetIDToAddThePanelTo, {
                component: panelName,
                id: tabID,
                icon: getIconAsDataSVG(icon),
                name: title,
                config: panelProps,
            })
            prevTab = this.model.getNodeById(tabID) as FL.TabNode // 🔴 UNSAFE ?
            if (prevTab == null) {
                console.log(`[👙] addition:`, addition, { component: panelName, tabID, icon, title, props: panelProps })
                this.prettyPrintLayoutModel()
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
        panelName: K
        props: PropsOf<Panels[K]['widget']>
        width?: number
        minWidth?: number
        canClose?: boolean
    }): FL.IJsonTabNode => {
        const { panelName, props } = p
        const id = `/${panelName}/${hashJSONObjectToNumber(props ?? {})}`
        const panel = panels[panelName]
        const { title } = panel.header(props as any)
        const icon = panel.icon
        return {
            id: id,
            type: 'tab',
            name: title,
            config: props,
            component: p.panelName,
            enableClose: p.canClose ?? true,
            enableRename: false,
            enableFloat: false,
            icon: getIconAsDataSVG(icon),
        }
    }

    makeDefaultLayout = (): IJsonModel => {
        const out: IJsonModel = {
            global: {
                tabEnableFloat: false,
                splitterSize: 6,
                tabEnableRename: false,
                borderEnableAutoHide: true,
                borderAutoSelectTabWhenClosed: true,
                tabSetHeaderHeight: 24,
                tabSetTabStripHeight: 24,
                tabSetEnableSingleTabStretch: false /* 🔴 */,
                //
                // tabSetEnableSingleTabStretch: true,
            },
            // borders: [
            //     // LEFT BORDER
            //     // {
            //     //     type: 'border',
            //     //     // size: 350,
            //     //     location: 'left',
            //     //     // selected: 0,
            //     //     show: true,
            //     //     children: [this._add({ panel: 'TreeExplorer', props: {}, canClose: false, width: 300 })],
            //     //     size: 300,
            //     // },
            //     // RIGHT BORDER
            //     {
            //         type: 'border',
            //         location: 'right',
            //         show: true,
            //         selected: 0,
            //         size: 150,
            //         children: [
            //             //
            //             this._add({ panel: 'Gallery', props: {} }),
            //             this._add({ panel: 'Steps', props: {}, canClose: false }),
            //         ],
            //     },
            // ],
            layout: {
                id: 'rootRow',
                type: 'row',
                children: [
                    // {
                    //     id: 'leftPane',
                    //     type: 'row',
                    //     width: 512,
                    //     children: [
                    {
                        type: 'tabset',
                        id: LEFT_PANE_TABSET_ID,
                        minWidth: 150,
                        minHeight: 150,
                        // width: 512,
                        // enableClose: false,
                        // enableDeleteWhenEmpty: false,
                        children: [
                            //
                            this._add({ panelName: 'Welcome', props: {}, width: 512 }),
                            this._add({ panelName: 'FullScreenLibrary', props: {}, width: 512 }),
                            this._add({ panelName: 'TreeExplorer', props: {}, width: 512 }),
                        ],
                        // enableSingleTabStretch: true,
                    },
                    //     ],
                    // },
                    // {
                    //     id: 'rightPane',
                    //     type: 'row',
                    //     weight: 100,
                    //     children: [
                    {
                        type: 'tabset',
                        id: RIGHT_PANE_TABSET_ID,
                        // enableClose: false,
                        // enableDeleteWhenEmpty: false,
                        minWidth: 100,
                        minHeight: 100,
                        selected: 1,
                        children: [
                            this._add({ panelName: 'Output', props: {}, canClose: false }),
                            // this._add({ panel: 'Hosts', props: {}, canClose: false }),
                        ],
                    },
                    //     ],
                    // },
                ],
            },
        }

        return out
    }

    /**
     * @experimental
     * @unstable
     */
    addCustom = <T extends any>(panel: CustomPanelRef<any, T>, props: T) => {
        this.FOCUS_OR_CREATE('Custom', { uid: panel.uid, props }, 'RIGHT_PANE_TABSET')
    }

    /**
     * @experimental
     * @unstable
     */
    addCustomV2 = <T extends any>(fn: FC<T>, props: T) => {
        const uid = uniqueIDByMemoryRef(fn)
        const panel = registerCustomPanel(uid, fn)
        this.FOCUS_OR_CREATE('Custom', { uid: panel.uid, props }, 'RIGHT_PANE_TABSET')
    }

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
