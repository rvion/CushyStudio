import type { FormBuilder } from 'src/controls/FormBuilder'
import type { Spec } from 'src/controls/Spec'
import type { BaseSelectEntry } from 'src/controls/widgets/selectOne/WidgetSelectOne'
import type { Widget_shared } from 'src/controls/widgets/shared/WidgetShared'

import { bang } from 'src/utils/misc/bang'
import { TABLES, TABLE_NAMES } from './_prefab_columns'
import { locoLocations } from './_prefab_locoUtil1'

export const prefab_prql = prefab({
    ui: (ui) => {
        const from = prefab_from.ui(ui)
        const location = ui.selectOne({ choices: locoLocations })
        const pipeline = prefab_pipeline.ui(ui)

        return ui.fields({ from, location, pipeline }, { border: false })
    },
    run: (ui): { prql: string } => {
        const prql = [
            prefab_from.run(ui.from),
            `filter location_id == '${ui.location.id}'`,
            prefab_pipeline.run(ui.pipeline),
        ].join('\n')

        return { prql }
    },
})

const prefab_from = prefabShared({
    key: 'prql-from',
    ui: (ui: FormBuilder) =>
        ui.selectOne({
            choices: TABLE_NAMES.map((label) => ({ id: label })),
            label: 'from',
        }),
    run: (ui) => `from ${ui.id}`,
})

const prefab_pipeline = prefabShared({
    key: 'prql-pipeline',
    ui: (ui: FormBuilder) => {
        return ui
            .choice({
                appearance: 'tab',
                items: {
                    derive: prefab_derive.ui(ui),
                    filter: prefab_filter.ui(ui),
                    group: prefab_group.ui(ui),
                    join: prefab_join.ui(ui),
                    sort: prefab_sort.ui(ui),
                },
                tabPosition: 'center',
                collapsed: false,
                layout: 'H',
                label: false,
                border: false,
            })
            .list({
                label: '🔧 Pipeline',
                // summary: ({ stmt }) => {
                //     if (stmt.derive != null) return `derive ${stmt.derive.map((d) => d.expr.name).join(', ')}`
                //     if (stmt.filter != null) return `filter ${stmt.filter.data.col?.id ?? stmt.filter.data.symbol?.id}`
                //     if (stmt.group != null) return `group by ${stmt.group.by.data.col?.id ?? stmt.group.by.data.symbol?.id}`
                //     return '???'
                // },
            })
    },
    run: (ui): string => {
        return ui
            .map((stmt) => {
                if (stmt.derive != null) return prefab_derive.run(stmt.derive)
                if (stmt.filter != null) return prefab_filter.run(stmt.filter)
                if (stmt.group != null) return prefab_group.run(stmt.group)
                if (stmt.join != null) return prefab_join.run(stmt.join)
                if (stmt.sort != null) return prefab_sort.run(stmt.sort)
                return '🔴 TODO'
            })
            .join('\n')
    },
})

const prefab_derive = prefab({
    ui: (ui) => {
        return ui.fields({ expr: prefab_namedExpr.ui(ui) }, { collapsed: false, label: 'derive' })
    },
    run: (ui) => {
        return [
            //
            'derive {',
            `  ${prefab_namedExpr.run(ui.expr)},`,
            '}',
        ].join('\n')
    },
})

const prefab_filter = prefab({
    ui: (ui) => {
        return ui.fields({ expr: prefab_expr.ui(ui) }, { label: 'filter' })
    },
    run: (ui) => `filter (${prefab_expr.run(ui.expr)})`,
})

const prefab_group = prefab({
    ui: (ui) => {
        return ui.fields(
            {
                by: prefab_expr.ui(ui),
                aggregate: prefab_namedExpr.ui(ui).list({ min: 1 }),
            },
            {
                label: 'group',
                border: false,
                collapsed: false,
                header: (p) => <>{p.widget.fields.by.header()}</>,
            },
        )
    },
    run: (ui) => {
        return [
            //
            `group {${prefab_expr.run(ui.by)}} (`,
            '  aggregate {',
            ...ui.aggregate.map((c) => `    ${prefab_namedExpr.run(c)},`),
            '  }',
            ')',
        ].join('\n')
    },
})

