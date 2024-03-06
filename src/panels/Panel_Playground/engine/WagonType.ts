import type { SchemaDict } from 'src/cards/App'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { LocoChartsOpts } from '../charts/locoCharts'

export type Wagon<FIELDS extends SchemaDict> = {
    uid: string
    title: string
    ui: (form: FormBuilder) => FIELDS
    run: (ui: { [k in keyof FIELDS]: FIELDS[k]['$Output'] }) => Promise<{
        chartOpts: Maybe<LocoChartsOpts>
        sql: string
        res: { data: any[] } | { err: any }
    }>
}

export const defineWagon = <FIELDS extends SchemaDict>(wagon: Wagon<FIELDS>): Wagon<FIELDS> => wagon
