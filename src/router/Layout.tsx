import type { PropsOf } from '../csuite/types/PropsOf'
import type { STATE } from '../state/state'
import type { PanelPersistedJSON } from './PanelPersistedJSON'

import * as FL from 'flexlayout-react'
import { Actions, IJsonModel, Layout, Model as FlexLayoutModel } from 'flexlayout-react'
import { action, makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { createElement, createRef, FC, type RefObject } from 'react'

import { hashJSONObjectToNumber } from '../csuite/hashUtils/hash'
import { getIconAsDataSVG } from '../csuite/icons/iconStr'
import { Message } from '../csuite/inputs/shims'
import { PanelUI } from '../csuite/panel/PanelUI'
import { regionMonitor } from '../csuite/regions/RegionMonitor'
import { Trigger } from '../csuite/trigger/Trigger'
import { bang } from '../csuite/utils/bang'
import { toastError } from '../csuite/utils/toasts'
import { type CustomPanelRef, registerCustomPanel } from '../panels/PanelCustom/CustomPanels'
import { PanelWelcome, PanelWelcomeUI } from '../panels/PanelWelcome/PanelWelcome'
import { PanelContainerUI } from './PanelContainerUI'
import { PanelName, panels, Panels } from './PANELS'
import { type TraversalNextStep, type TraverseFn, traverseLayoutNode } from './traverseLayoutNode'

export type TabsetExt = 'active' | 'hoverd' | FL.TabSetNode

// prettier-ignore
export type PanelPlacement =
    /** open in the current pane */
    | 'current'
    /** open in the nearest parent row, on the left of current tabset */
    | 'left'
    /** open in the nearest parent row, on the right of current tabset */
    | 'right'
    /** open ..... TODO */
    | 'below'
    /** open in the tabset that have the biggest area */
    | 'biggest'
    /** open in the non-current tabset that have the biggest area */
    | 'biggest-except-current'

type TabsetID = string
type PerspectiveDataForSelect = {
    label: string
    value: string
}

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
    /** the current Flexlayout Model, holding the position of all panels */
    model!: FlexLayoutModel

    setSingleTabStretch(value: boolean): void {
        const action = Actions.updateModelAttributes({
            tabSetEnableSingleTabStretch: value,
        })
        this.model.doAction(action)
    }

    /**
     * Useful to properly force react component to refresh when switching
     * between different perspectives
     */
    private modelKey = 0
    private setModel(model: FlexLayoutModel): void {
        this.model = model
        this.modelKey++
    }

    constructor(public st: STATE) {
        const prevLayout = st.configFile.value.layouts_v13?.default
        const json = prevLayout ?? this.makeDefaultLayout()
        try {
            this.setModel(FlexLayoutModel.fromJson(json))
        } catch (e) {
            console.log('[💠] Layout: ❌ error loading layout', e)
            this.setModel(FlexLayoutModel.fromJson(this.makeDefaultLayout()))
        }
        makeAutoObservable(this, {
            layoutRef: false,
            open: action,
        })
    }

    /** pretty print model layout as json */
    prettyPrintLayoutModel(): void {
        console.log(`[💠] layout model:`, JSON.stringify(this.model.toJson(), null, 4))
    }

    private _getTabset(tse: TabsetExt): FL.TabSetNode {
        if (tse === 'active') return this.getActiveOrFirstTabset_orThrow()
        if (tse === 'hoverd') return this.getHoveredOrFirstTabset_orThrow()
        return tse
    }

    // Tabset Size Manipulation -----------------------------------------------------------
    /** widen given tabset by given factor (default to 1.3) */
    widenTabset(tse: TabsetExt, factor = 1.3): void {
        this.prettyPrintLayoutShape()
        const tabset = this._getTabset(tse)
        const prevWeight = tabset.getWeight()
        this.do((a) =>
            a.updateNodeAttributes(
                //
                tabset.getId(),
                { weight: prevWeight * factor },
            ),
        )
    }

    /** widen given tabset by given factor (default to 0.7) */
    shrinkTabset(tse: TabsetExt, factor = 0.7): void {
        this.prettyPrintLayoutShape()
        const tabset = this._getTabset(tse)
        const prevWeight = tabset.getWeight()
        this.do((a) =>
            a.updateNodeAttributes(
                //
                tabset.getId(),
                { weight: prevWeight * factor },
            ),
        )
    }

    /** reset tabset size by resetting it's layout weight (default to 1) */
    resetTabsetSize(tse: TabsetExt, weight = 100): void {
        this.prettyPrintLayoutShape()
        const tabset = this._getTabset(tse)
        this.do((a) => a.updateNodeAttributes(tabset.getId(), { weight }))
    }

    // Tabset Size Manipulation -----------------------------------------------------------

    /** pretty print model shape as tree, only showing important infos */
    prettyPrintLayoutShape(): void {
        const out: string[] = []
        function getDepth(node: FL.Node): number {
            let depth = 0
            let at: Maybe<FL.Node> = node
            while (at != null) {
                depth++
                at = at.getParent()
            }
            return depth
        }
        this.traverse({
            onNode2({ type, node }) {
                const weight =
                    type === 'tabset' //
                        ? ` (${node.getWeight().toString()})`
                        : ''
                out.push(`${'  '.repeat(getDepth(node))}${type}${weight}`)
                return null
            },
        })
        console.log(`[💠] layout shape:\n${out.join('\n')}`)
    }

    /** quick method to maximize a tabset */
    _maximizeToggle(tabsetNodeID: string): Trigger {
        return this.do(Actions.maximizeToggle(tabsetNodeID))
    }

    /**
     * wrap model.doAction,
     * allow to use lambda syntax to inject Action builder
     * return Trigger.Success
     */
    do(action_: FL.Action | ((actions: typeof Actions) => FL.Action)): Trigger {
        const action: FL.Action =
            typeof action_ === 'function' //
                ? action_(Actions)
                : action_
        this.model.doAction(action)
        return Trigger.Success
    }

    /** utility to apply a function on the active tabset */
    _withActiveTabset<Ret extends any>(fn: (tabset: FL.TabSetNode) => Ret): Ret | Trigger {
        const tabset: FL.TabSetNode | undefined = this.getActiveOrFirstTabset_orThrow()
        return fn(tabset)
    }

    /** utility to apply a function on the hovered tabset */
    _withHoveredTabset<Ret extends any>(fn: (tabset: FL.TabSetNode) => Ret): Ret | Trigger {
        const tabset: Maybe<FL.TabSetNode> = this.hoveredTabset
        if (tabset == null) {
            console.log(`[❌] maximizHoveredTabset: tabset is null`)
            return Trigger.UNMATCHED
        }
        return fn(tabset)
    }

    /** utility to apply a function on the whole layout */
    _withLayout<Ret extends any>(fn: (layout: Layout) => Ret): Ret | Trigger {
        const layout: FL.Layout | null = this.layoutRef.current
        if (layout == null) {
            console.log(`[❌] _withLayout: layout is null`)
            return Trigger.UNMATCHED
        }
        return fn(layout)
    }

    /** close all tabs currently open */
    closeAllTabs(): Trigger {
        let tabset = this.getActiveOrFirstTabset_orNull()
        if (tabset == null) return Trigger.UNMATCHED
        while (tabset != null) {
            this.do(Actions.deleteTabset(tabset.getId()))
            tabset = this.getActiveOrFirstTabset_orNull()
        }
        return Trigger.Success
    }

    closeCurrentTabset(): Trigger {
        let tabset = this.getActiveOrFirstTabset_orNull()
        if (tabset == null) return Trigger.UNMATCHED
        this.do(Actions.deleteTabset(tabset.getId()))
        return Trigger.Success
    }

    getAllTabset(): FL.TabSetNode[] {
        const tabsets: FL.TabSetNode[] = []
        this.traverse({
            onTabset: (tabset): TraversalNextStep => {
                tabsets.push(tabset)
                return 'stop'
            },
        })
        return tabsets
    }

    get biggestTabset(): Maybe<FL.TabSetNode> {
        const tabsets = this.getAllTabset()
        let biggest: Maybe<FL.TabSetNode> = null
        let biggestArea: number = 0
        for (const tabset of tabsets) {
            const rect = tabset.getRect()
            const area = rect.width * rect.height
            if (area > biggestArea) {
                biggest = tabset
                biggestArea = area
                continue
            }
        }
        return biggest
    }

    /** same as cmd+page-up in vscode: focus previous tab in tabset */
    openPreviousPane(): Trigger {
        return this._withActiveTabset((tabset) => {
            // select previous tab
            const selected = tabset.getSelected()
            if (selected == null) return Trigger.UNMATCHED
            const prev = selected - 1
            if (prev < 0) return Trigger.UNMATCHED
            const allTabsInTabset = tabset.getChildren()
            const prevID = allTabsInTabset[prev]!.getId()
            this.do(Actions.selectTab(prevID))
            return Trigger.Success
        })
    }

    /** same as cmd+page-down in vscode: focus next tab in tabset */
    openNextPane(): Trigger {
        return this._withActiveTabset((tabset) => {
            // select next tab
            const selected = tabset.getSelected()
            if (selected == null) return Trigger.UNMATCHED
            const next = selected + 1
            const allTabsInTabset = tabset.getChildren()
            if (next >= allTabsInTabset.length) return Trigger.UNMATCHED
            const nextID = allTabsInTabset[next]!.getId()
            this.do(Actions.selectTab(nextID))
            return Trigger.Success
        })
    }

    /** maximize the active(=selected; with focus) tabset */
    maximizeActiveTabset(): Trigger {
        return this._withActiveTabset((tabset) => this._maximizeToggle(tabset.getId()))
    }

    /** maximize the tabset under the mouse */
    maximizHoveredTabset = (): Trigger => {
        return this._withHoveredTabset((tabset) => this._maximizeToggle(tabset.getId()))
    }

    getHoveredOrFirstTabset_orThrow = (): FL.TabSetNode => {
        return (
            this.hoveredTabset ?? //
            this._assertTabsetNode_orThrow(this.model.getFirstTabSet())
        )
    }

    getHoveredOrFirstTabset_orNull = (): Maybe<FL.TabSetNode> => {
        return (
            this.hoveredTabset ?? //
            this._assertTabsetNode_orNull(this.model.getFirstTabSet())
        )
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
    /**
     * currently active perspective name
     * DO NOT UPDATE THAT MANUALLY
     */
    currentPerspectiveName = 'default'

    allPerspectives: PerspectiveDataForSelect[] = [
        { label: 'default', value: 'default' },
        { label: 'test', value: 'test' },
    ]

    /**
     * update the currently selected perspective to the current layout
     * allow to easilly revert to this specific set of panels later
     */
    saveCurrentPerspective(): void {
        return this.saveCurrentPerspectiveAs(this.currentPerspectiveName)
    }

    saveCurrentPerspectiveAsDefault(): void {
        return this.saveCurrentPerspectiveAs('default')
    }

    saveCurrentPerspectiveAs(perspectiveName: string): void {
        const curr: FL.IJsonModel = this.model.toJson()
        this.st.configFile.update((t) => {
            t.layouts_v13 ??= {}
            t.layouts_v13[perspectiveName] = curr
        })
    }

    resetCurrent(): void {
        this.reset(this.currentPerspectiveName)
    }

    resetDefault(): void {
        this.reset('default')
    }

    reset(perspectiveName: string): void {
        this.st.configFile.update((t) => {
            t.layouts_v13 ??= {}
            delete t.layouts_v13[perspectiveName]
        })
        if (perspectiveName === this.currentPerspectiveName) {
            this.setModel(FlexLayoutModel.fromJson(this.makeDefaultLayout()))
        }
    }

    layoutRef: RefObject<FL.Layout> = createRef<Layout>()
    updateCurrentTab(p: Partial<FL.TabNode>): void {
        const tab = this.currentTab
        if (tab == null) return
        this.model.doAction(Actions.updateNodeAttributes(tab.getId(), p))
    }

    isPanelVisible(panelName: PanelName): boolean {
        const node = this.findTabsFor(panelName)
        const tab = node[0]
        if (tab == null) return false
        return tab.tabNode.isVisible()
    }

    currentTabSet: Maybe<FL.TabSetNode> = null
    currentTab: Maybe<FL.Node> = null
    currentTabID: Maybe<string> = null

    private _isTabset(node: FL.Node): node is FL.TabSetNode {
        return node.getType() === 'tabset'
    }

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
                onTabSetPlaceHolder={() => {
                    return (
                        <PanelUI>
                            <PanelWelcomeUI />
                        </PanelUI>
                    )
                }}
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
                    this.saveCurrentPerspectiveAsDefault()
                }}
            />
        )
    })

    /** rename tab by ID */
    renameTab(tabID: string, newName: string): void {
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
    renameCurrentTab(newName: string): void {
        const tabset = this.getActiveOrFirstTabset_orThrow()
        if (tabset == null) return
        const tab = tabset.getSelectedNode()
        if (tab == null) return
        const tabID = tab.getId()
        this.model.doAction(Actions.renameTab(tabID, newName))
    }

    closeCurrentTab(tse: TabsetExt = 'hoverd'): Trigger {
        // 1. find tabset
        const tabset = this._getTabset(tse)
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

    closeTab(tabID: string): Trigger {
        const shouldRefocusAfter = this.currentTabID === tabID
        this.model.doAction(Actions.deleteTab(tabID))
        return Trigger.Success
    }

    currentHoveredTabIs<K extends PanelName>(component: K): boolean {
        return regionMonitor.hoveredRegion?.type === component
    }

    currentTabIs<K extends PanelName>(component: K): Maybe<Panels[K]['$Props']> {
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

    findTabsFor = <K extends PanelName>(
        component: K,
    ): {
        //
        tabNode: FL.TabNode
        props: Panels[K]['$Props']
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
            .map((tab) => {
                type Props = PropsOf<Panels[K]['widget']>
                const config: PanelPersistedJSON<Props> = tab.getConfig()
                const props: Props = bang(config.$props) // config /* hack */
                return { props, tabNode: tab }
            })
        return out
    }

    /** practical way to keep a tab properly named (synced with it's content) */
    syncTabTitle<const K extends PanelName>(
        //
        panelName: K,
        props: PropsOf<Panels[K]['widget']>,
        title: string,
    ): void {
        const tabID = `/${panelName}/${hashJSONObjectToNumber(props ?? {})}`
        const tab = this.model.getNodeById(tabID)
        if (tab == null) return
        runInAction(() => {
            this.model.doAction(Actions.renameTab(tabID, title || panelName))
        })
    }
    // TRAVERSAL CAPABILITIES --------------------------------------------------------

    /** traverse layout tree from the root */
    traverse(fns: TraverseFn): void {
        const root: FL.RowNode = this.model.getRoot()
        traverseLayoutNode(root, fns)
    }

    /** traverse layout tree from a specific node */
    traverseLayoutNode(node: FL.Node, fns: TraverseFn): void {
        return traverseLayoutNode(node, fns)
    }

    /** fix all tabs that have negative size */
    fixTabsWithNegativeArea(): void {
        const root: FL.RowNode = this.model.getRoot()
        const minHeight = 100
        const minWidth = 100
        traverseLayoutNode(root, {
            onNode1: (node): undefined => {
                // console.log(`[🤠] `, node.getId(), node.getType(), node.getRect())
                const rect = node.getRect()
                if (rect.width < minWidth) {
                    console.log(`[🔴] invalid ${node.getType()} width`, JSON.stringify(node.toJson(), null, 4))
                }
                if (rect.height < minHeight) {
                    console.log(`[🔴] invalid ${node.getType()} height`, JSON.stringify(node.toJson(), null, 4))
                }
                return
            },
        })
    }

    // CREATION --------------------------------------------------------
    // clone = <PANEL_NAME extends PanelName>(
    //     panelState: PanelState,
    //     panelName: PANEL_NAME,
    //     panelProps: PropsOf<Panels[NoInfer<PANEL_NAME>]['widget']>,
    // ): void => {
    //     if (panelState.getConfig)
    // }

    open = <PANEL_NAME extends PanelName>(
        panelName: PANEL_NAME,
        panelProps: PropsOf<Panels[NoInfer<PANEL_NAME>]['widget']>,
        conf: {
            /**
             * you can specify where to open the panel,
             * relative to the currently active one
             * @default 'right'
             */
            where?: PanelPlacement
            /**
             * allow to specify whether the placement specified should be
             * relative to the `active` or the `focused` tab
             * @default 'active'
             */
            relativeTo?: 'active' | 'hovered'

            /**
             * allow to pre-fill the panel $store data
             * notably usefull when cloning a tab
             * 🔶 YOU NEED TO DEEP-CLONE the object if needed BEFORE
             */
            $store?: any

            /**
             * allow to pre-fill the panel $store data
             * notably usefull when cloning a tab
             * 🔶 YOU NEED TO DEEP-CLONE the object if needed BEFORE
             */
            $temp?: any
        } = {},
    ): Maybe<FL.Node> => {
        // 1. retrieve the layout model
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) return void console.log('❌ no currentLayout')

        // 2. compute unique URI for panel
        const panelURI = `/${panelName}/${hashJSONObjectToNumber(panelProps ?? {})}`

        // 3. find possibly existing panel with same URI
        let prevTab: FL.TabNode | undefined
        prevTab = this.model.getNodeById(panelURI) as FL.TabNode // 🔴 UNSAFE ?

        // 4. create panel if no
        if (prevTab == null) {
            const tabsetIDToAddThePanelTo = ((): TabsetID => {
                // case biggest
                if (conf.where === 'biggest') {
                    return this.biggestTabset?.getId() ?? this.getActiveOrFirstTabset_orThrow().getId()
                }

                // case current
                if (
                    conf.where === 'current' || //
                    conf.where == null
                ) {
                    return this.getActiveOrFirstTabset_orThrow().getId()
                }

                // temporary catch-all until we're done implementing
                // all `where` options
                return this.getActiveOrFirstTabset_orThrow().getId()
            })()

            const panel = panels[panelName]
            const { title } = panel.header(panelProps as any)
            const icon = panel.icon
            const config: PanelPersistedJSON = {
                $props: panelProps ?? {},
                $store: conf.$store ?? {},
                $temp: conf.$temp ?? {},
            }
            const addition = currentLayout.addTabToTabSet(tabsetIDToAddThePanelTo, {
                component: panelName,
                id: panelURI,
                icon: getIconAsDataSVG(icon),
                name: title,
                config,
            })
            prevTab = this.model.getNodeById(panelURI) as FL.TabNode // 🔴 UNSAFE ?
            if (prevTab == null) {
                console.log(`[🧐] addition:`, addition, { component: panelName, tabID: panelURI, icon, title, props: panelProps })
                this.prettyPrintLayoutModel()
                return void console.log('❌ no new tab')
            }
        }
        if (conf.where === 'below') {
            this.do((t) =>
                t.moveNode(
                    //
                    panelURI,
                    prevTab.getParent()!.getId(),
                    FL.DockLocation.BOTTOM,
                    -1,
                    true,
                ),
            )
        }
        // 5. update panel if it already exists
        else {
            const prevConfig: PanelPersistedJSON = prevTab.getConfig()
            const nextConfig = { ...prevConfig, $props: panelProps }
            this.model.doAction(Actions.updateNodeAttributes(panelURI, { config: nextConfig }))
            this.model.doAction(Actions.selectTab(panelURI))
        }

        // 4. merge props
        // this.model.doAction(Actions.updateNodeAttributes(tabID, /* 🔴 */ panelProps))
        return prevTab
    }

    // 🔴 todo: ensure we correctly pass ids there too
    private defineTab<const PN extends PanelName>(p: {
        panelName: PN
        props: PropsOf<Panels[PN]['widget']>
        width?: number
        canClose?: boolean
    }): FL.IJsonTabNode {
        const { panelName, props } = p
        const id = `/${panelName}/${hashJSONObjectToNumber(props ?? {})}`
        const panel = panels[panelName]
        const { title } = panel.header(props as any)
        const icon = panel.icon
        const config: PanelPersistedJSON = { $props: props, $store: {}, $temp: {} }
        return {
            id: id,
            type: 'tab',
            name: title,
            config,
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
            //     //     children: [this.defineTab({ panelName: 'TreeExplorer', props: {}, canClose: false, width: 300 })],
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
            //             this.defineTab({ panelName: 'Gallery', props: {} }),
            //             this.defineTab({ panelName: 'Steps', props: {}, canClose: false }),
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
                        minWidth: 150,
                        minHeight: 150,
                        // width: 512,
                        // enableClose: false,
                        // enableDeleteWhenEmpty: false,
                        children: [
                            //
                            this.defineTab({ panelName: 'Welcome', props: {}, width: 512 }),
                            this.defineTab({ panelName: 'PanelAppLibrary', props: {}, width: 512 }),
                            this.defineTab({ panelName: 'TreeExplorer', props: {}, width: 512 }),
                        ],
                        // enableSingleTabStretch: true,
                    },
                    {
                        type: 'tabset',
                        // enableClose: false,
                        // enableDeleteWhenEmpty: false,
                        minWidth: 100,
                        minHeight: 100,
                        selected: 0,
                        children: [
                            this.defineTab({ panelName: 'Output', props: {}, canClose: false }),
                            // this.defineTab({ panelName: 'Hosts', props: {}, canClose: false }),
                        ],
                    },
                    {
                        type: 'tabset',
                        // enableClose: false,
                        // enableDeleteWhenEmpty: false,
                        minWidth: 100,
                        minHeight: 100,
                        selected: 0,
                        children: [
                            this.defineTab({ panelName: 'Gallery', props: {} }),
                            // this.defineTab({ panelName: 'Output', props: {}, canClose: false }),
                            // this.defineTab({ panelName: 'Hosts', props: {}, canClose: false }),
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
    addCustom<T extends any>(panel: CustomPanelRef<any, T>, props: T): void {
        this.open('Custom', { uid: panel.uid, props })
    }

    /**
     * @experimental
     * @unstable
     */
    addCustomV2<T extends any>(fn: FC<T>, props: T): void {
        const uid = uniqueIDByMemoryRef(fn)
        const panel = registerCustomPanel(uid, fn)
        this.open('Custom', { uid: panel.uid, props })
    }

    factory(node: FL.TabNode): React.ReactNode {
        // 1. get panel name
        const panelName = node.getComponent() as Maybe<PanelName>
        if (panelName == null)
            return (
                <Message type='error' showIcon>
                    no panel (TabNode.getComponent())
                </Message>
            )

        // 2. get panel props
        const panelConfig: PanelPersistedJSON = node.getConfig()
        const panelProps = bang(panelConfig.$props) // panelConfig /* 🔴 HACKY backward config */

        // temporary assertions; to be removed when we're sure there is no more wrong config
        if ('$props' in panelProps) throw new Error('❌ $props in panelProps')
        if ('$store' in panelProps) throw new Error('❌ $store in panelProps')
        if ('$temp' in panelProps) throw new Error('❌ $temp in panelProps')

        if (panelProps == null)
            return (
                <Message type='error' showIcon>
                    no panel props (TabNode.getConfig().$props)
                </Message>
            )

        return createElement(PanelContainerUI, {
            node,
            panelName,
            panelProps,
        })
    }
}
