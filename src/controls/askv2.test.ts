import type { Maybe } from '../utils/types'

import { fakeInfoRequestFn } from './askv2'

// const r1 = await fakeInfoRequestFn((q) => ({ width: 'int' }))
// const r2 = await fakeInfoRequestFn((q) => ({ 'wanna clip skip?': 'int?' }))
const r = await fakeInfoRequestFn((ui) => ({
    foo: ui.int(),
    // paint stuff
    samMaskPoints: ui.samMaskPoints('samMaskPoints', 'https://placekitten.com/512/512'),
    manualMask: ui.manualMask('manualMask', 'https://placekitten.com/512/512'),
    paint: ui.paint('paint', 'https://placekitten.com/512/512'),
    //
    number: ui.intOpt(),
    loras: ui.loras(),
    col1: ui.selectOne('pick a primary color', ['red', 'blue', 'green']),
    col2: ui.selectOneOrCustom('choose a color', ['red', 'blue', 'green']),
    col3: ui.selectMany('choose many', ['red', 'blue', 'green']),
    col4: ui.selectManyOrCustom('choose many or custom colors', ['red', 'blue', 'green']),
    pos3d: [ui.int(), ui.int(), ui.int()],
}))

type K = (typeof r)['col1'][number]
const y: Maybe<number> = r.number
const x: string = r.loras[0].name
const aa = r.pos3d[2]
