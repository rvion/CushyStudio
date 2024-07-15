import * as icons from '@mdi/js'
import { Icon } from '@mdi/react'
import { makeAutoObservable } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { CSSProperties, useMemo } from 'react'
import { FixedSizeGrid } from 'react-window'

import { Button } from '../../csuite/button/Button'
import { InputBoolUI } from '../../csuite/checkbox/InputBoolUI'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { getAllIcons } from '../../csuite/icons/getAllIcons'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { useSizeOf } from '../../csuite/smooth-size/useSizeOf'
import { searchMatches } from '../../csuite/utils/searchMatches'
import { toastError, toastInfo } from '../../csuite/utils/toasts'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { Panel } from '../../router/Panel'

export const PanelIcon = new Panel({
    name: 'Icons',
    widget: () => PanelIconUI,
    header: (p) => ({ title: 'Icons' }),
    def: () => ({}),
    icon: undefined,
})

class IconPanelStableState {
    constructor() {
        makeAutoObservable(this)
    }

    /** Whether or not to use the filter when displaying icons */
    filter: boolean = true
    /** List of recently copied icons */
    recent: Array<string> = []
    /** Used to filter down the icons to match the query. Only used when filter is enabled. */
    query: string = ''

    copy = async (icon: string): Promise<void> => {
        const found = this.recent.indexOf(icon)
        if (found > -1) {
            this.recent.splice(found, 1)
        }
        this.recent.unshift(icon)

        try {
            // Probably should check if it errored, but lazy.
            await navigator.clipboard.writeText(icon)
            toastInfo(`'${icon}' copied to clipboard`)
        } catch (e) {
            toastError(`Error copying to clipboard: ${e}`)
        }
    }
}

const CopyButton = observer(function CopyButton_(p: {
    uist: IconPanelStableState
    icon: string
    showName?: boolean
    style?: CSSProperties
}) {
    return (
        <Button //
            tw={'flex-col overflow-clip'}
            border={false}
            base={{ contrast: 0 }}
            style={p.style}
            onClick={() => {
                return p.uist.copy(p.icon)
            }}
        >
            <Icon path={(icons as any)[p.icon]} />
        </Button>
    )
})

export const PanelIconUI = observer(function PanelIconUI_(p: {}) {
    const { ref: refFn, size } = useSizeOf()
    const uist = useMemo(() => new IconPanelStableState(), [])
    const form = cushy.forms.use((ui) =>
        ui.fields(
            {
                size: ui.int({
                    //
                    label: false, // NOTE(bird_d): This should just do the same thing as justifyLabel == false. Honestly, this should be handled at the group level, then widgets that are children should get the parent's option for whether it should align the label or not.
                    justifyLabel: false,
                    text: 'Size',
                    min: 32,
                    max: 500,
                    default: 64,
                    step: 24,
                    hideSlider: true,
                }),
            },
            { collapsed: false },
        ),
    )
    const allIconsUnfiltered = getAllIcons()
    const allIcons =
        uist.query && uist.filter //
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
    return (
        <div tw='h-full w-full flex flex-col'>
            <PanelHeaderUI>
                <Frame tw='h-input flex flex-row'>
                    <InputStringUI
                        // placeholder='filename'
                        autofocus
                        getValue={() => uist.query}
                        setValue={(val) => (uist.query = val)}
                    />
                    <InputBoolUI
                        value={uist.filter}
                        icon={uist.filter ? 'mdiFilter' : 'mdiFilterOff'}
                        onValueChange={() => {
                            uist.filter = !uist.filter
                        }}
                    />
                </Frame>
                <SpacerUI />
                <Button
                    onClick={() => {
                        uist.recent = []
                    }}
                >
                    Clear Recent
                </Button>
                {form.renderAsConfigBtn({ title: 'Icon Settings' })}
            </PanelHeaderUI>
            <Frame
                base={{ contrast: -0.025 }}
                tw='flex w-full items-center justify-center'
                style={{ height: itemHeight + 8, padding: '4px' }}
            >
                {uist.recent.map((value) => {
                    return <CopyButton style={{ height: itemHeight, width: itemWidth }} uist={uist} key={value} icon={value} />
                })}
            </Frame>
            <Frame text={{ contrast: 0.5, chroma: 0.1, hueShift: 100 }} ref={refFn} tw='flex-1 overflow-clip'>
                <FixedSizeGrid //
                    // key={``}
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
                        return <CopyButton uist={uist} icon={iconName} style={style} />
                    }}
                </FixedSizeGrid>
            </Frame>
        </div>
    )
})
