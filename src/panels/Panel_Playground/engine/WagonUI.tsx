import type { SchemaDict } from 'src/controls/Spec'
import type { Wagon } from './WagonType'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { useMemo } from 'react'
import { FormUI } from 'src/controls/FormUI'
import { Button } from 'src/rsuite/shims'
import { readJSON, writeJSON } from 'src/state/jsonUtils'
import { readableStringify } from 'src/utils/formatters/stringifyReadable'
import { Kwery } from 'src/utils/misc/Kwery'
import { LocoChartUI } from '../charts/LocoChartsUI'

import { CushyFormManager } from 'src/controls/FormBuilder'

export const WagonUI = observer(function Panel_Playground_<FIELDS extends SchemaDict>(p: { wagon: Wagon<FIELDS> }) {
    const wagon = p.wagon
    const uiSt = useLocalObservable(() => ({ kweryCache: Date.now(), prql: 'from invoices' }), [])
    const form = useMemo(
        () =>
            CushyFormManager.form(
                (b) => ({
                    ...p.wagon.ui(b),
                    stringifyMaxLevel: b.int({ softMin: 0, softMax: 5, max: 88, forceSnap: true, label: 'Debug indent level' }),
                }),
                {
                    name: wagon.title,
                    initialValue: () => readJSON(`loco/${wagon.uid}.json`),
                    onSerialChange: (form) => writeJSON(`loco/${wagon.uid}.json`, form.serial),
                },
            ),
        [wagon],
    )

    const ui = form.value

    const wtf = Kwery.get('wagon-run', { ui, cache: uiSt.kweryCache }, async () => {
        const t0 = performance.now()
        const result = await wagon.run(ui)
        const t1 = performance.now()
        return { result, elapsedMs: (t1 - t0).toFixed(1) }
    })

    return (
        <>
            <div tw='divider'>
                🚂💨💨💨
                <Button onClick={() => (uiSt.kweryCache = Date.now())}>
                    <span className='material-symbols-outlined text-orange-500'>sync</span>
                </Button>
            </div>
            <div tw='flex gap-1 overflow-auto'>
                <div style={{ width: '40rem', resize: 'both' }}>
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
                    <h3 tw='text-primary'>SERIAL:</h3>
                    <div tw='flex-1 overflow-auto'>
                        <pre>{readableStringify(form.serial, form.value.stringifyMaxLevel)}</pre>
                    </div>
                </div>
                {wtf.ui(({ result: { chartOpts, sql, response: res, prql }, elapsedMs }) => {
                    return (
                        <div tw='overflow-auto sticky top-0 grow'>
                            {chartOpts != null ? <LocoChartUI dev theme='dark' options={chartOpts} /> : null}
                            {/* <h3 tw='text-primary'>PRQL Playground:</h3>
                            <div tw='flex flex-col gap-1'>
                                <textarea
                                    value={uiSt.prql}
                                    onChange={(e) => (uiSt.prql = e.target.value)}
                                    style={{ resize: 'both' }}
                                />
                                <div tw='overflow-auto'>
                                    <pre tw='whitespace-pre-wrap'>{safeCompile(uiSt.prql)}</pre>
                                </div>
                            </div> */}
                            {prql != null ? (
                                <>
                                    <h3 tw='text-primary'>PRQL:</h3>
                                    <div tw='overflow-auto'>
                                        <pre tw='whitespace-pre-wrap'>{prql}</pre>
                                    </div>
                                </>
                            ) : null}
                            <h3 tw='text-primary'>SQL:</h3>
                            <div tw='overflow-auto'>
                                <pre tw='whitespace-pre-wrap'>{sql}</pre>
                            </div>
                            <h3 tw='text-primary'>DATA (⏱️ {elapsedMs} ms):</h3>
                            <div tw='overflow-hidden'>
                                <pre tw='whitespace-pre-wrap'>
                                    {readableStringify(
                                        'err' in res ? res.err : res.data.slice(0, 20),
                                        form.value.stringifyMaxLevel,
                                    )}
                                </pre>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* <JsonViewUI value={form.value} /> */}
            {/* <pre>{JSON.stringify(form.root.valueEager, null, 2)}</pre> */}
        </>
    )
})
