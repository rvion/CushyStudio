import type { FormBuilder } from 'src/controls/FormBuilder'
import { TABLES } from './_prefab_columns'
import { locoLocations } from './_prefab_locoUtil1'

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

*/

type SelectDataT = ReturnType<typeof ui_selectData_metabase>['$Value']
export const ui_selectData_metabase = (ui: FormBuilder) => {
    const tables = () => ui.selectOne({ choices: [{ id: 'location' }, { id: 'gmb_review' }], label: false })

    const gmbColumnUI = () => {
        const colName = ui.selectOne({ choices: TABLES.gmb_review.cols, border: false, label: 'data' })
        const as = ui.string({ label: 'as' })
        return ui.fields({ colName, as }, { layout: 'H', label: false, border: false })
    }
    const order = ui.selectOne({ border: false, choices: [{ id: 'asc' }, { id: 'desc' }] }) // .optional()
    const fn = ui
        .choice({
            appearance: 'tab',
            items: {
                avg: ui.group({ border: false }),
                count: ui.group({ border: false }),
                to_char: ui.fields({ format: ui.string() }, { border: false, collapsed: false }),
                custom: ui.fields(
                    { template: ui.string() },
                    { border: false, collapsed: false, tooltip: 'use ? to embed the column value' },
                ),
                YYYYMM: ui.group({ label: 'YYYY-MM', border: false }),
            },
            label: '𝐟(𝐱)',
            border: false,
            collapsed: false,
        })
        .optional()
    const condition = ui.choice({
        appearance: 'tab',
        items: {
            eq: ui.fields({ value: ui.string() }, { label: '=', border: false, collapsed: false, layout: 'H' }),
            gt: ui.fields({ value: ui.string() }, { label: '>', border: false, collapsed: false, layout: 'H' }),
            gte: ui.fields({ value: ui.string() }, { label: '>=', border: false, collapsed: false, layout: 'H' }),
            lt: ui.fields({ value: ui.string() }, { label: '<', border: false, collapsed: false, layout: 'H' }),
            lte: ui.fields({ value: ui.string() }, { label: '<=', border: false, collapsed: false, layout: 'H' }),
            between: ui.fields(
                { from: ui.string(), to: ui.string() },
                { label: '>_<', border: false, collapsed: false, layout: 'H' },
            ),
        },
        border: false,
        collapsed: false,
        label: false,
        layout: 'H', // ?????? not working
    })

    const joinKind = ui.selectOne({
        choices: (['inner join', 'left outer join', 'right outer join', 'full outer join'] as const).map((id) => ({ id })),
        label: false,
    })
    const joinOnOp = ui.selectOne({
        choices: ['=', '>', '<', '>=', '<=', '!='].map((label) => ({ id: label, label })),
        label: false,
        appearance: 'tab',
    })
    const joins = ui.list({
        label: '🔗 Joins',
        element: (ix) =>
            ui.fields(
                {
                    x: ui.fields(
                        //
                        { left: tables(), kind: joinKind, right: tables() },
                        { layout: 'H', label: 'clause', collapsed: false, border: false },
                    ),
                    on: ui.fields(
                        //
                        { left: ui.string({ label: false }), op: joinOnOp, right: ui.string({ label: false }) },
                        { layout: 'H', label: 'on', collapsed: false, border: false },
                    ),
                },
                { border: false },
            ),
    })

    const filters = ui.list({
        label: '🔍 Filters',
        element: (ix) => ui.fields({ column: gmbColumnUI(), fn: fn, condition }, { border: false }),
    })

    const summarizes = ui.list({
        label: '∑ Summarizes',
        element: (ix) =>
            ui.fields(
                {
                    agg: ui.fields({ column: gmbColumnUI(), fn }, { label: false, collapsed: false, border: false }),
                    by: ui
                        .fields({ column: gmbColumnUI(), fn }, { label: 'Group by', collapsed: false, border: false })
                        .optional(),
                },
                { border: false },
            ),
    })

    return ui.fields(
        {
            location: ui.selectOne({ choices: locoLocations }),
            table: ui.selectOne({ choices: [{ id: 'gmb_review' }] }),

            joins,
            filters,
            summarizes,
        },
        { border: false },
    )
}

export const run_selectData_metabase = (ui: SelectDataT): { sql: string } => {
    const selectExpr: string[] = []
    const groups: string[] = []
    const where: string[] = []
    const orders: string[] = []
    let fromItem: string = ui.table.id

    for (const join of ui.joins) {
        const left = join.x.left.id
        const right = join.x.right.id
        const kind = join.x.kind.id
        const on = `${left}.${join.on.left} ${join.on.op.id} ${right}.${join.on.right}`
        fromItem += ` ${kind} ${right} ON ${on}`
    }
    for (const filter of ui.filters) {
        where.push(filterExpr(filter))
    }
    for (const summarize of ui.summarizes) {
        const { agg, by } = summarize
        const aggExpr = sqlExpr(agg.column, agg.fn)
        selectExpr.push(aggExpr.full)
        if (by != null) {
            const byExpr = sqlExpr(by.column, by.fn)
            selectExpr.push(byExpr.full)
            groups.push(byExpr.alias)
            orders.push(`${byExpr.alias} asc`)
        }
    }
    where.push(`location_id = '${ui.location.id}'`)

    let sql = `--sql
        select ${selectExpr.join(', ')}
        from ${fromItem}
        where ${where.join(' AND ')}
        group by ${groups.join(', ')}
        order by ${orders.join(', ')}
    `

    return { sql }

    function sqlExpr(
        //
        col: SelectDataT['filters'][number]['column'],
        fn: SelectDataT['filters'][number]['fn'],
    ): { expr: string; alias: string; full: string } {
        const path = `${ui.table.id}.${col.colName.id}`
        const expr = (() => {
            if (fn == null) return path
            if (fn.to_char != null) return `to_char(${path}, '${fn.to_char.format}')`
            if (fn.avg != null) return `avg(${path})`
            if (fn.count != null) return `count(${path})`
            if (fn.custom != null) return fn.custom.template.replace('?', path)
            if (fn.YYYYMM) return `to_char(${path}, 'YYYY-MM')`
            return '🔴 TODO'
        })()
        return { expr, alias: col.as || expr, full: col.as ? `${expr} as ${col.as}` : expr }
    }

    function filterExpr(filter: SelectDataT['filters'][number]): string {
        const { alias } = sqlExpr(filter.column, filter.fn)
        if (filter.condition.between != null)
            return `${alias} between ${filter.condition.between.from} and ${filter.condition.between.to}`
        if (filter.condition.eq != null) return `${alias} = ${filter.condition.eq.value}`
        if (filter.condition.gt != null) return `${alias} > ${filter.condition.gt.value}`
        if (filter.condition.lt != null) return `${alias} < ${filter.condition.lt.value}`
        return '🔴 TODO'
    }
}
