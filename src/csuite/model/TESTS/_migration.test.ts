import { describe, expect as expect_, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'

// ------------------------------------------------------------------------------
describe('can recover when field becoming list ', () => {
    it('works with string', () => {
        // E1 works
        const S1: S.SNumber = b.int({ default: 4 })
        const E1 = S1.create()
        expect(E1.value).toBe(4)

        // E2 recover from new serial
        const S2 = b.int().list()
        const E2 = S2.create(() => E1.serial)
        expect(E2.value).toBe([4])
    })
})

function expect(a: any) {
    return expect_(JSON.parse(JSON.stringify(a)))
}

export const x = 0
