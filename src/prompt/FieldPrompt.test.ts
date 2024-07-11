import { describe, expect, it } from 'bun:test'

import { builder as b } from '../controls/Builder'

describe('FieldPrompt', () => {
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
                    apply(field): void {
                        field.fields.c.enableBranch('bar')
                        field.fields.c.enabledBranches.bar?.setText('new prompt')
                    },
                },
            ],
        },
    )

    describe('tupples', () => {
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
})
