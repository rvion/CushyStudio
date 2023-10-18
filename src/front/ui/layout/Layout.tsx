import type { STATE } from 'src/front/state'

import type * as FL from 'flexlayout-react'
import { IJsonModel, Layout, Model } from 'flexlayout-react'

import 'flexlayout-react/style/dark.css'
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
}

export class CushyLayoutManager {
    model: Model

    constructor(public st: STATE) {
        const json = this.build()
        this.model = Model.fromJson(json)
    }

    layoutRef = createRef<Layout>()

    UI = () => (
        <Layout //
            ref={this.layoutRef}
            model={this.model}
            factory={this.factory}
        />
    )

    nextPaintIDx = 0
    addPaint = (imgID: ImageID) => {
        // add a new tabset to the current tabset
        const tabsetNode = this.model.getActiveTabset()!
        const currentLayout = this.layoutRef.current
        if (currentLayout == null) return console.log('❌ no currentLayout')

        const nanoID = nanoid()
        currentLayout.addTabToTabSet('MAINTYPESET', {
            component: Widget.Paint,
            id: nanoID,
            icon: 'images/article.svg',
            name: 'Grid ' + this.nextPaintIDx++,
            // @ts-ignore
        })

        const tabAdded = this.model.getNodeById(nanoID)
        // const tabAdded = tabsetNode.getChildren().find((node) => node.getId() === nanoID) as FL.TabNode
        if (tabAdded == null) return console.log('❌ no tabAdded')
        const extraData = (tabAdded as any)?.getExtraData()
        extraData.imgID = imgID
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
        if (component === Widget.Graph) return <GraphUI depth={1} />
        if (component === Widget.ComfyUI) return <div>ComfyUI</div>
        if (component === Widget.FileList) return <ActionPickerUI />
        if (component === Widget.Steps) return <StepListUI />
        if (component === Widget.LastGraph) return <LastGraphUI />
        if (component === Widget.LastIMage) return <LastImageUI />
        if (component === Widget.Civitai)
            return <iframe className='w-full h-full' src={'https://civitai.com'} frameBorder='0'></iframe>
        if (component === Widget.Image) return <div>Image</div>
        if (component === Widget.Hosts) return <HostListUI />

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
                                weight: 1,
                                minWidth: 300,
                                minHeight: 300,
                                children: [this._persistentTab('Hosts', Widget.Hosts)],
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
                                ],
                            },
                            {
                                type: 'tabset',
                                weight: 10,
                                minHeight: 200,
                                children: [this._persistentTab('🎆 Gallery', Widget.Gallery)],
                            },
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
