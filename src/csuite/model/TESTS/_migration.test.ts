import { describe, expect as expect_, it } from 'bun:test'

import { simpleRepo } from '../../index'

// ------------------------------------------------------------------------------
describe('can recover when field becoming list ', () => {
    it('works with string', () => {
        const E1 = simpleRepo.entity((f) => f.int({ default: 3 }))

        expect(E1.serial).toMatchObject({
            root: {
                val: 3,
            },
        })

        const E2 = simpleRepo.entity((f) => f.int({ default: 3 }), { serial: () => E1.serial })
    })
})

function expect(a: any) {
    return expect_(JSON.parse(JSON.stringify(a)))
}

export const x = 0
