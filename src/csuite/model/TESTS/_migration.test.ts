import { describe, expect as expect_, it } from 'bun:test'

import { simpleRepo } from '../../index'

// ------------------------------------------------------------------------------
describe('can recover when field becoming list ', () => {
    it('works with string', () => {
        const E = simpleRepo.entity((f) => f.int({ default: 3 }))
        expect(E.serial).toMatchObject({
            root: {
                val: 3,
            },
        })
    })
})

function expect(a: any) {
    return expect_(JSON.parse(JSON.stringify(a)))
}

export const x = 0
