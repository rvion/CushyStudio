import type { FormBuilder } from 'src/controls/FormBuilder'
import { Kwery } from 'src/utils/misc/Kwery'
import { gmbCols } from './_prefab_columns'
import { locoLocations } from './_prefab_locoUtil1'

/*
//-----------------------
## alt1.  TCD(tableau croisé dynamique) / pivot table
cols
    - { col: 'date' (YYYY-MM)} (🔶 some FORMAT_DATE(val from dropdown) function prob required)
rows
    - { col: 'location'}
values:
    - { col: 'rating', summaryMethod: 'avg'}
    - { col: '*', summaryMethod: 'count'}
filter:
    - { col: 'gmb_created_at', op: 'between', from: 'M-12', to: NOW() }

out: {yyyy, MM, COUNT, avgRating, location }[]

*/

// .select([
//     knex.raw('to_char(gmb_created_at, 'YYYY-MM') as YOLO'),
//  ])
//  .whereBetween('gmb_created_at', [startingDate, new Date()])
//  .avg('rating as overall_rating')     // 🔶 TCD VALUES
//  .count('* as reviews_total_count')
//  .groupBy(to_char(gmb_created_at, 'YYYY-MM'))          // 🔶 TCD COLS
//  .groupBy(YOLO)          // 🔶 TCD COLS
//  .orderBy(to_char(gmb_created_at, 'YYYY-MM'))
//  .orderBy(YOLO)
// */

export const ui_selectData_pivot = (ui: FormBuilder) => {
    const gmbColumnUI = ui.selectOne({ choices: gmbCols, border: false })
    const fn1 = ui
        .selectOne({ border: false, choices: [{ id: 'avg' }, { id: 'count' }, { id: 'to_char' }, { id: 'YYYY-MM' }] })
        .optional()
    const order = ui.selectOne({ border: false, choices: [{ id: 'asc' }, { id: 'desc' }] }) // .optional()
    const fn2 = ui
        .choice({
            appearance: 'tab',
            items: {
                avg: ui.group(),
                count: ui.group(),
                to_char: ui.fields({ format: ui.string() }),
                custom: ui.fields({ template: ui.string() }, { tooltip: 'use ? to embed the column value' }),
                YYYYMM: ui.group(),
            },
        })
        .optional()
    const condition = ui
        .choice({
            // appearance: 'tab',
            items: {
                greaterThan: ui.fields({ value: ui.string() }),
                lowerThan: ui.string(),
                between: ui.fields({ from: ui.string(), to: ui.string() }),
                equal: ui.string(),
            },
        })
        .optional()

    //         WHERE
    //   (
    //     "public"."location"."created_at" >= DATE_TRUNC('month', (NOW() + INTERVAL '-12 month'))
    //   )

    //    AND (
    //     "public"."location"."created_at" < DATE_TRUNC('month', NOW())
    //   )
    return ui.fields(
        {
            location: ui.selectOne({ choices: locoLocations }),
            // join: ui.selectOne({ choices: [{ id: 'location' }, { id: 'gmb' }] }).list(),
            table: ui.selectOne({ choices: [{ id: 'location' }, { id: 'gmb_review' }] }),
            rows: ui
                .fields(
                    { column: gmbColumnUI, fn: fn2, order },
                    { layout: 'V', border: false, summary: (items) => items.column.id },
                )
                .list(),

            cols: ui
                .fields(
                    { column: gmbColumnUI, fn: fn2, order },
                    {
                        layout: 'V',
                        border: false,
                        summary: (items) => items.column.id,
                    },
                )
                .list(),
            values: ui
                .fields({ column: gmbColumnUI, fn: fn2 }, { layout: 'V', border: false, summary: (items) => items.column.id })
                .list(),
            filters: ui
                .fields(
                    { column: gmbColumnUI, fn: fn2, condition },
                    {
                        /* layout: 'H', */
                        summary: (items) => items.column.id,
                    },
                )
                .list(),

            // -------------------
            // groupBy: ui.selectMany({ choices: gmbCols /* appearance: 'tab' */ }),
            // orderBy: ui.fields(
            //     {
            //         field: ui.selectMany({ choices: gmbCols /* appearance: 'tab' */ }),
            //         order: ui.selectOne({ choices: [{ id: 'asc' }, { id: 'desc' }] }),
            //         nulls: ui.selectOne({ choices: [{ id: 'first' }, { id: 'last' }] }),
            //     },
            //     { layout: 'H' },
            // ),
            // whereBetween: ui.fields({ from: ui.date(), to: ui.date() }).optional(),
            // whereBetween: ui
            //     .choice({
            //         appearance: 'tab',
            //         items: {
            //             customRange: ui.fields({ from: ui.string(), to: ui.string() }),
            //             lastYear: ui.group({}),
            //         },
            //     })
            //     .optional(),
            // avg: ui.selectOne({ choices: gmbCols }).optional(),
            // whereBetween: ui.time().optional(),
        },
        { border: false },
    )
}

