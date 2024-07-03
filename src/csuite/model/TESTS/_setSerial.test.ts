import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'

// ------------------------------------------------------------------------------
describe('setSerial ', () => {
    it('works with valid serial', () => {
        const S1 = b.string({ default: '🔵A' })
        const E1 = S1.create()
        E1.setRootSerial({
            type: 'str',
            val: '🟢B',
        })
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
        E1.setRootSerial({
            type: 'group',
            values_: {
                a: {
                    type: 'group',
                    values_: {
                        b: {
                            type: 'group',
                            values_: {
                                c: {
                                    type: 'str',
                                    val: '🟢',
                                },
                                d: {
                                    type: 'number',
                                    val: 2,
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

function expectJSON(a: any) {
    return expect(JSON.parse(JSON.stringify(a)))
}

export const x = 0
