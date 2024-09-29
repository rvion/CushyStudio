import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'

describe('FieldMatrix', () => {
    it.only('work', () => {
        const S1 = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
        const E1 = S1.create()
        expect(E1.cols.length).toBe(2)
        expectJSON(E1.cols).toEqual(['x', 'y'])
        expectJSON(E1.rows).toEqual(['a', 'b'])
        expectJSON(E1.value).toEqual([])

        const S2 = S1.withConfig({ default: [{ row: 'a', col: 'x' }] })
        const E2 = S2.create()
        expectJSON(E2.value).toMatchObject([{ row: 'a', col: 'x' }])
        E2.setCol('y', true)
        expectJSON(E2.value).toMatchObject([
            { row: 'a', col: 'x' },
            { row: 'a', col: 'y' },
            { row: 'b', col: 'y' },
        ])
    })
})
