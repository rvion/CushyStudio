import { CompileOptions, compile } from 'prql-js/dist/bundler'
import { defineWagon } from '../engine/WagonType'
import { run_lococharts, ui_lococharts } from '../prefabs/_prefab_lococharts'
import { run_selectData_knex, ui_selectData_knex } from '../prefabs/_prefab_source_knex'
import { run_selectData_metabase, ui_selectData_metabase } from '../prefabs/_prefab_source_metabase'
import { run_selectData_pivot, ui_selectData_pivot } from '../prefabs/_prefab_source_pivot'
import { prefab_prql } from '../prefabs/_prefab_source_prql'
import { Kwery } from 'src/utils/misc/Kwery'

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
                    'knex 🚧': ui_selectData_knex(ui),
                    prql: prefab_prql.ui(ui),
                },
            }),
        )

        const columns = () => {
            const dataM = dataMethods.shared.value
            if (dataM.metabase != null) return dataM.metabase.summarizes.flatMap((s) => (s.by == null ? [] : [s.by.column.as]))
            if (dataM.pivot != null) return dataM.pivot.cols.map((c) => c.column.as)
            if (dataM['knex 🚧'] != null)
                return dataM['knex 🚧'].summarizes.flatMap((s) => (s.by == null ? [] : [s.by.column.as]))
            if (dataM.prql != null) return []
            throw 'unreachable'
        }
        const values = () => {
            const dataM = dataMethods.shared.value
            if (dataM.metabase != null) return dataM.metabase.summarizes.map((s) => s.agg.column.as)
            if (dataM.pivot != null) return dataM.pivot.values.map((c) => c.column.as)
            if (dataM['knex 🚧'] != null) return dataM['knex 🚧'].summarizes.map((s) => s.agg.column.as)
            if (dataM.prql != null) return []
            throw 'unreachable'
        }

        const chart = ui_lococharts(ui, { dataKeys: { columns, values } })

        return { dataMethods, chart }
    },
    run: async (ui) => {
        const code = (() => {
            const dm = ui.dataMethods
            if (dm.metabase != null) return run_selectData_metabase(dm.metabase)
            if (dm.pivot != null) return run_selectData_pivot(dm.pivot)
            if (dm['knex 🚧'] != null) return run_selectData_knex(dm['knex 🚧'])
            if (dm.prql != null) return prefab_prql.run(dm.prql)
            throw 'At least one data method should be selected'
        })()

        const sql = (() => {
            if ('sql' in code) return code.sql
            const opts = new CompileOptions()
            opts.signature_comment = false
            opts.target = 'sql.postgres'
            try {
                return compile(code.prql, opts) ?? ''
            } catch (err: any) {
                const errData = JSON.parse(err.message as string)
                const full = JSON.stringify(errData, null, 2)
                try {
                    const displays = errData.inner.map((e: any) => e.display)
                    return [...displays, full].join('\n')
                } catch (err) {
                    return full
                }
            }
        })()

        const response = await Kwery.get(sql, { sql }, () =>
            fetch('http://localhost:8000/EXECUTE-SQL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sql }),
            }).then((res) => res.json()),
        )

        return {
            response,
            sql,
            prql: 'prql' in code ? code.prql : undefined,
            chartOpts: 'data' in response ? run_lococharts(ui.chart, response.data) : null,
        }
    },
})
