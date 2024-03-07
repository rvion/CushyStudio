import type { FormBuilder } from 'src/controls/FormBuilder'
import type { LocoChartsOpts } from '../charts/locoCharts'

export type LocoChartsBuilderProps = {
    dataKeys: {
        columns: string[]
        values: string[]
    }
}

type LocoChartsT = ReturnType<typeof ui_lococharts>['$Output']
export const ui_lococharts = (ui: FormBuilder, p: LocoChartsBuilderProps) => {
    const xAxis = ui.list({
        label: '📊 Abcisses',
        element: (ix) =>
            ui.fields(
                {
                    category: ui.selectOne({ choices: (['value', 'category', 'time', 'log'] as const).map((id) => ({ id })) }),
                    dataKey: ui.selectOne({ choices: () => p.dataKeys.columns.map((c) => ({ id: c })) }),
                },
                { layout: 'H' },
            ),
    })

    const series = ui.list({
        label: '📊 Series',
        element: (ix) =>
            ui.fields({
                type: ui.selectOne({ choices: [{ id: 'bar' }, { id: 'line' }] }),
                name: ui.string({}),
                dataKey: ui.selectOne({ choices: () => p.dataKeys.values.map((c) => ({ id: c })) }),
            }),
    })

    return ui.fields(
        {
            title: ui.string({}),
            xAxis,
            series,
        },
        { border: false },
    )
}

export const run_lococharts = (ui: LocoChartsT, data: any[]): LocoChartsOpts => {
    return {
        title: { text: ui.title, left: 'left' },
        legend: {},
        tooltip: { trigger: 'axis' },
        xAxis:
            ui.xAxis.length === 0
                ? {}
                : ui.xAxis.map((x) => {
                      const xx = data.map((row) => row[x.dataKey.id]).sort()
                      return {
                          type: 'time', //x.category.id,
                          min: xx[0],
                          max: xx[xx.length - 1],
                          //   data: res.data.map((row) => row[x.dataKey.id]),
                          //   min
                      }
                  }),
        yAxis: [{}, {}],
        series: ui.series.map((s) => ({
            type: s.type.id,
            name: s.name,
            data: data.map((row) => [row[ui.xAxis[0].dataKey.id], row[s.dataKey.id]]),
        })),
        // series: [
        //     {
        //         type: ui.style.id as 'bar' | 'line',
        //         name: 'Count',
        //         data: data.map((row) => row.count),
        //     },
        //     {
        //         type: 'line' as const, // ui.style.id as 'bar' | 'line',
        //         name: 'Average',
        //         data: data.map((row) => row.avg),
        //         yAxisIndex: 1,
        //     },
        // ],
    }
}
