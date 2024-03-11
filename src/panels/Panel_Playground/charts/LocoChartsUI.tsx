import type { CSSProperties } from 'react'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import { observer } from 'mobx-react-lite'

import { locoCharts, type LocoChartsOpts } from './locoCharts'

const ReactEChartsCore_Patched =
    'default' in ReactEChartsCore ? (ReactEChartsCore.default as typeof ReactEChartsCore) : ReactEChartsCore

type LocoChartProps = {
    options: LocoChartsOpts
    theme?: string
    dev?: boolean
    style?: CSSProperties
    className?: string
}

export const LocoChartUI = observer(function LocoChartUI_(p: LocoChartProps) {
    return (
        <ReactEChartsCore_Patched //
            style={p.style}
            className={p.className}
            echarts={locoCharts}
            theme={p.theme}
            option={p.options}
            notMerge={p.dev} // Force re-evaluation of all options when in dev mode
        />
    )
})
