import { afterEach } from 'bun:test'

import { getGlobalRepository } from '../../model/Repository'

afterEach(() => {
    getGlobalRepository().reset()
})