const prefab_join = prefab({
    ui: (ui) => {
        const compact = { label: false, border: false, collapsed: false, layout: 'H' } as const
        const table = ui.selectOne({
            choices: TABLE_NAMES.map((label) => ({ id: label })),
            label: false,
        })

        return ui.fields(
            {
                tables: ui.fields(
                    {
                        side: ui.selectOne({
                            appearance: 'tab',
                            default: { id: 'left' },
                            choices: ['inner', 'left', 'right', 'full'].map((id) => ({ id })),
                            label: false,
                        }),
                        table,
                    },
                    compact,
                ),
                cols: ui.fields(
                    {
                        left: ui.selectOne({
                            choices: () => {
                                const fromTable = prefab_from.shared(ui).value.id
                                return TABLES[fromTable].cols
                            },
                            label: false,
                        }),
                        op: ui.selectOne({
                            choices: ['==', '!=', '<', '<=', '>', '>='].map((id) => ({ id })),
                            label: false,
                        }),
                        right: ui.selectOne<BaseSelectEntry>({
                            choices: (_, self) => {
                                const thisTableW = (self.parent!.parent! as any).fields.tables.fields
                                    .table as (typeof table)['$Widget']
                                const thisTable = thisTableW.value.id
                                return TABLES[thisTable].cols
                            },
                            label: false,
                        }),
                    },
                    compact,
                ),
            },
            {
                label: 'join',
                collapsed: false,
                border: false,
                layout: 'V',
            },
        )
    },
    run: (ui) => {
        const condition = `this.${ui.cols.left.id} ${ui.cols.op.id} that.${ui.cols.right.id}`
        return `join side:${ui.tables.side.id} ${ui.tables.table.id} (${condition})`
    },
})

const prefab_sort = prefab({
    ui: (ui) => {
        return ui
            .fields(
                {
                    by: prefab_expr.ui(ui),
                    order: ui.selectOne({
                        choices: [
                            { id: '+', label: 'asc' },
                            { id: '-', label: 'desc' },
                        ],
                        label: false,
                    }),
                },
                { label: 'sort', collapsed: false, border: false, layout: 'H' },
            )
            .list({ min: 1 })
    },
    run: (ui) => {
        const sorts = ui.map((sort) => `${sort.order.id}${prefab_expr.run(sort.by)}`)
        return `sort {${sorts.join(', ')}}`
    },
})

const prefab_namedExpr = prefab({
    ui: (ui) => {
        return ui.fields(
            {
                name: ui.text({ alignLabel: false, label: false }),
                expr: prefab_expr.ui(ui),
            },
            { label: false, collapsed: false, border: false, layout: 'H' },
        )
    },
    run: (ui) => {
        const { name, expr } = ui
        return `${name} = ${prefab_expr.run(expr)}`
    },
})

const prefab_expr = prefab({
    ui: (ui) => {
        return ui.fields(
            {
                data: ui.selectOne<BaseSelectEntry>({
                    choices: (_, self) => {
                        const previousSymbols: string[] = []
                        const pipelineWidget = prefab_pipeline.shared(ui)
                        const stmtIx = pipelineWidget.findItemIndexContaining(self) ?? 0
                        const fromTable = prefab_from.shared(ui).value.id

                        for (let i = 0; i < stmtIx; i++) {
                            const stmt = pipelineWidget.value.at(i)
                            if (stmt == null) continue
                            if (stmt.group != null) previousSymbols.push(...stmt.group.aggregate.map((c) => c.name))
                            if (stmt.derive != null) previousSymbols.push(stmt.derive.expr.name)
                        }
                        return [
                            ...previousSymbols.map((id) => ({ id, label: `${id} (derived)` })),
                            ...TABLES[fromTable].cols.map(({ id, label }) => ({ id: `${fromTable}.${id}`, label })),
                        ]
                    },
                    alignLabel: false,
                    label: '=',
                }),

                pipeline: prefab_op.ui(ui).list({
                    label: false,
                    collapsed: false,
                    border: false,
                    header: (p) => <>{p.widget.defaultHeader()}</>,
                    body: (p) => <div style={{ borderLeft: '1px solid white' }}>{p.widget.defaultBody()}</div>,
                }),
            },
            { label: false, border: false },
        )
    },
    run: (ui) => {
        const pipelinedExpr = [
            //
            ui.data.id,
            ...ui.pipeline.map(prefab_op.run),
        ]
        return `${pipelinedExpr.join(' | ')}`
    },
})

