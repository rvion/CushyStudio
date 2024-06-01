import * as icons from '@mdi/js'
import { Icon } from '@mdi/react'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { FixedSizeGrid } from 'react-window'

import { useSizeOf } from '../../controls/utils/useSizeOf'
import { getAllIcons } from '../../icons/iconHelpers'
import { Frame } from '../../rsuite/frame/Frame'
import { searchMatches } from '../../utils/misc/searchMatches'
import { PanelHeaderUI } from '../PanelHeader'

export const Panel_Icons = observer(function Panel_Icons_(p: {}) {
    const { ref: refFn, size } = useSizeOf()
    const uist = useLocalObservable(() => ({ query: '' }))
    const form = cushy.forms.use((ui) =>
        ui.fields({
            size: ui.int({ min: 32, max: 500, default: 64 }),
            showNames: ui.boolean({ default: false }),
        }),
    )
    const allIconsUnfiltered = getAllIcons()
    const allIcons = uist.query //
        ? allIconsUnfiltered.filter((x) => searchMatches(x, uist.query))
        : allIconsUnfiltered
    const total = allIcons.length
    const itemSize = form.value.size
    const itemWidth = itemSize /* 100 */
    const itemHeight = itemSize /* 100 */
    const containerWidth = size.width ?? 100
    const containerHeight = size.height ?? 100
    const nbCols = Math.floor(containerWidth / itemWidth) || 1
    const nbRows = Math.ceil(total / nbCols) + 1
    const showNames = form.value.showNames
    return (
        <div tw='h-full w-full flex flex-col'>
            <PanelHeaderUI>
                {/*  */}
                {form.renderAsConfigBtn()}
                <input
                    tw='input my-0.5 input-xs'
                    placeholder='filename'
                    value={uist.query ?? ''}
                    type='text'
                    onChange={(x) => (uist.query = x.target.value)}
                />
            </PanelHeaderUI>
            <Frame text={{ contrast: 0.5, chroma: 0.1, hueShift: 100 }} ref={refFn} tw='flex-1 overflow-clip'>
                <FixedSizeGrid //
                    key={`${showNames}`}
                    // container
                    height={containerHeight}
                    width={containerWidth}
                    // dims
                    columnCount={nbCols}
                    rowCount={nbRows}
                    // items
                    columnWidth={itemWidth}
                    rowHeight={itemHeight}
                >
                    {({ columnIndex, rowIndex, style }) => {
                        const iconName = allIcons[rowIndex * nbCols + columnIndex]
                        if (iconName == null) return
                        if (showNames) {
                            return (
                                <div style={style} tw='overflow-clip'>
                                    <Icon
                                        // tw='hover:text-blue-200 text-white duration-100'
                                        size={`${itemSize - 20}px`}
                                        path={(icons as any)[iconName]}
                                    />
                                    <span style={{ lineHeight: '10px', fontSize: '10px' }}>{iconName.slice(3)}</span>
                                </div>
                            )
                        } else {
                            return (
                                <div style={style}>
                                    <Icon //
                                        // tw='hover:text-blue-200 text-white duration-100'
                                        path={(icons as any)[iconName]}
                                    />
                                </div>
                            )
                        }
                    }}
                </FixedSizeGrid>
            </Frame>
        </div>
    )
})
