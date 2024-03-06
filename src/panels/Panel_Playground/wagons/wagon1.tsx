import { defineWagon } from '../engine/WagonType'
import { run_selectData_pivot, ui_selectData_pivot } from '../prefabs/_prefab_source_pivot'

export const wagon1 = defineWagon({
    uid: 'A5mzglXkoY',
    title: 'Mon premier wagon',
    ui: (ui) => {
        return {
            title: ui.text({}),
            data: ui_selectData_pivot(ui),
        }
    },
    run: async (ui) => {
        const { res, series, sql, xAxis } = await run_selectData_pivot(ui.data)

        return {
            res,
            sql,
            chartOpts:
                'err' in res
                    ? null
                    : {
                          title: { text: ui.title, left: 'left' },
                          legend: {},
                          tooltip: {},
                          xAxis: xAxis.map((x) => ({
                              type: x.category.id,
                              data: res.data.map((row) => row[x.dataKey.id]),
                          })),
                          yAxis: [{}, {}],
                          series: series.map((s) => ({
                              type: s.type.id,
                              name: s.name,
                              data: res.data.map((row) => row[s.dataKey.id]),
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
                      },
        }
    },
})
