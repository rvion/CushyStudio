import { describe, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from './utils/expectJSON'

// ------------------------------------------------------------------------------
describe('default values', () => {
    itDefaultsSimple(
        //
        'bool',
        (def) => b.bool({ default: def }),
        [true, false],
    )
    itDefaultsSimple(
        //
        'int',
        (def) => b.int({ default: def }),
        [0, 1, 2, 3, 42],
    )
    itDefaultsSimple(
        //
        'string',
        (def) => b.string({ default: def }),
        ['', '🔵', 'cushy'],
    )
    itDefaultsSimple(
        //
        'color',
        (def) => b.color({ default: def }),
        ['#332211', '#00CAFE'],
    )
    itDefaultsSimple(
        //
        'select one',
        (def) =>
            b.selectOne({
                choices: [{ id: 'a' }, { id: 'b' }, { id: 'c ' }],
                default: def,
            }),
        [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    )
    itDefaultsSimple(
        //
        'select many',
        (def) =>
            b.selectMany({
                choices: [{ id: 'a' }, { id: 'b' }, { id: 'c ' }],
                default: def,
            }),
        [
            //
            [],
            [{ id: 'a' }],
            [{ id: 'b' }, { id: 'c' }],
            [{ id: 'c' }, { id: 'a' }],
        ],
    )

    itDefaults(
        //
        'linked string',
        (def) => b.with(b.string({ default: def }), (f) => b.fields({ a: f, b: f })),
        ['', '🔵', 'cushy'].map((v) => ({ seed: v, expect: { a: v, b: v } })),
    )

    itDefaults<'a' | 'b' | { [k in 'a' | 'b']?: boolean }>(
        //
        'choices',
        (def) => b.choices({ a: b.int(), b: b.string() }, { default: def }),
        [
            { seed: 'a', expect: { a: 0 } },
            { seed: 'b', expect: { b: '' } },
            { seed: { a: true }, expect: { a: 0 } },
            { seed: { a: true, b: true }, expect: { a: 0, b: '' } },
        ],
    )
})

function itDefaults<const T>(
    //
    name: string,
    schema: (x: T) => any,
    defaults: { seed: T; expect: any }[],
): void {
    it(`works with ${name}`, () => {
        for (const def of defaults) {
            const S = schema(def.seed)
            const E = S.create()

            expectJSON(E.value).toEqual(def.expect)
        }
    })
}

function itDefaultsSimple<T>(
    //
    name: string,
    schema: (x: T) => any,
    defaults: T[],
): void {
    itDefaults(
        name,
        schema,
        defaults.map((x) => ({ seed: x, expect: x })),
    )
}
