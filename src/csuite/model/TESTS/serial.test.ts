import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from './utils/expectJSON'

// ------------------------------------------------------------------------------
describe('assign to value object', () => {
    it('properly ensure value is properly set for every field', () => {
        const S1 = b.fields({
            int0: b.int(),
            int3: b.int({ default: 4 }),
            intOpt: b.int({ default: 5 }).optional(),
            intOpt2: b.int({ default: 8 }).optional(true),
            strEmpty: b.string(),
            strCoucou: b.string({ default: 'coucou' }),
            bool: b.bool(),
            boolTrue: b.bool({ default: true }),
            boolFalse: b.bool({ default: false }),
            with: b.with(b.bool(), (x) =>
                b.fields({
                    b1: x,
                    b2: x,
                }),
            ),
        })
        const E1 = S1.create()

        // VALUE
        expectJSON({
            bool: false,
            boolFalse: false,
            boolTrue: true,
            int0: 0,
            int3: 4,
            intOpt: null,
            intOpt2: 8,
            strCoucou: 'coucou',
            strEmpty: '',
            with: {
                b1: false,
                b2: false,
            },
        }).toMatchObject(E1.toValueJSON())

        // SERIAL
        expectJSON({
            $: 'group',
            values_: {
                int0: { $: 'number', value: 0 },
                int3: { $: 'number', value: 4 },
                strEmpty: { $: 'str', value: '' },
                strCoucou: { $: 'str', value: 'coucou' },
                bool: { $: 'bool', value: false },
                boolTrue: { $: 'bool', value: true },
                boolFalse: { $: 'bool', value: false },
                intOpt: {
                    $: 'optional',
                    active: false,
                    child: { $: 'number', value: 5 },
                },
                intOpt2: {
                    $: 'optional',
                    active: true,
                    child: { $: 'number', value: 8 },
                },
                with: {
                    $: 'link',
                    a: { $: 'bool', value: false },
                    b: {
                        $: 'group',
                        values_: {
                            b1: { $: 'shared' },
                            b2: { $: 'shared' },
                        },
                    },
                },
            },
        }).toMatchObject(E1.toSerialJSON())
    })

    it('snapshots correctly', () => {
        const S = b.selectMany({ choices: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] })
        const E = S.create()

        E.setValue([{ id: 'a' }])
        E.saveSnapshot() // 💾 1

        E.setValue([{ id: 'b' }])
        E.revertToSnapshot() // ↩️
        expectJSON(E.value).toMatchObject([{ id: 'a' }])

        E.value.push({ id: 'c' })
        expectJSON(E.value).toMatchObject([{ id: 'a' }, { id: 'c' }])

        E.revertToSnapshot() // ↩️ 🦀 I expected this to revert to 💾 1
        expectJSON(E.value).toMatchObject([{ id: 'a' }]) // 👈 But it doesn't

        // 📝 Swapping the .selectMany(...) for a .string().list() seems to work as intended
    })

    it('snapshots correctly v2', () => {
        // 🦀 Let's assume I had the wrong intuition in the previous test, and
        // that we needed to re-snaphot the value after the first revert
        const S = b.selectMany({ choices: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] })
        const E = S.create()

        E.setValue([{ id: 'a' }])
        E.saveSnapshot() // 💾 1

        E.value.push({ id: 'b' })
        E.revertToSnapshot() // ↩️
        E.saveSnapshot() // 💾 2
        expectJSON(E.value).toMatchObject([{ id: 'a' }])

        E.value.push({ id: 'c' })
        expectJSON(E.value).toMatchObject([{ id: 'a' }, { id: 'c' }])

        E.revertToSnapshot() // ↩️ Now works -> reset to 💾 2
        expectJSON(E.value).toMatchObject([{ id: 'a' }])

        // 🦀 Except now the snapshot has a snapshot ???
        expectJSON(E.serial.snapshot?.snapshot).toBeUndefined()
    })

    it('🔴 Nests snapshot ? Is this intended ?', () => {
        // building on the above surprise, this actually nests snapshots
        const S = b.int()
        const E = S.create()

        E.value = 3
        for (let i = 0; i < 10; ++i) {
            E.saveSnapshot()
            E.revertToSnapshot()
        }

        // 🦀 10 nested snapshots 👇
        expectJSON(E.serial.snapshot).toBeUndefined()
    })

    it('snapshots correctly v3', () => {
        // 🦀 And actually, if we do the same as the original snapshot,
        // but instead of `push`ing a value, override it, then it works
        const S = b.selectMany({ choices: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] })
        const E = S.create()

        E.setValue([{ id: 'a' }])
        E.saveSnapshot() // 💾 1

        E.setValue([{ id: 'b' }])
        E.revertToSnapshot()
        expectJSON(E.value).toMatchObject([{ id: 'a' }])

        E.value = [{ id: 'a' }, { id: 'c' }] // 👈 only thing changes
        expectJSON(E.value).toMatchObject([{ id: 'a' }, { id: 'c' }])

        E.revertToSnapshot() // Revert to 💾 1 as expected
        expectJSON(E.value).toMatchObject([{ id: 'a' }])
    })
})
