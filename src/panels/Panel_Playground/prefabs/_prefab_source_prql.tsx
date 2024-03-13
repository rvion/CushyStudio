import type { FormBuilder } from 'src/controls/FormBuilder'
import { TABLES, TABLE_NAMES } from './_prefab_columns'
import { locoLocations } from './_prefab_locoUtil1'

type SelectDataT = ReturnType<typeof ui_selectData_prql>['$Output']

export const ui_selectData_prql = (ui: FormBuilder) => {
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

    const tables = () => ui.selectOne({ choices: TABLE_NAMES.map((label) => ({ id: label })), label: 'from' })

    const from = ui.shared('prql-from', tables())
    const select = ui.selectOne({ choices: () => TABLES[from.shared.value.id].cols })
    // const filter = ui.fields({ expr: ui.text({ label: 'filter by' }) /* column: select, fn, condition */ }, { border: false })
    const filter = ui.text({ label: 'filter by', alignLabel: false })
    const group = ui.fields(
        {
            by: ui.text({ label: 'group by', alignLabel: false }).hidden(),
            agg: ui
                .fields(
                    { column: select, fn, as: ui.string().optional() },
                    { border: false, label: 'group by', header: () => <>toto</> },
                )
                .list(),
        },
        { header: (p) => <>{p.widget.fields.by.header()}</>, border: false, collapsed: false },
    )
    const pipeline = ui.shared(
        'prql-pipeline',
        ui.list({
            label: '🔧 Pipeline',
            element: (ix) => {
                return ui.choice({
                    appearance: 'tab',
                    items: {
                        select,
                        filter,
                        group,
                        // derive,
                        // aggregate,
                    },
                    // border: false,
                    tabPosition: 'center',
                    collapsed: false,
                    layout: 'H',
                })
            },
            border: false,
        }),
    )

    // const filter = ui.fields({ column: gmbColumnUI(), fn, condition }, { border: false })
    // const aggregate = ui.fields({ column: gmbColumnUI(), fn }, { border: false })
    // const derive = ui.fields({ column: gmbColumnUI(), fn }, { border: false })

    return ui.fields(
        {
            location: ui.selectOne({ choices: locoLocations }),

            from,
            pipeline,
        },
        { border: false },
    )
}

export const run_selectData_prql = (ui: SelectDataT): { prql: string } => {
    let prql = `
from ${ui.from.id}
filter location_id == '${ui.location.id}'
${ui.pipeline
    .map((step) => {
        if (step.filter) return `filter (${step.filter})`
        if (step.group) return `group {${step.group.by}} (\n\t${aggToPrql(step.group.agg)}\n)`
    })
    .join('\n')}
    `

    return { prql }

    function aggToPrql(aggs: NonNullable<SelectDataT['pipeline'][number]['group']>['agg']): string {
        const expr = aggs
            .map((agg) => {
                const fn = agg.fn
                const col = (fn: string) => (Boolean(agg.as) ? `${agg.as} = ${fn} ${agg.column.id}` : agg.column.id)
                if (fn == null) return col('')
                if (fn.avg != null) return col('average')
                if (fn.count != null) return col('count')
                if (fn.custom != null) return fn.custom.template
                return '🔴 TODO'
            })
            .join(',\n\t\t')
        return `aggregate {\n\t\t${expr}\n\t}`
    }
}
