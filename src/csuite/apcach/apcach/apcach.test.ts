import { describe, expect, it } from 'bun:test'
import { crToBg } from '../contrast/crTo'
import { apcachToCss } from '../convert/apcachToCss'
import { apcach } from './apcach'
import { _assertSimilarOklch } from '../tests/_assertSimilarOklch'

describe('apcach', () => {
    it('kinda work', () => {
        const apc = apcach(crToBg('#E8E8E8', 60, 'apca'), 0.2, 145)
        const str = apcachToCss(apc, 'oklch')
        _assertSimilarOklch(
            str,
            `oklch(52.71% 0.2 145)`,
            /* 🔴 readme wrong ? */
            3,
        )
    })
})
