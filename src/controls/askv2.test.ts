import type { Maybe } from '../utils/types'

import { fakeInfoRequestFn } from './askv2'

const r1 = await fakeInfoRequestFn((q) => ({ width: 'int' }))
const r2 = await fakeInfoRequestFn((q) => ({ 'wanna clip skip?': 'int?' }))
const r3 = await fakeInfoRequestFn((ui) => ({
    foo: 'int',
    number: 'int?',
    loras: 'loras',
    col1: ui.selectOne('pick a primary color', ['red', 'blue', 'green']),
    col2: ui.selectOneOrCustom('choose a color', ['red', 'blue', 'green']),
    col3: ui.selectMany('choose many', ['red', 'blue', 'green']),
    col4: ui.selectManyOrCustom('choose many or custom colors', ['red', 'blue', 'green']),
    qux: ['int', 'int', 'int'],
}))

type K = (typeof r3)['col1'][number]
const y: Maybe<number> = r3.number
const x: string = r3.loras[0].name
const aa = r3.qux[0]
