import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleRepo } from '../../index'

describe('model links', () => {
    it('work', () => {
        expect(simpleRepo.tctCount).toBe(0)
        expect(simpleRepo._allEntities.size).toBe(0)
        expect(simpleRepo._allFields.size).toBe(0)

        //
        const S = b.fields({
            int: b.int(),
            str: b.string(),
            bool: b.bool(),
            list: b.int().list({ min: 3 }),
        })

        const e = S.create()
        // expect(JSON.stringify(e.serial)).toBe('{}')
        expect(e.toValueJSON()).toMatchObject({
            int: 0,
            str: '',
            bool: false,
            list: [0, 0, 0],
        })

        // entity map
        expect(e.repo).toBe(simpleRepo)

        expect(e.repo._allEntities.size).toBe(1)
        expect(e.repo._allFields.size).toBe(8)
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        expect(simpleRepo.tctCount).toBe(1)

        expect()
    })
})
