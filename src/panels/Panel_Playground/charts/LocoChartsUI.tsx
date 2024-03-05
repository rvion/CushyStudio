import ReactEChartsCore from 'echarts-for-react/lib/core'
import { observer } from 'mobx-react-lite'

import { locoCharts, type LocoChartsOpts } from './locoCharts'
import { nanoid } from 'nanoid'

type LocoChartProps = {
    options: LocoChartsOpts
    theme?: string
}

export const LocoChartUI = observer(function LocoChartUI_(p: LocoChartProps) {
    return (
        <ReactEChartsCore //
            echarts={locoCharts}
            theme={p.theme}
            option={p.options}
            style={{ height: '20rem', width: '100%' }}
        />
    )
})
