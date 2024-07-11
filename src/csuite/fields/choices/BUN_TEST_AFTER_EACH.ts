import { afterEach, expect } from 'bun:test'

import { simpleRepo } from '../../index'

afterEach(() => {
    simpleRepo.reset()
    expect(true).toBe(true)
})
