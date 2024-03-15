import type { FormBuilder } from 'src/controls/FormBuilder'
import type { LocoChartsOpts } from '../charts/locoCharts'

export type LocoChartsBuilderProps = {
    dataKeys: {
        columns: () => string[]
        values: () => string[]
    }
}

type LocoChartsT = ReturnType<typeof ui_lococharts>['$Value']
export const ui_lococharts = (ui: FormBuilder, p: LocoChartsBuilderProps) => {
    const xAxis = ui.list({
        label: '📊 Abcisses',
        element: (ix) =>
            ui.fields(
                {
                    category: ui.selectOne({ choices: (['value', 'category', 'time', 'log'] as const).map((id) => ({ id })) }),
                    dataKey: ui.selectOne({
                        choices: () => p.dataKeys.columns().map((c) => ({ id: c })),
                    }),
                },
                { layout: 'H' },
            ),
    })
    const yAxis = ui.shared(
        'charts-y-axis',
        ui.list({
            label: '📊 Ordonnées',
            element: (ix) =>
                ui.fields(
                    {
                        category: ui.selectOne({
                            choices: (['value', 'category', 'time', 'log'] as const).map((id) => ({ id })),
                        }),
                    },
                    { layout: 'H' },
                ),
        }),
    )

    const series = ui.list({
        label: '📊 Series',
        element: (ix) =>
            ui.fields({
                type: ui.selectOne({ choices: [{ id: 'bar' }, { id: 'line' }, { id: 'scatter' }] }),
                name: ui.string({}),
                dataKey: ui.selectOne({
                    choices: () => p.dataKeys.values().map((c) => ({ id: c })),
                }),
                yAxisIndex: ui
                    .selectOne({ choices: () => yAxis.shared.value.map((_, ix) => ({ id: ix.toString() })) })
                    .optional(),
                color: ui.color().optional(),
            }),
    })

    return ui.fields(
        {
            title: ui.string({}),
            xAxis,
            yAxis,
            series,
        },
        { border: false },
    )
}

export const run_lococharts = (ui: LocoChartsT, data: any[]): LocoChartsOpts => {
    return {
        title: { text: ui.title, left: 'left' },
        legend: {},
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
        xAxis:
            ui.xAxis.length === 0
                ? {}
                : ui.xAxis.map((x) => ({
                      type: x.category.id,
                  })),
        yAxis:
            ui.yAxis.length === 0
                ? {}
                : ui.yAxis.map((y) => ({
                      type: y.category.id,
                  })),
        series: ui.series.map((s) => ({
            type: s.type.id,
            name: s.name,
            color: s.color ?? undefined,
            data: data.map((row) => [row[ui.xAxis[0].dataKey.id], row[s.dataKey.id]]),
            yAxisIndex: parseInt(s.yAxisIndex?.id ?? '0'),
        })),
        // toolbox: {
        //     feature: {
        //         dataZoom: {
        //             yAxisIndex: 'none',
        //         },
        //         restore: {},
        //         saveAsImage: {},
        //     },
        // },
        // dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    }
}
