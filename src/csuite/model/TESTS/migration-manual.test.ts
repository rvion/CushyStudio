import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleFactory as f } from '../../index'

const r = f.repository

describe('migration manual', () => {
    // beforeEach(() => r.repository.reset())
    it('work', () => {
        type BUGGYSerial = { valA: number; valB: number }

        let kunther = 0
        const s = b.fields(
            {
                a: b.int(),
                b: b.int(),
            },
            {
                version: '2',
                onInit: (x) => {
                    kunther += x.value.a
                    x.value.b += 2
                },
                beforeInit: (x: BUGGYSerial) => ({
                    $: 'group',
                    values_: {
                        a: {
                            $: 'number' as const,
                            value: x.valA,
                        },
                        b: {
                            $: 'number' as const,
                            value: x.valB,
                        },
                    },
                }),
            },
        )

        expect(r.transactionCount).toBe(0)

        // @ts-expect-error
        const e1 = s.create({ valA: 4, valB: 8 })
        expect(e1.toValueJSON()).toEqual({ a: 4, b: 10 })
        expect(kunther).toBe(4)
        expect(r.transactionCount).toBe(2)

        // @ts-expect-error
        const e2 = s.create({ valA: 123, valB: 888 })
        expect(e2.toValueJSON()).toEqual({ a: 123, b: 890 })
        expect(kunther).toBe(127)
        expect(r.transactionCount).toBe(4)
    })
})
