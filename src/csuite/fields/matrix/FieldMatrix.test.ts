import { describe, expect, it } from 'bun:test'
import Color from 'colorjs.io'

import { simpleBuilder as b } from '../../index'

describe('FieldMatrix', () => {
    it('work', () => {
        const S1 = b.matrix({ rows: ['a', 'b'], cols: ['x', 'y'] })
        const E1 = S1.create()
        expect(E1.cols).toBe(0)
    })
})
