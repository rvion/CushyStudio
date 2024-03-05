import { defineWagon } from '../engine/WagonType'
import { run_selectData_pivot, ui_selectData_pivot } from '../prefabs/_prefab_source_pivot'

export const wagon1 = defineWagon({
    uid: 'A5mzglXkoY',
    title: 'Mon premier wagon',
    ui: (ui) => {
        return {
            title: ui.text({}),
            // name: ui.string(),
            style: ui.selectOneV2(['bar', 'line']),
            data: ui_selectData_pivot(ui),
        }
    },
    run: async (ui) => {
        const { data, sql } = await run_selectData_pivot(ui.data)

        return {
            data,
            sql,
            chartOpts: {
                title: { text: ui.title, left: 'left' },
                legend: {},
                tooltip: {},
                xAxis: { type: 'category' },
                yAxis: [{}, {}],
                series: [
                    {
                        type: ui.style.id as 'bar' | 'line',
                        name: 'Count',
                        data: data.map((row) => row.count),
                    },
                    {
                        type: 'line' as const, // ui.style.id as 'bar' | 'line',
                        name: 'Average',
                        data: data.map((row) => row.avg),
                        yAxisIndex: 1,
                    },
                ],
            },
        }
    },
})