const prefab_op = prefab({
    ui: (ui) => {
        return ui.choiceV2(
            {
                agg_min: ui.group({ label: 'min' }),
                agg_max: ui.group({ label: 'max' }),
                agg_sum: ui.group({ label: 'sum' }),
                agg_average: ui.group({ label: 'average' }),
                agg_stddev: ui.group({ label: 'stddev' }),
                agg_all: ui.group({ label: 'all' }),
                agg_any: ui.group({ label: 'any' }),
                agg_concat_array: ui.group({ label: 'concat array' }),
                agg_count: ui.group({ label: 'count' }),

                math_abs: ui.group({ label: 'abs' }),
                math_floor: ui.group({ label: 'floor' }),
                math_ceil: ui.group({ label: 'ceil' }),
                // math_pi: ui.group(),
                math_exp: ui.group({ label: 'exp' }),
                math_ln: ui.group({ label: 'ln' }),
                math_log10: ui.group({ label: 'log10' }),
                math_log: ui.fields({ base: ui.number() }, { border: false, collapsed: false, alignLabel: false, label: 'log' }),
                math_sqrt: ui.group({ label: 'sqrt' }),
                math_degrees: ui.group({ label: 'degrees' }),
                math_radians: ui.group({ label: 'radians' }),
                math_cos: ui.group({ label: 'cos' }),
                math_acos: ui.group({ label: 'acos' }),
                math_sin: ui.group({ label: 'sin' }),
                math_asin: ui.group({ label: 'asin' }),
                math_tan: ui.group({ label: 'tan' }),
                math_atan: ui.group({ label: 'atan' }),
                math_pow: ui.fields(
                    { exponent: ui.number() },
                    { border: false, collapsed: false, alignLabel: false, label: 'pow' },
                ),
                math_round: ui.fields(
                    { precision: ui.int() },
                    { border: false, collapsed: false, alignLabel: false, label: 'round' },
                ),

                date_to_text: ui.fields(
                    { format: ui.string() },
                    { border: false, collapsed: false, alignLabel: false, layout: 'H' },
                ),

                range_in: ui.fields(
                    {
                        from: ui.text({ label: 'from' }),
                        to: ui.text({ label: 'to' }),
                    },
                    { label: 'in range', layout: 'H', collapsed: false, border: false },
                ),

                custom: ui.fields({ template: ui.string() }, { border: false, collapsed: false, alignLabel: false }),
            },
            { label: false, border: false, layout: 'H' },
        )
    },
    run: (ui) => {
        if (ui.agg_min != null) return 'min'
        if (ui.agg_max != null) return 'max'
        if (ui.agg_sum != null) return 'sum'
        if (ui.agg_average != null) return 'average'
        if (ui.agg_stddev != null) return 'stddev'
        if (ui.agg_all != null) return 'all'
        if (ui.agg_any != null) return 'any'
        if (ui.agg_concat_array != null) return 'concat_array'
        if (ui.agg_count != null) return 'count'

        if (ui.math_abs != null) return 'math.abs'
        if (ui.math_floor != null) return 'math.floor'
        if (ui.math_ceil != null) return 'math.ceil'
        // if (ui.math_pi != null) return 'math.pi'
        if (ui.math_exp != null) return 'math.exp'
        if (ui.math_ln != null) return 'math.ln'
        if (ui.math_log10 != null) return 'math.log10'
        if (ui.math_log != null) return `math.log ${ui.math_log.base}`
        if (ui.math_sqrt != null) return 'math.sqrt'
        if (ui.math_degrees != null) return 'math.degrees'
        if (ui.math_radians != null) return 'math.radians'
        if (ui.math_cos != null) return 'math.cos'
        if (ui.math_acos != null) return 'math.acos'
        if (ui.math_sin != null) return 'math.sin'
        if (ui.math_asin != null) return 'math.asin'
        if (ui.math_tan != null) return 'math.tan'
        if (ui.math_atan != null) return 'math.atan'
        if (ui.math_pow != null) return `math.pow ${ui.math_pow.exponent}`
        if (ui.math_round != null) return `math.round ${ui.math_round.precision}`

        if (ui.date_to_text != null) return `date.to_text '${ui.date_to_text.format}'`

        if (ui.range_in != null) return `in ${ui.range_in.from}..${ui.range_in.to}`

        if (ui.custom != null) return ui.custom.template

        return '🔴 TODO'
    },
})

function prefab<Form extends Spec, Args extends any[], R>(p: //
{
    ui: (_: FormBuilder, ...args: Args) => Form
    run: (_: Form['$Value']) => R
}): typeof p {
    return p
}

function prefabShared<Form extends Spec, Args extends any[], R>(p: //
{
    key: string
    ui: (_: FormBuilder, ...args: Args) => Form
    run: (_: Form['$Value']) => R
}): {
    ui: (_: FormBuilder, ...args: Args) => Widget_shared<Form>
    run: typeof p.run
    shared: (_: FormBuilder) => Form['$Widget']
} {
    return {
        ui: (ui, ...args) => p.ui(ui, ...args).shared(p.key),
        run: p.run,
        shared: (_: FormBuilder) => {
            let widget: Form['$Widget'] = bang(_.form.knownShared.get(p.key), `Shared widget '${p.key}' not accessible`)
            return widget
        },
    }
}
