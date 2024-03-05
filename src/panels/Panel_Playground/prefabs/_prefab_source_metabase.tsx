import type { FormBuilder } from 'src/controls/FormBuilder'
import { Kwery } from 'src/utils/misc/Kwery'
import { gmbCols } from './_prefab_columns'
import { readableStringify } from 'src/utils/formatters/stringifyReadable'

/*
//-----------------------
Objective:
    - List and quickly check what model-driven abstraction would work for data selection
    - Test that agains real use-case.
    - 🔶 NOT build the next sql-data-visualisation platform, but just see how we can quickly implement
         or switch between different abstractions.

## alt2. metabase

table
(joins?)
filters
value / groupBy



.select([
    knex.raw('extract(month from gmb_created_at) as month'),
    knex.raw('extract(year from gmb_created_at) as year'),
 ])
 .whereBetween('gmb_created_at', [startingDate, new Date()])
 .avg('rating as overall_rating')     // 🔶 TCD VALUES
 .count('* as reviews_total_count')
 .groupBy(['year', 'month'])          // 🔶 TCD COLS
 .orderBy(['year', 'month'])
*/
export const ui_selectData_metabase = (ui: FormBuilder) => {
    return ui.fields({
        source: ui.selectOne({ choices: [{ id: 'location' }, { id: 'gmb' }] }),
        // join: ui.selectOne({ choices: [{ id: 'location' }, { id: 'gmb' }] }).list(),
        rows: ui.group({ items: { foo: ui.int() }, collapsed: false, border: false }).list(),
        cols: ui.group({ items: { foo: ui.int() }, collapsed: false, border: false }).list(),
        values: ui.group({ items: { foo: ui.int() }, collapsed: false, border: false }).list(),
        filters: ui.group({ items: { foo: ui.int() }, collapsed: false, border: false }).list(),

        // -------------------
        display: ui.enum.Enum_ImageBlend_blend_mode(),
        groupBy: ui.selectMany({ choices: gmbCols /* appearance: 'tab' */ }),
        orderBy: ui.fields({
            field: ui.selectMany({ choices: gmbCols /* appearance: 'tab' */ }),
            order: ui.selectOne({ choices: [{ id: 'asc' }, { id: 'desc' }] }),
            nulls: ui.selectOne({ choices: [{ id: 'first' }, { id: 'last' }] }),
        }),
        // whereBetween: ui.fields({ from: ui.date(), to: ui.date() }).optional(),
        whereBetween: ui
            .choice({
                appearance: 'tab',
                items: {
                    customRange: ui.fields({ from: ui.string(), to: ui.string() }),
                    lastYear: ui.group({}),
                },
            })
            .optional(),
        avg: ui.selectOne({ choices: gmbCols }).optional(),
        // whereBetween: ui.time().optional(),
    })
}

export const run_selectData_metabase = (ui: ReturnType<typeof ui_selectData_metabase>['$Output']): Kwery<any> => {
    const val = Kwery.get(JSON.stringify(ui), {}, () => {
        return fetch('http://localhost:8000/EXECUTE-SQL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: readableStringify({ sql: 'SELECT * FROM location' }, 3),
        }).then((res) => res.json())
    })
    return val
}
