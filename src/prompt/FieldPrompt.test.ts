import { describe, expect, it } from 'bun:test'

describe('FieldPrompt', () => {
    // 🔴🔴🔴
    if (1 - 1 === 0) return
    const { builder: b } = require('../controls/Builder') as typeof import('../controls/Builder')
    // 🔴🔴🔴

    const S1 = b.fields(
        {
            a: b.string({ default: '🔵' }),
            b: b.number({ default: 1 }),
            c: b.choice({
                items: {
                    foo: b.string(),
                    bar: b.prompt({ default: 'coucou' }),
                },
            }),
        },
        {
            presets: [
                {
                    label: 'test',
                    apply({ fields }): void {
                        // V1
                        fields.c.enableBranch('bar')
                        fields.c.branches.bar?.setText('new prompt A')
                        // V2
                        fields.c.enableBranch('bar')?.setText('new prompt B')
                    },
                },
            ],
        },
    )

    describe('works', () => {
        it('works', () => {
            const E1 = S1.create()
            expect(E1.value.c.foo).toBe('')
            expect(E1.value.c.bar).toBeNil()

            E1.fields.c.enableBranch('bar')

            expect(E1.value.c.foo).toBeNil()
            expect(E1.value.c.bar?.text).toBe('coucou')

            E1.fields.c.enabledBranches.bar?.setText('new prompt')

            expect(E1.value.c.bar?.text).toBe('new prompt')
        })
    })

    describe('works too', () => {
        it('works', () => {
            const E1 = S1.create()
            expect(E1.value.c.foo).toBe('')
            expect(E1.value.c.bar).toBeNil()

            E1.fields.c.enableBranch('bar')?.setText('new prompt')

            expect(E1.value.c.bar?.text).toBe('new prompt')
        })
    })
})
