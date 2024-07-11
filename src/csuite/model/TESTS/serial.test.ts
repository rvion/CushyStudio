import { describe, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from './utils/expectJSON'

// ------------------------------------------------------------------------------
describe('assign to value object', () => {
    it('properly ensure value is properly set for every field', () => {
        const S1 = b.fields({
            int0: b.int(),
            int3: b.int({ default: 4 }),
            intOpt: b.int({ default: 5 }).optional(),
            intOpt2: b.int({ default: 8 }).optional(true),
            strEmpty: b.string(),
            strCoucou: b.string({ default: 'coucou' }),
            bool: b.bool(),
            boolTrue: b.bool({ default: true }),
            boolFalse: b.bool({ default: false }),
            with: b.with(b.bool(), (x) =>
                b.fields({
                    b1: x,
                    b2: x,
                }),
            ),
        })
        const E1 = S1.create()

        // VALUE
        expectJSON({
            bool: false,
            boolFalse: false,
            boolTrue: true,
            int0: 0,
            int3: 4,
            intOpt: null,
            intOpt2: 8,
            strCoucou: 'coucou',
            strEmpty: '',
            with: {
                b1: false,
                b2: false,
            },
        }).toMatchObject(E1.toValueJSON())

        // SERIAL
        expectJSON({
            type: 'group',
            values_: {
                int0: { type: 'number', value: 0 },
                int3: { type: 'number', value: 4 },
                strEmpty: { type: 'str', value: '' },
                strCoucou: { type: 'str', value: 'coucou' },
                bool: { type: 'bool', value: false },
                boolTrue: { type: 'bool', value: true },
                boolFalse: { type: 'bool', value: false },
                intOpt: {
                    type: 'optional',
                    active: false,
                    child: { type: 'number', value: 5 },
                },
                intOpt2: {
                    type: 'optional',
                    active: true,
                    child: { type: 'number', value: 8 },
                },
                with: {
                    type: 'link',
                    a: { type: 'bool', value: false },
                    b: {
                        type: 'group',
                        values_: {
                            b1: { type: 'shared' },
                            b2: { type: 'shared' },
                        },
                    },
                },
            },
        }).toMatchObject(E1.toSerialJSON())
    })
})
