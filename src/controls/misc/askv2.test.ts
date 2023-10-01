import type { Requestable } from '../InfoRequest'
import type { InfoAnswer } from '../InfoAnswer'

import { FormBuilder } from '../FormBuilder'

// const r1 = await fakeInfoRequestFn((q) => ({ width: 'int' }))
// const r2 = await fakeInfoRequestFn((q) => ({ 'wanna clip skip?': 'int?' }))
// ❌ const r = await fakeInfoRequestFn((ui) => ({
// ❌     foo: ui.int({ default: 0 }),
// ❌     // paint stuff
// ❌     samMaskPoints: ui.samMaskPoints('samMaskPoints', 0 as any),
// ❌     manualMask: ui.manualMask('manualMask', 0 as any),
// ❌     paint: ui.paint('paint', 0 as any),
// ❌     //
// ❌     number: ui.intOpt({}),
// ❌     loras: ui.loras({ default: [] }),
// ❌     col1: ui.selectOne('pick a primary color', ['red', 'blue', 'green']),
// ❌     col2: ui.selectOneOrCustom('choose a color', ['red', 'blue', 'green']),
// ❌     col3: ui.selectMany('choose many', ['red', 'blue', 'green']),
// ❌     col4: ui.selectManyOrCustom('choose many or custom colors', ['red', 'blue', 'green']),
// ❌     pos3d: ui.group({
// ❌         default: { x: 0, y: 0, z: 0 },
// ❌         items: {
// ❌             x: ui.int({ default: 0 }),
// ❌             y: ui.int({ default: 0 }),
// ❌             z: ui.int({ default: 0 }),
// ❌         },
// ❌     }),
// ❌ }))

// type K = (typeof r)['col1'][number]
// const y: Maybe<number> = r.number
// const x: string = r.loras[0].name
// const aa = r.pos3d[2]

async function fakeInfoRequestFn<const Req extends { [key: string]: Requestable }>(
    //
    req: (q: FormBuilder) => Req,
): Promise<{ [key in keyof Req]: InfoAnswer<Req[key]> }> {
    const q = new FormBuilder()
    const r = req(q)
    return 0 as any
}
