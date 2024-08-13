import { describe, expect, it } from 'bun:test'
import { toJS } from 'mobx'

import { simpleBuilder as b } from '../../index'

describe('FieldMatrix', () => {
    it('work', () => {
        const S1 = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
        const E1 = S1.create()
        expect(E1.cols.length).toBe(2)
        expect(toJS(E1.cols)).toEqual(['x', 'y'])
        expect(toJS(E1.rows)).toEqual(['a', 'b'])
        expect(toJS(E1.value)).toEqual([])

        const S2 = S1.withConfig({ default: [{ row: 'a', col: 'x' }] })
        const E2 = S2.create()
        expect(toJS(E2.value)).toMatchObject([{ row: 'a', col: 'x' }])
        E2.setCol('y', true)
        expect(toJS(E2.value)).toMatchObject([
            { row: 'a', col: 'x' },
            { row: 'a', col: 'y' },
            { row: 'b', col: 'y' },
        ])
    })
})
