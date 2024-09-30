import type { PropsOf } from '../csuite/types/PropsOf'
import type { PanelPersistedJSON } from './PanelPersistedJSON'
import type { PanelName, Panels } from './PANELS'
import type * as FL from 'flexlayout-react'
import type { IJsonModel } from 'flexlayout-react'

import { hashJSONObjectToNumber } from '../csuite/hashUtils/hash'
import { getIconAsDataSVG } from '../csuite/icons/iconStr'
import { panels } from './PANELS'

export class PerspectiveHelper {
    // 🔴 todo: ensure we correctly pass ids there too
    _defineTab<const PN extends PanelName>(p: {
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
            // enablePopout: false,
            icon: getIconAsDataSVG(icon),
        }
    }

    default(): IJsonModel {
        const out: IJsonModel = {
            global: {
                tabEnableFloat: false,
                // tabEnablePopout: false,
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
            //     //     children: [this._defineTab({ panelName: 'TreeExplorer', props: {}, canClose: false, width: 300 })],
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
            //             this._defineTab({ panelName: 'Gallery', props: {} }),
            //             this._defineTab({ panelName: 'Steps', props: {}, canClose: false }),
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
                            this._defineTab({ panelName: 'Welcome', props: {}, width: 512 }),
                            this._defineTab({ panelName: 'PanelAppLibrary', props: {}, width: 512 }),
                            this._defineTab({ panelName: 'TreeExplorer', props: {}, width: 512 }),
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
                            this._defineTab({ panelName: 'Output', props: {}, canClose: false }),
                            // this._defineTab({ panelName: 'Hosts', props: {}, canClose: false }),
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
                            this._defineTab({ panelName: 'Gallery', props: {} }),
                            // this._defineTab({ panelName: 'Output', props: {}, canClose: false }),
                            // this._defineTab({ panelName: 'Hosts', props: {}, canClose: false }),
                        ],
                    },
                    //     ],
                    // },
                ],
            },
        }

        return out
    }
}
export const perspectiveHelper = new PerspectiveHelper()
