import { describe, expect, it } from 'bun:test'
import { observable, toJS } from 'mobx'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from '../../model/TESTS/utils/expectJSON'

describe('FieldChoices', () => {
    // VVVVV should not be needed since we have some after each that is globally injected via preload.
    // afterEach(() => simpleRepo.reset())
    const Multi = b
        .choices({
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
        })
        .withConfig({ default: 'baz' })

    const Single = b.choice(
        {
            foo: b.string({ default: 'yo' }),
            bar: b.int().list({ defaultLength: 3 }),
            baz: b.string(),
        },
        { default: 'baz' },
    )

    // INSTANCIATION -------------------
    describe('instanciation', () => {
        it('works without default - Multi', () => {
            const MultiNoDefault = b.choices({
                foo: b.string({ default: 'yo' }),
                bar: b.int().list({ defaultLength: 3 }),
                baz: b.string(),
            })
            const E2 = MultiNoDefault.create()
            expectJSON(E2.value).toEqual({})
        })
        it('works without default - Single', () => {
            const SingleNoDefault = b.choice({
                foo: b.string({ default: 'yo' }),
                bar: b.int().list({ defaultLength: 3 }),
                baz: b.string(),
            })

            const E1 = SingleNoDefault.create()
            expectJSON(E1.value).toEqual({ foo: 'yo' })
        })

        it('works WITH default - Multi', () => {
            const E1 = Multi.create()
            expect(E1.toValueJSON()).toEqual({ baz: '' })
            expect(toJS(E1.serial)).toMatchObject({
                values: {
                    baz: { value: '' },
                },
            })
        })

        it('works WITH default - Single', () => {
            const E2 = Single.create()
            expect(E2.toValueJSON()).toEqual({ baz: '' })
            expect(toJS(E2.serial)).toMatchObject({
                values: {
                    baz: { value: '' },
                },
            })
        })
    })

    // SET SERIAL ----------------------
    describe('setSerial', () => {
        it('works', () => {
            const E1 = Multi.create()
            expectJSON(E1.value).toEqual({ baz: '' })

            const serial = {
                $: 'choices' as const,
                branches: { baz: true, foo: true, bar: true },
                values: {
                    baz: { $: 'str' as const, value: '🔵' },
                    foo: { $: 'str' as const, value: '🟢' },
                    bar: {
                        $: 'list' as const,
                        items_: [
                            { $: 'number' as const, value: 1 },
                            { $: 'number' as const, value: 2 },
                            { $: 'number' as const, value: 3 },
                        ],
                    },
                },
            } satisfies (typeof Multi)['$Serial']

            E1.setSerial(serial)
            expect(E1.serial).not.toBe(serial)
            // expect(E1.value).toBe(2)
            expectJSON(E1.value).toEqual({ foo: '🟢', bar: [1, 2, 3], baz: '🔵' })
            expect(toJS(E1.serial)).toMatchObject(serial)
        })

        it('should work with the values_ property (backward compatibility)', () => {
            const E1 = Multi.create()
            expectJSON(E1.value).toEqual({ baz: '' })

            const serial = {
                $: 'choices' as const,
                branches: { baz: true },
                values_: {
                    baz: { $: 'str' as const, value: '🔵' },
                },
            } as any

            E1.setSerial(serial)
            expect(E1.serial).not.toBe(serial)
            // expect(E1.value).toBe(2)
            expectJSON(E1.value).toEqual({ baz: '🔵' })
            expect(toJS(E1.serial)).toMatchObject({
                $: 'choices' as const,
                branches: { baz: true },
                values: {
                    baz: { $: 'str' as const, value: '🔵' },
                },
            })
        })

        it('should assign the serial if the branch is active', () => {
            const E1 = Multi.create()

            const serial = {
                $: 'choices' as const,
                branches: { baz: true },
                values: {
                    baz: { $: 'str' as const, value: '🔵' },
                },
            } satisfies (typeof Multi)['$Serial']

            E1.setSerial(serial)
            expect(E1.serial).not.toBe(serial)
            expectJSON(E1.value).toEqual({ baz: '🔵' })
            expect(toJS(E1.serial)).toMatchObject(serial)
        })

        describe('disabled branch', () => {
            const MultiNoDefault = b.choices({
                foo: b.string({ default: 'yo' }),
                bar: b.int().list({ defaultLength: 3 }),
                baz: b.string(),
            })

            //🔶 observable prevents implicit cloning by mobx on assignation
            // that could make us think the serial is deeply cloned when it's not
            const serial = observable({
                $: 'choices' as const,
                branches: { baz: false },
                values: {
                    baz: { $: 'str' as const, value: '🔵' },
                },
            }) // satisfies (typeof E1)['$Serial']

            it('should assign the serial even if the branch is deactivated', () => {
                const E1 = MultiNoDefault.create()

                E1.setSerial(serial)
                expect(E1.serial).not.toBe(serial)
                expectJSON(E1.value).toEqual({})
                expect(toJS(E1.serial)).toMatchObject(serial)
            })

            it('should not activate the branch', () => {
                const E1 = MultiNoDefault.create()

                E1.setSerial(serial)
                expect(toJS(E1.serial.branches)).toEqual({ baz: false, foo: false, bar: false })
            })

            describe('when the field is not instanciated', () => {
                it('should not instanciate the field', () => {
                    const E1 = MultiNoDefault.create()

                    E1.setSerial(serial)
                    expect(E1.repo.allFieldSize).toBe(1)
                })

                it('should deep clone the value', () => {
                    const E1 = MultiNoDefault.create()

                    E1.setSerial(serial)
                    expect(E1.serial.values.baz === serial.values.baz).toBe(false)
                    expect(E1.serial.values.baz).toEqual(serial.values.baz)
                })
            })

            it('should keep the serial when we disable children via setSerial', () => {
                const E1 = MultiNoDefault.create()

                const activeSerial = {
                    $: 'choices' as const,
                    branches: { baz: true },
                    values: {
                        baz: { $: 'str' as const, value: '🔵' },
                    },
                }

                const unactiveSerial = {
                    $: 'choices' as const,
                    branches: { baz: false },
                    values: {
                        baz: { $: 'str' as const, value: '🟢' },
                    },
                }

                E1.setSerial(activeSerial)
                E1.setSerial(unactiveSerial)

                expect(E1.serial).toMatchObject(unactiveSerial)
                expect(E1.subFields).toHaveLength(0)
                expect(E1.value).toEqual({})
            })

            it('should unset the value if deactivating without a value for the field', () => {
                const E1 = MultiNoDefault.create()

                const activeSerial = {
                    $: 'choices' as const,
                    branches: { baz: true },
                    values: {
                        baz: { $: 'str' as const, value: '🔵' },
                    },
                }

                const unactiveSerial = {
                    $: 'choices' as const,
                    branches: { baz: false },
                    values: {},
                }

                E1.setSerial(activeSerial)
                E1.setSerial(unactiveSerial)

                expect(toJS(E1.serial.values)).toEqual({})
                expect(E1.value).toEqual({})
            })
        })
    })

    describe('enableBranch', () => {
        describe('Multi', () => {
            it('should activate the branch and instanciate the child field', () => {
                const E1 = Multi.create()

                E1.enableBranch('foo')

                expect(toJS(E1.serial)).toMatchObject({
                    branches: { foo: true, bar: false, baz: true },
                    values: {
                        foo: { $: 'str' as const, value: 'yo' },
                        baz: { $: 'str' as const, value: '' },
                    },
                })
                expect(E1.subFields).toHaveLength(2)
            })
        })

        describe('Single', () => {
            it('should deactivate the current branch', () => {
                const E1 = Single.create()

                E1.enableBranch('foo')

                expect(toJS(E1.serial)).toMatchObject({
                    branches: { foo: true, bar: false, baz: false },
                    values: {
                        foo: { $: 'str' as const, value: 'yo' },
                        baz: { $: 'str' as const, value: '' },
                    },
                })
                expect(E1.subFields).toHaveLength(1)
            })
        })
    })

    describe('disableBranch', () => {
        describe('Multi', () => {
            it('should keep the value inside the serial when disabling a branch', () => {
                const E1 = Multi.create()

                E1.setSerial({
                    $: 'choices' as const,
                    branches: { baz: true },
                    values: {
                        baz: { $: 'str' as const, value: '🔵' },
                    },
                })

                E1.disableBranch('baz')

                expect(toJS(E1.serial)).toMatchObject({
                    branches: { baz: false },
                    values: {
                        baz: { $: 'str' as const, value: '🔵' },
                    },
                })
            })

            it('should remove the value', () => {
                const E1 = Multi.create()

                E1.setSerial({
                    $: 'choices' as const,
                    branches: { baz: true },
                    values: {
                        baz: { $: 'str' as const, value: '🔵' },
                    },
                })

                E1.disableBranch('baz')

                expect(E1.value).toEqual({})
            })
        })
    })

    describe.skip('setValue', () => {
        // it('works', () => {
        //     const E1 = Multi.create()
        //     expectJSON(E1.value).toEqual(['🔵', '🔵', '🔵'])
        //     expect(E1.length).toBe(3)
        //     E1.value = ['🔵', '🟢']
        //     expect(E1.length).toBe(2)
        //     expectJSON(E1.value).toEqual(['🔵', '🟢'])
        //     expect(toJS(E1.serial)).toMatchObject({
        //         $: 'list' as const,
        //         items_: [
        //             { $: 'str' as const, value: '🔵' },
        //             { $: 'str' as const, value: '🟢' },
        //         ],
        //     })
        // })
        // it('updates the serial without creating a new one', () => {
        //     const E1 = Multi.create()
        //     const oldSerial = E1.serial
        //     expect(oldSerial.items_.length).toBe(3)
        //     E1.value = ['🔵', '🟢']
        //     expect(oldSerial.items_.length).toBe(2)
        //     expect(toJS(oldSerial)).toMatchObject({
        //         $: 'list' as const,
        //         items_: [
        //             { $: 'str' as const, value: '🔵' },
        //             { $: 'str' as const, value: '🟢' },
        //         ],
        //     })
        // })
    })

    // STRUCTURAL SHARING --------------
    it.skip('generate a new serial for each field', () => {
        // const E1 = Multi.create()
        // const E2 = Multi.create(E1.serial)
        // // same shape
        // expect(E1.items.length).toBe(3)
        // expect(E1.serial).toEqual(E2.serial)
        // expect(E1.at(1)!.serial).toEqual(E2.at(1)!.serial)
        // // different refs
        // expect(E1.serial === E2.serial).toBe(false)
        // expect(E1.at(1)!.serial === E2.at(1)!.serial).toBe(false)
    })

    // EFFECTS -------------------------
    it.skip('doesnt apply serial effect nor value effect on instanciation ', () => {
        // 🔴 TODO
    })
})
