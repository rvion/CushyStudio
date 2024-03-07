import { defineWagon } from '../engine/WagonType'
import { run_lococharts, ui_lococharts } from '../prefabs/_prefab_lococharts'
import { run_selectData_pivot, ui_selectData_pivot } from '../prefabs/_prefab_source_pivot'

export const wagon1 = defineWagon({
    uid: 'A5mzglXkoY',
    title: 'Mon premier wagon',
    ui: (ui) => {
        const data = ui.shared('wagon1-data', ui_selectData_pivot(ui))
        const dataKeys = {
            columns: data.shared.value.cols.map((c) => c.column.as),
            values: data.shared.value.values.map((c) => c.column.as),
        }

        return {
            data,
            chart: ui_lococharts(ui, { dataKeys }),
        }
    },
    run: async (ui) => {
        const { res, sql } = await run_selectData_pivot(ui.data)
        if ('err' in res) return { chartOpts: null, sql, res }

        const chartOpts = run_lococharts(ui.chart, res.data)
        return { res, sql, chartOpts }
    },
})
