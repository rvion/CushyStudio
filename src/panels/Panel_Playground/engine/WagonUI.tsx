import type { SchemaDict } from 'src/cards/App'
import type { Wagon } from './WagonType'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Form } from 'src/controls/Form'
import { FormUI } from 'src/controls/FormUI'
import { readJSON, writeJSON } from 'src/state/jsonUtils'
import { LocoChartUI } from '../charts/LocoChartsUI'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'
import { readableStringify } from 'src/utils/formatters/stringifyReadable'

export const WagonUI = observer(function Panel_Playground_<FIELDS extends SchemaDict>(p: { wagon: Wagon<FIELDS> }) {
    const wagon = p.wagon
    const form = useMemo(() => {
        return new Form(
            (b) => ({
                ...p.wagon.ui(b),
                stringifyMaxLevel: b.int({ softMin: 0, softMax: 5, max: 88, forceSnap: true, label: 'Debug indent level' }),
            }),
            {
                name: wagon.title,
                initialValue: () => readJSON(`loco/${wagon.uid}.json`),
                onChange: (form) => writeJSON(`loco/${wagon.uid}.json`, form.serial),
            },
        )
    }, [wagon])

    const ui = form.value

    const chartsOpts = wagon.run(ui)

    return (
        <div>
            <div tw='divider'>FORM</div>
            <div style={{ maxWidth: '45rem' }}>
                <FormUI form={form} />
            </div>
            <pre>{readableStringify(form.value, form.value.stringifyMaxLevel)}</pre>
            {/* <JsonViewUI value={form.value} /> */}
            {/* <pre>{JSON.stringify(form.root.valueEager, null, 2)}</pre> */}
            <LocoChartUI theme='dark' options={chartsOpts} />
        </div>
    )
})