type SelectDataT = ReturnType<typeof ui_selectData_pivot>['$Output']
export type Simplify<T> = { [KeyType in keyof T]: Simplify<T[KeyType]> & {} }

export const run_selectData_pivot = async (ui: SelectDataT): Promise<{ data: any[]; sql: string }> => {
    const selectExpr: string[] = []
    const groups: string[] = []
    const where: string[] = []
    const orders: string[] = []

    for (const row of ui.rows) {
        const expr = sqlExpr(row.column, row.fn)
        selectExpr.push(expr)
        groups.push(expr)
        orders.push(`${expr} ${row.order.id}`)
    }
    for (const col of ui.cols) {
        const expr = sqlExpr(col.column, col.fn)
        selectExpr.push(expr)
        groups.push(expr)
        orders.push(`${expr} ${col.order.id}`)
    }
    for (const val of ui.values) {
        selectExpr.push(sqlExpr(val.column, val.fn))
    }
    for (const filter of ui.filters) {
        where.push(filterExpr(filter))
    }
    where.push(`location_id = '${ui.location.id}'`)

    let sql = `--sql
        select ${selectExpr.join(', ')}
        from ${ui.table.id}
        where ${where.join(' AND ')}
        group by ${groups.join(', ')}
        order by ${orders.join(', ')}
    `

    // const json = knex .select([
    //         knex.raw('to_char(gmb_created_at, 'YYYY-MM') as YOLO'),
    //     ])
    //     .whereBetween('gmb_created_at', [startingDate, new Date()])
    //     .avg('rating as overall_rating')     // 🔶 TCD VALUES
    //     .count('* as reviews_total_count')
    //     .groupBy(to_char(gmb_created_at, 'YYYY-MM'))          // 🔶 TCD COLS
    //     .groupBy(YOLO)          // 🔶 TCD COLS
    //     .orderBy(to_char(gmb_created_at, 'YYYY-MM'))
    //     .orderBy(YOLO)

    const data = await Kwery.get(JSON.stringify(ui), { sql }, () =>
        fetch('http://localhost:8000/EXECUTE-SQL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sql }),
        }).then((res) => res.json()),
    )
    return { data, sql }

    function sqlExpr(
        //
        col: SelectDataT['cols' | 'rows'][number]['column'],
        fn: SelectDataT['cols' | 'rows'][number]['fn'],
    ): string {
        const expr = `${ui.table.id}.${col.id}`
        if (fn == null) return expr
        if (fn.to_char != null) return `to_char(${expr}, '${fn.to_char.format}')`
        if (fn.avg != null) return `avg(${expr})`
        if (fn.count != null) return `count(${expr})`
        if (fn.custom != null) return fn.custom.template.replace('?', expr)
        if (fn.YYYYMM) return 'todo'
        return '🔴 TODO'
    }

    function filterExpr(
        //
        filter: Simplify<SelectDataT['filters'][number]>,
    ): string {
        const expr = sqlExpr(filter.column, filter.fn)
        if (filter.condition == null) return expr
        if (filter.condition.between != null)
            return `${expr} between ${filter.condition.between.from} and ${filter.condition.between.to}`
        if (filter.condition.equal != null) return `${expr} = ${filter.condition.equal}`
        if (filter.condition.greaterThan != null) return `${expr} > ${filter.condition.greaterThan.value}`
        if (filter.condition.lowerThan != null) return `${expr} < ${filter.condition.lowerThan}`
        return '🔴 TODO'
    }
}
