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
                    // aggregate,
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
                agg: prefab_namedExpr.ui(ui).list(),
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
            ...ui.agg.map((c) => `    ${prefab_namedExpr.run(c)},`),
            '  }',
            ')',
        ].join('\n')
    },
})

const prefab_join = prefab({
    ui: (ui) => {
        const table = ui.selectOne({
            choices: TABLE_NAMES.map((label) => ({ id: label })),
            label: 'table',
        })

        return ui.fields(
            {
                side: ui.selectOne({
                    appearance: 'tab',
                    default: { id: 'left' },
                    choices: ['inner', 'left', 'right', 'full'].map((id) => ({ id })),
                    label: false,
                }),
                table,
                left: ui.selectOne<BaseSelectEntry>({
                    choices: (_, self) => {
                        const thisTable = (self.parent! as any).fields.table as (typeof table)['$Widget']
                        return TABLES[thisTable.value.id].cols
                    },
                }),
            },
            { label: 'join', collapsed: false, border: false, layout: 'H' },
        )
    },
    run: (ui) => {
        return `join side:${ui.side} ${ui.table} ()`
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

                        for (let i = 0; i < stmtIx; i++) {
                            const stmt = pipelineWidget.value.at(i)
                            if (stmt == null) continue
                            if (stmt.group != null) previousSymbols.push(...stmt.group.agg.map((c) => c.name))
                            if (stmt.derive != null) previousSymbols.push(stmt.derive.expr.name)
                        }
                        return [
                            ...previousSymbols.map((id) => ({ id, label: `${id} (derived)` })),
                            ...TABLES[prefab_from.shared(ui).value.id].cols,
                        ]
                    },
                    alignLabel: false,
                    label: '=',
                }),

                pipeline: prefab_op.ui(ui).list({
                    label: '|',
                    collapsed: false,
                    border: false,
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
                'agg.min': ui.group({ label: 'min' }),
                'agg.max': ui.group({ label: 'max' }),
                'agg.sum': ui.group({ label: 'sum' }),
                'agg.average': ui.group({ label: 'average' }),
                'agg.stddev': ui.group({ label: 'stddev' }),
                'agg.all': ui.group({ label: 'all' }),
                'agg.any': ui.group({ label: 'any' }),
                'agg.concat_array': ui.group({ label: 'concat array' }),
                'agg.count': ui.group({ label: 'count' }),

                'math.abs': ui.group({ label: 'abs' }),
                'math.floor': ui.group({ label: 'floor' }),
                'math.ceil': ui.group({ label: 'ceil' }),
                // 'math.pi': ui.group(),
                'math.exp': ui.group({ label: 'exp' }),
                'math.ln': ui.group({ label: 'ln' }),
                'math.log10': ui.group({ label: 'log10' }),
                'math.log': ui.fields(
                    { base: ui.number() },
                    { border: false, collapsed: false, alignLabel: false, label: 'log' },
                ),
                'math.sqrt': ui.group({ label: 'sqrt' }),
                'math.degrees': ui.group({ label: 'degrees' }),
                'math.radians': ui.group({ label: 'radians' }),
                'math.cos': ui.group({ label: 'cos' }),
                'math.acos': ui.group({ label: 'acos' }),
                'math.sin': ui.group({ label: 'sin' }),
                'math.asin': ui.group({ label: 'asin' }),
                'math.tan': ui.group({ label: 'tan' }),
                'math.atan': ui.group({ label: 'atan' }),
                'math.pow': ui.fields(
                    { exponent: ui.number() },
                    { border: false, collapsed: false, alignLabel: false, label: 'pow' },
                ),
                'math.round': ui.fields(
                    { precision: ui.int() },
                    { border: false, collapsed: false, alignLabel: false, label: 'round' },
                ),

                'date.to_text': ui.fields(
                    { format: ui.string() },
                    { border: false, collapsed: false, alignLabel: false, layout: 'H' },
                ),

                custom: ui.fields({ template: ui.string() }, { border: false, collapsed: false, alignLabel: false }),
            },
            { label: false, border: false, layout: 'H' },
        )
    },
    run: (ui) => {
        if (ui['agg.min'] != null) return 'min'
        if (ui['agg.max'] != null) return 'max'
        if (ui['agg.sum'] != null) return 'sum'
        if (ui['agg.average'] != null) return 'average'
        if (ui['agg.stddev'] != null) return 'stddev'
        if (ui['agg.all'] != null) return 'all'
        if (ui['agg.any'] != null) return 'any'
        if (ui['agg.concat_array'] != null) return 'concat_array'
        if (ui['agg.count'] != null) return 'count'

        if (ui['math.abs'] != null) return 'math.abs'
        if (ui['math.floor'] != null) return 'math.floor'
        if (ui['math.ceil'] != null) return 'math.ceil'
        // if (ui['math.pi'] != null) return 'math.pi'
        if (ui['math.exp'] != null) return 'math.exp'
        if (ui['math.ln'] != null) return 'math.ln'
        if (ui['math.log10'] != null) return 'math.log10'
        if (ui['math.log'] != null) return `math.log ${ui['math.log'].base}`
        if (ui['math.sqrt'] != null) return 'math.sqrt'
        if (ui['math.degrees'] != null) return 'math.degrees'
        if (ui['math.radians'] != null) return 'math.radians'
        if (ui['math.cos'] != null) return 'math.cos'
        if (ui['math.acos'] != null) return 'math.acos'
        if (ui['math.sin'] != null) return 'math.sin'
        if (ui['math.asin'] != null) return 'math.asin'
        if (ui['math.tan'] != null) return 'math.tan'
        if (ui['math.atan'] != null) return 'math.atan'
        if (ui['math.pow'] != null) return `math.pow ${ui['math.pow'].exponent}`
        if (ui['math.round'] != null) return `math.round ${ui['math.round'].precision}`

        if (ui['date.to_text'] != null) return `date.to_text '${ui['date.to_text'].format}'`

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
