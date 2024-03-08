import { defineWagon } from '../engine/WagonType'
import { run_lococharts, ui_lococharts } from '../prefabs/_prefab_lococharts'
import { run_selectData_metabase, ui_selectData_metabase } from '../prefabs/_prefab_source_metabase'
import { run_selectData_pivot, ui_selectData_pivot } from '../prefabs/_prefab_source_pivot'

export const wagon1 = defineWagon({
    uid: 'A5mzglXkoY',
    title: 'Mon premier wagon',
    ui: (ui) => {
        const dataMethods = ui.shared(
            'wagon1-data',
            ui.choice({
                label: 'Data',
                appearance: 'tab',
                border: false,
                items: {
                    pivot: ui_selectData_pivot(ui),
                    metabase: ui_selectData_metabase(ui),
                },
            }),
        )

        const columns = () => {
            const dataM = dataMethods.shared.value
            if (dataM.metabase != null) return dataM.metabase.summarizes.flatMap((s) => (s.by == null ? [] : [s.by.column.as]))
            if (dataM.pivot != null) return dataM.pivot.cols.map((c) => c.column.as)
            throw 'unreachable'
        }
        const values = () => {
            const dataM = dataMethods.shared.value
            if (dataM.metabase != null) return dataM.metabase.summarizes.map((s) => s.agg.column.as)
            if (dataM.pivot != null) return dataM.pivot.values.map((c) => c.column.as)
            throw 'unreachable'
        }

        const chart = ui_lococharts(ui, { dataKeys: { columns, values } })

        return { dataMethods, chart }
    },
    run: async (ui) => {
        const { res, sql } = await (() => {
            if (ui.dataMethods.metabase != null) return run_selectData_metabase(ui.dataMethods.metabase)
            if (ui.dataMethods.pivot != null) return run_selectData_pivot(ui.dataMethods.pivot)
            throw 'At least one data method should be selected'
        })()

        return {
            res,
            sql,
            chartOpts: 'data' in res ? run_lococharts(ui.chart, res.data) : null,
        }
    },
})
