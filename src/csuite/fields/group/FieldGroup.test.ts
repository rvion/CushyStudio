import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'

describe('groups', () => {
    it('are practical to use', () => {
        const S1 = b.fields({
            baz: b.fields({
                qux: b.string({ default: '🔵' }),
            }),
        })
        const E1 = S1.create()
        expect(E1.Baz.Qux).toEqual(E1.fields.baz.fields.qux)
        // |      ^   ^
        // |     capital letter automatically added the the field
        // |
        // | 🟢 AFTER : E1.Baz.Qux
        // | ❌ BEFORE: E1.fields.baz.fields.qux
        // |               ~~~~~~     ~~~~~~
        // |
        // | this is SO GOOD because capital letters
        // | are displayed first in the autocompletion,
        // | which is what we want on group fields
    })
})
