import type { FormBuilder } from 'src/controls/FormBuilder'
import type { SchemaDict } from 'src/controls/Spec'
import type { LocoChartsOpts } from '../charts/locoCharts'

export type Wagon<FIELDS extends SchemaDict> = {
    uid: string
    title: string
    ui: (form: FormBuilder) => FIELDS
    run: (ui: { [k in keyof FIELDS]: FIELDS[k]['$Value'] }) => Promise<{
        chartOpts: Maybe<LocoChartsOpts>
        sql: string
        prql?: string
        response: { data: any[] } | { err: any }
    }>
}

export const defineWagon = <FIELDS extends SchemaDict>(wagon: Wagon<FIELDS>): Wagon<FIELDS> => wagon
