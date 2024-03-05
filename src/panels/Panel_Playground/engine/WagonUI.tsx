import type { SchemaDict } from 'src/cards/App'
import type { Wagon } from './WagonType'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Form } from 'src/controls/Form'
import { FormUI } from 'src/controls/FormUI'
import { readJSON, writeJSON } from 'src/state/jsonUtils'
import { LocoChartUI } from '../charts/LocoChartsUI'
import { readableStringify } from 'src/utils/formatters/stringifyReadable'
import { hash } from 'ohash'
import { Kwery } from 'src/utils/misc/Kwery'
import { Button } from 'src/rsuite/shims'

export const WagonUI = observer(function Panel_Playground_<FIELDS extends SchemaDict>(p: { wagon: Wagon<FIELDS> }) {
    const wagon = p.wagon
    const uiSt = useLocalObservable(() => ({ kweryCache: Date.now() }), [])
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

    const wtf = Kwery.get('wagon-run', { ui, cache: uiSt.kweryCache }, async () => {
        const t0 = performance.now()
        const result = await wagon.run(ui)
        const t1 = performance.now()
        return { result, elapsedMs: (t1 - t0).toFixed(1) }
    })

    return (
        <div>
            <div tw='divider'>
                FORM <Button onClick={() => (uiSt.kweryCache = Date.now())}></Button>
            </div>
            <div tw='flex gap-1'>
                <div style={{ width: '50rem' }}>
                    <div
                        tw='btn btn-primary btn-sm'
                        onClick={() => {
                            form.root.collapseAllEntries()
                        }}
                    >
                        Tidy
                    </div>
                    <FormUI form={form} />
                    <h3 tw='text-primary'>JSON:</h3>
                    <div tw='flex-1 overflow-auto'>
                        <pre>{readableStringify(form.value, form.value.stringifyMaxLevel)}</pre>
                    </div>
                </div>
                {wtf.ui(({ result: { chartOpts, sql, data }, elapsedMs }) => {
                    const key = hash(chartOpts)
                    return (
                        <div tw='flex flex-col overflow-auto'>
                            <LocoChartUI key={key} theme='dark' options={chartOpts} />
                            <h3 tw='text-primary'>SQL:</h3>
                            <div tw='overflow-auto'>
                                <pre tw='whitespace-pre-wrap'>{sql}</pre>
                            </div>
                            <h3 tw='text-primary'>DATA (⏱️ {elapsedMs} ms):</h3>
                            <div tw='overflow-hidden'>
                                <pre tw='whitespace-pre-wrap'>{readableStringify(data, form.value.stringifyMaxLevel)}</pre>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* <JsonViewUI value={form.value} /> */}
            {/* <pre>{JSON.stringify(form.root.valueEager, null, 2)}</pre> */}
        </div>
    )
})
