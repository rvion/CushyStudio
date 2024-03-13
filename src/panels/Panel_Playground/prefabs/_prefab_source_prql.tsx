import type { FormBuilder } from 'src/controls/FormBuilder'
import type { Spec } from 'src/controls/Spec'
import type { Widget_shared } from 'src/controls/widgets/shared/WidgetShared'

import { TABLES, TABLE_NAMES } from './_prefab_columns'
import { locoLocations } from './_prefab_locoUtil1'

export const prefab_prql = prefab({
    ui: (ui) => {
        const from = prefab_from.ui(ui)
        const location = ui.selectOne({ choices: locoLocations })
        const pipeline = prefab_pipelineStmt.ui(ui).list({ label: '🔧 Pipeline', border: false })

        return ui.fields({ from, location, pipeline }, { border: false })
    },
    run: (ui): { prql: string } => {
        const prql = [
            prefab_from.run(ui.from),
            `filter location_id == '${ui.location.id}'`,
            ui.pipeline.map(prefab_pipelineStmt.run).join('\n'),
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

const prefab_pipelineStmt = prefab({
    ui: (ui) => {
        const filter = ui.text({ label: 'filter', alignLabel: false })

        return ui.choice({
            appearance: 'tab',
            items: {
                derive: prefab_derive.ui(ui),
                filter,
                group: prefab_group.ui(ui),
                // derive,
                // aggregate,
            },
            // border: false,
            tabPosition: 'center',
            collapsed: false,
            layout: 'H',
        })
    },
    run: (ui): string => {
        if (ui.derive != null) return prefab_derive.run(ui.derive)
        if (ui.filter != null) return `filter (${ui.filter})`
        if (ui.group != null) return prefab_group.run(ui.group)
        return '🔴 TODO'
    },
})

const prefab_group = prefab({
    ui: (ui) => {
        return ui.fields(
            {
                by: ui.text({ label: 'group by', alignLabel: false }).hidden(),
                agg: prefab_namedExpression.ui(ui).list(),
            },
            { header: (p) => <>{p.widget.fields.by.header()}</>, border: false, collapsed: false },
        )
    },
    run: (ui) => {
        return [
            `group {${ui.by}} (`,
            '  aggregate {',
            ...ui.agg.map((c) => '    ' + prefab_namedExpression.run(c)),
            '  }',
            ')',
        ].join('\n')
    },
})

const prefab_derive = prefab({
    ui: (ui) => {
        return ui
            .choice({
                label: 'derive',
                appearance: 'tab',
                tabPosition: 'start',
                items: {
                    // column,
                    named_expression: prefab_namedExpression.ui(ui),
                },
            })
            .list()
    },
    run: (ui) => {
        return [
            'derive {',
            ...ui.map((c) => {
                if (c.named_expression != null) return '  ' + prefab_namedExpression.run(c.named_expression)
                return '  🔴 TODO'
            }),
            '}',
        ].join('\n')
    },
})

const prefab_namedExpression = prefab({
    ui: (ui) => {
        const expr = ui.fields(
            {
                col: ui.selectOne({
                    choices: () => TABLES[prefab_from.shared(ui).id].cols,
                    label: false,
                    alignLabel: false,
                }),
                pipeline: ui.list({
                    element: (ix) => ui.text({ label: '|' /* does not show ???? */ }),
                    label: '|',
                    collapsed: false,
                    // header: () => <div tw='ml-1'>|</div>,
                }),
            },
            { label: '=', border: false },
        )

        return ui.fields(
            {
                name: ui.text({ alignLabel: false, label: false }),
                expr,
            },
            { label: 'expr', collapsed: false, border: false },
        )
    },
    run: (ui) => {
        const { name, expr } = ui
        const pipelinedExpr = [expr.col.id]
        for (const pipe of expr.pipeline) {
            pipelinedExpr.push(pipe)
        }
        return `${name} = ${pipelinedExpr.join(' | ')},`
    },
})

function prefab<Form extends Spec, Args extends any[], R>(p: //
{
    ui: (_: FormBuilder, ...args: Args) => Form
    run: (_: Form['$Output']) => R
}): typeof p {
    return p
}

function prefabShared<Form extends Spec, Args extends any[], R>(p: //
{
    key: string
    ui: (_: FormBuilder, ...args: Args) => Form
    run: (_: Form['$Output']) => R
}): {
    ui: (_: FormBuilder, ...args: Args) => Widget_shared<Form>
    run: typeof p.run
    shared: (_: FormBuilder) => Form['$Output']
} {
    return {
        ui: (ui, ...args) => p.ui(ui, ...args).shared(p.key),
        run: p.run,
        shared: (_: FormBuilder) => _.form.knownShared.get(p.key)!.value as Form['$Output'],
    }
}
