import { describe, expect, it } from 'bun:test'

import { builder } from '../../../controls/Builder'
import { simpleBuilder as b } from '../../index'

const b2 = builder
const k = b.selectOneString(['🔵', '🟢'], { default: '🔵' })
const k2: X.XSelectOne_<'🟢' | '🔵'> = b2.selectOneString(['🔵', '🟢'], { default: '🔵' })

// ------------------------------------------------------------------------------
describe('setSerial ', () => {
    it('works with valid serial', () => {
        const S1 = b.string({ default: '🔵A' })
        const E1 = S1.create()
        E1.setSerial({ $: 'str', value: '🟢B' })
        expect(E1.value).toEqual('🟢B')
    })

    it('works with nested fields', () => {
        const S1 = b.fields({
            a: b.fields({
                b: b.fields({
                    c: b.string({ default: '🔵' }),
                    d: b.int({ default: 1 }),
                }),
            }),
        })
        const E1 = S1.create()
        E1.setSerial({
            $: 'group',
            values_: {
                a: {
                    $: 'group',
                    values_: {
                        b: {
                            $: 'group',
                            values_: {
                                c: {
                                    $: 'str',
                                    value: '🟢',
                                },
                                d: {
                                    $: 'number',
                                    value: 2,
                                },
                            },
                        },
                    },
                },
            },
        })
        expect(E1.value.a.b.c).toEqual('🟢')
        expect(E1.value.a.b.d).toEqual(2)
    })
})
