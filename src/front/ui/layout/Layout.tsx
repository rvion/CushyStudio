import type { STATE } from 'src/front/state'

import type * as FL from 'flexlayout-react'
import { IJsonModel, Layout, Model } from 'flexlayout-react'

import { Button, Message } from 'rsuite'
import { GalleryUI } from '../galleries/GalleryUI'
import { GraphUI } from '../workspace/GraphUI'
import { ActionPickerUI } from '../workspace/ActionPickerUI'
import { StepListUI } from '../workspace/StepUI'
import { LastGraphUI } from '../workspace/LastGraphUI'
import { createRef } from 'react'
import { ImageID } from 'src/models/Image'
import { nanoid } from 'nanoid'
import { WidgetPaintUI } from '../widgets/WidgetPaintUI'
import { LastImageUI } from './LastImageUI'
import { HostListUI } from './HostListUI'
import { ComfyUIUI } from '../workspace/ComfyUIUI'
import { LiteGraphJSON } from 'src/core/LiteGraph'
import { MarketplaceUI } from '../../../marketplace/MarketplaceUI'
import { observer } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx'

// still on phone
enum Widget {
    Gallery = 'Gallery',
    Button = 'Button',
    Paint = 'Paint',
    Graph = 'Graph',
    ComfyUI = 'ComfyUI',
    FileList = 'FileList',
    Steps = 'Steps',
    LastGraph = 'LastGraph',
    LastIMage = 'LastIMage',
    Civitai = 'Civitai',
    Image = 'Image',
    Hosts = 'Hosts',
    Marketplace = 'Marketplace',
}

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
            t.perspectives ??= {}
            t.perspectives[perspectiveName] = curr
        })
    }

    resetCurrent = (): void => this.reset(this.currentPerspectiveName)
    resetDefault = (): void => this.reset('default')
    reset = (perspectiveName: string): void => {
        this.st.configFile.update((t) => {
            t.perspectives ??= {}
            delete t.perspectives[perspectiveName]
        })
        if (perspectiveName === this.currentPerspectiveName) {
            this.setModel(Model.fromJson(this.build()))
        }
    }

    constructor(public st: STATE) {
        const prevLayout = st.configFile.value.perspectives?.default
        const json = prevLayout ?? this.build()
        try {
            this.setModel(Model.fromJson(json))
        } catch (e) {
            console.log('[💠] Layout: ❌ error loading layout', e)
            this.setModel(Model.fromJson(this.build()))
        }
        makeAutoObservable(this)
    }

    layoutRef = createRef<Layout>()

    UI = observer(() => {
        console.log('LAYOUT rendering')
        return (
            <Layout //
                onModelChange={(model) => {
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
    addPaint = (imgID: ImageID) => {
        return this._AddWithProps(Widget.Paint, { title: 'Paint', imgID })
    }

    addImage = (imgID: ImageID) => {
        return this._AddWithProps(Widget.Image, { title: 'Image', imgID })
    }

    addComfy = (litegraphJson: LiteGraphJSON) => {
        return this._AddWithProps(Widget.ComfyUI, { title: 'Comfy', litegraphJson })
    }

    _AddWithProps = <
        T extends {
            icon?: string
            title: string
        },
    >(
        widget: Widget,
        p: T,
    ): Maybe<FL.Node> => {
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) {
            console.log('❌ no currentLayout')
            return
        }

        const nanoID = nanoid()
        currentLayout.addTabToTabSet('MAINTYPESET', {
            component: widget,
            id: nanoID,
            icon: p.icon,
            name: p.title,
        })

        const tabAdded = this.model.getNodeById(nanoID)
        if (tabAdded == null) {
            console.log('❌ no tabAdded')
            return
        }
        const extraData = (tabAdded as any)?.getExtraData()
        Object.assign(extraData, p)
        return tabAdded
    }

    factory = (node: FL.TabNode): React.ReactNode => {
        const component = node.getComponent() as Widget
        const extraData = node.getExtraData() // Accesses the extra data stored in the node
        if (component === Widget.Button) return <Button>{node.getName()}</Button>
        if (component === Widget.Gallery) return <GalleryUI />
        if (component === Widget.Paint) {
            // 🔴 ensure this is type-safe
            const imgID = extraData.imgID // Retrieves the imgID from the extra data
            return <WidgetPaintUI action={{ type: 'paint', imageID: imgID }}></WidgetPaintUI> // You can now use imgID to instantiate your paint component properly
        }
        if (component === Widget.Image) {
            // 🔴 ensure this is type-safe
            const imgID = extraData.imgID // Retrieves the imgID from the extra data
            return <LastImageUI imageID={imgID}></LastImageUI> // You can now use imgID to instantiate your paint component properly
        }
        if (component === Widget.Graph) return <GraphUI depth={1} />
        if (component === Widget.ComfyUI) {
            const litegraphJson = extraData.litegraphJson // Retrieves the imgID from the extra data
            return <ComfyUIUI litegraphJson={litegraphJson} />
        }
        if (component === Widget.FileList) return <ActionPickerUI />
        if (component === Widget.Steps) return <StepListUI />
        if (component === Widget.LastGraph) return <LastGraphUI />
        if (component === Widget.LastIMage) return <LastImageUI />
        if (component === Widget.Civitai)
            return <iframe className='w-full h-full' src={'https://civitai.com'} frameBorder='0'></iframe>
        if (component === Widget.Hosts) return <HostListUI />
        if (component === Widget.Marketplace) return <MarketplaceUI />

        exhaust(component)
        return (
            <Message type='error' showIcon>
                unknown component
            </Message>
        )
    }

    private _persistentTab = (name: string, widget: Widget, icon?: string): FL.IJsonTabNode => {
        return {
            type: 'tab',
            name,
            component: widget,
            enableClose: false,
            enableRename: false,
            enableFloat: true,
            icon,
        }
    }
    build = (): IJsonModel => {
        const out: IJsonModel = {
            global: {
                enableEdgeDock: true,
            },
            borders: [
                // {
                //     type: 'border',
                //     location: 'left',
                //     children: [
                //         {
                //             type: 'tab',
                //             id: '#426ca38f-57b1-4973-89f4-424400f95f3d',
                //             name: 'Output',
                //             component: 'grid',
                //             enableClose: false,
                //             icon: 'images/bar_chart.svg',
                //         },
                //     ],
                // },
                {
                    type: 'border',
                    location: 'right',
                    children: [],
                },
            ],
            layout: {
                type: 'row',
                weight: 100,
                children: [
                    {
                        type: 'row',
                        weight: 10,
                        children: [
                            {
                                type: 'tabset',
                                weight: 10,
                                minWidth: 300,
                                children: [this._persistentTab('FileList', Widget.FileList)],
                            },
                            {
                                type: 'tabset',
                                weight: 10,
                                minWidth: 300,
                                children: [this._persistentTab('Marketplace', Widget.Marketplace)],
                            },
                            {
                                type: 'tabset',
                                weight: 10,
                                minWidth: 300,
                                minHeight: 300,
                                children: [
                                    this._persistentTab('🎆 Gallery', Widget.Gallery),
                                    this._persistentTab('Hosts', Widget.Hosts),
                                ],
                            },
                        ],
                    },
                    {
                        type: 'row',
                        weight: 100,
                        children: [
                            {
                                type: 'tabset',
                                id: 'MAINTYPESET',
                                weight: 100,
                                children: [
                                    //
                                    { type: 'tab', name: 'Graph', component: Widget.Graph },
                                    this._persistentTab('Civitai', Widget.Civitai, '/CivitaiLogo.png'),
                                    this._persistentTab('ComfyUI', Widget.ComfyUI, '/ComfyUILogo.png'),
                                ],
                            },
                            // {
                            //     type: 'tabset',
                            //     weight: 10,
                            //     minHeight: 200,
                            //     children: [this._persistentTab('🎆 Gallery', Widget.Gallery)],
                            // },
                        ],
                    },
                    {
                        type: 'row',
                        weight: 10,
                        children: [
                            {
                                type: 'tabset',
                                weight: 1,
                                minWidth: 100,
                                minHeight: 100,
                                children: [this._persistentTab('Last Graph', Widget.LastGraph)],
                            },
                            {
                                type: 'tabset',
                                minWidth: 300,
                                minHeight: 300,
                                weight: 10,
                                children: [this._persistentTab('Last Image', Widget.LastIMage)],
                            },
                            {
                                type: 'tabset',
                                minWidth: 300,
                                weight: 100,
                                children: [this._persistentTab('Runs', Widget.Steps)],
                            },
                        ],
                    },
                ],
            },
        }

        return out
    }
}

// function App() {
//     const factory = (node) => {
//         var component = node.getComponent()

//         if (component === 'button') {
//             return <button>{node.getName()}</button>
//         }
//     }

//     return <Layout model={model} factory={factory} />
// }
// }
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
