import type { FieldCtorProps } from './Field'

import { describe, expect, it } from 'bun:test'
import { isAction, isComputedProp, isObservableProp, reaction } from 'mobx'

import { simpleBuilder as b, simpleFactory as f } from '../'
import { Field_bool } from '../fields/bool/FieldBool'
import { Field_group } from '../fields/group/FieldGroup'

const r = f.repository

describe('field customizations', () => {
    describe('multiple custom class', () => {
        it('fails when useClass + useClass', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })
            const S1 = S0.useClass(() => class extends Field_group<any> {})
            expect(() => S1.useClass(() => class extends Field_group<any> {})).toThrow()
        })
        it('fails when useBuilder + useClass', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })
            const S1 = S0.useBuilder((...args) => new (class extends Field_group<any> {})(...args))
            expect(() => S1.useClass(() => class extends Field_group<any> {})).toThrow()
        })
        it('fails when useClass + useBuilder', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })
            const S1 = S0.useClass(() => class extends Field_group<any> {})
            expect(() => S1.useBuilder((...args) => new (class extends Field_group<any> {})(...args))).toThrow()
        })
        it('useBuilder + useBuilder', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })
            const S1 = S0.useBuilder((...args) => new (class extends Field_group<any> {})(...args))
            expect(() => S1.useBuilder((...args) => new (class extends Field_group<any> {})(...args))).toThrow()
        })
    })

    describe('useClass', () => {
        it('works with prims like Field_number or Field_bool ', () => {
            class F extends Field_bool {
                constructor(...args: FieldCtorProps) {
                    super(...args)
                    this.autoExtendObservable()
                }
                get inverse(): boolean {
                    return !this.value
                }
            }
            const S1 = b.bool().useClass(() => F)
            const E1 = S1.create()
            expect(E1.value).toBe(false)
            expect(E1.inverse).toBe(true)
        })

        it('works with inline class', () => {
            //
            const S0 = b.fields({ foo: b.int({ default: 10 }) })
            const S1 = S0.useClass((FIELD) => {
                return class Foo extends FIELD {
                    static HELLO = 'WORLD'
                    volatile1 = 12
                    get volatile2(): number {
                        return 33
                    }
                    get bar2(): number {
                        return this.value.foo * 2
                    }
                }
            })

            const E1 = S1.create()
            // proper constructor
            expect((E1.constructor as any).HELLO).toBe('WORLD')

            // proper
            expect(E1.value.foo).toBe(10)
            expect(E1.bar2).toBe(20)
            E1.value.foo++
            expect(E1.value.foo).toBe(11)
            expect(E1.bar2).toBe(22)

            // make sure the prop is observable
            expect(isObservableProp(E1, 'bar2')).toBeFalsy()
            // expect(isObservableProp(E1, 'volatile1')).toBeFalsy()
            expect(isObservableProp(E1, 'volatile2')).toBeFalsy()
            let xx = 0
            reaction(
                () => E1.bar2,
                (val) => xx++,
            )
            E1.value.foo++
            E1.value.foo++
            E1.value.foo++
            E1.value.foo++
            expect(xx).toBe(4)
        })

        it('works with external class', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })

            type T0 = S.Group<{
                foo: S.SNumber
            }>['$Subfields']

            class Foo2 extends Field_group<T0> {
                static HELLO = 'WORLD'
                volatile1 = 12
                get volatile2(): number {
                    return 33
                }
                get bar2(): number {
                    return this.value.foo * 2
                }
            }

            const S1 = S0.useClass(() => Foo2)

            const E1: Foo2 = S1.create()
            // proper constructor
            expect((E1.constructor as any).HELLO).toBe('WORLD')

            // proper
            expect(E1.value.foo).toBe(10)
            expect(E1.bar2).toBe(20)
            E1.value.foo++
            expect(E1.value.foo).toBe(11)
            expect(E1.bar2).toBe(22)

            // make sure the prop is observable
            expect(isObservableProp(E1, 'bar2')).toBeFalsy()
            // expect(isObservableProp(E1, 'volatile1')).toBeFalsy()
            expect(isObservableProp(E1, 'volatile2')).toBeFalsy()
            let xx = 0
            reaction(
                () => E1.bar2,
                (val) => xx++,
            )
            E1.value.foo++
            E1.value.foo++
            E1.value.foo++
            E1.value.foo++
            expect(xx).toBe(4)
        })
    })

    describe('useBuilder', () => {
        it('works via `useBuilder` ', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })

            type T0 = S.Group<{
                foo: S.SNumber
            }>['$Subfields']

            class Foo3 extends Field_group<T0> {
                constructor(public hello: string, ...args: FieldCtorProps<any>) {
                    super(...args)
                    this.autoExtendObservable()
                }
                static HELLO = 'WORLD'
                volatile1 = 12
                get volatile2(): number {
                    return 33
                }
                get bar2(): number {
                    return this.value.foo * 2
                }
            }

            const S1 = S0.useBuilder((...args) => new Foo3('world', ...args))

            const E1: Foo3 = S1.create()
            // proper constructor
            expect((E1.constructor as any).HELLO).toBe('WORLD')

            // proper
            expect(E1.value.foo).toBe(10)
            expect(E1.bar2).toBe(20)
            E1.value.foo++
            expect(E1.value.foo).toBe(11)
            expect(E1.bar2).toBe(22)

            // make sure the prop is observable
            expect(isObservableProp(E1, 'bar2')).toBeTruthy()
            // expect(isObservableProp(E1, 'volatile1')).toBeTruthy()
            expect(isObservableProp(E1, 'volatile2')).toBeTruthy()
            let xx = 0
            reaction(
                () => E1.bar2,
                (val) => xx++,
            )
            E1.value.foo++
            E1.value.foo++
            E1.value.foo++
            E1.value.foo++
            expect(xx).toBe(4)
        })
    })

    describe('autoExtendObservable', () => {
        it('throw when called twice', () => {
            const S0 = b.empty()
            const S1 = S0.useClass(
                () =>
                    class extends Field_group<any> {
                        constructor(...args: FieldCtorProps<any>) {
                            super(...args)
                            this.autoExtendObservable()
                            this.autoExtendObservable()
                        }
                    },
            )
            // TypeError: Attempting to change enumerable attribute of unconfigurable property.
            expect(() => S1.create()).toThrow()
        })

        it('allow the subclass to configure its fields/methods observability', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })

            const S1 = S0.useClass(
                () =>
                    class Glux extends Field_group<any> {
                        constructor(...args: FieldCtorProps<any>) {
                            super(...args)
                            this.autoExtendObservable({
                                attrNotObs: false,
                                getterNotObs: false,
                                instanceFnNotAction: false,
                                protoFnNotAction: false,
                            })
                        }

                        attrObs = 1
                        attrNotObs = 1
                        get getterObs() {
                            return 2
                        }
                        get getterNotObs() {
                            return 2
                        }
                        protoFnAction() {
                            return 3
                        }
                        protoFnNotAction() {
                            return 3
                        }
                        instanceFnAction = () => {
                            return 3
                        }
                        instanceFnNotAction = () => {
                            return 3
                        }
                    },
            )
            for (let i = 0; i < 3; i++) {
                const E1 = S1.create()
                expect({
                    attrObs: isObservableProp(E1, 'attrObs'),
                    attrNotObs: isObservableProp(E1, 'attrNotObs'),
                    getterObs: isComputedProp(E1, 'getterObs'),
                    getterNotObs: isComputedProp(E1, 'getterNotObs'),
                    protoFnAction: isAction(E1.protoFnAction),
                    protoFnNotAction: isAction(E1.protoFnNotAction),
                    instanceFnAction: isAction(E1.instanceFnAction),
                    instanceFnNotAction: isAction(E1.instanceFnNotAction),
                    // 🔶 these actually pass for bad reasons: the Glux autoExtendObservable will fill them
                    // even if the makeAutoObservableInheritance called missed them
                    fieldGroupAttr: isObservableProp(E1, 'fields'),
                    baseFieldAttr: isObservableProp(E1, 'ready'),
                }).toMatchObject({
                    attrObs: true,
                    attrNotObs: false,
                    getterObs: true,
                    getterNotObs: false,
                    protoFnAction: true,
                    protoFnNotAction: false,
                    instanceFnAction: true,
                    instanceFnNotAction: false,
                    fieldGroupAttr: true,
                    baseFieldAttr: true,
                })
            }
        })
        it('have the right observability for parents when we subclass but not extend', () => {
            const S0 = b.fields({ foo: b.int({ default: 10 }) })

            const S1 = S0.useClass(
                () =>
                    class Glux extends Field_group<any> {
                        attrObs = 1
                        attrNotObs = 1
                        get getterObs() {
                            return 2
                        }
                        get getterNotObs() {
                            return 2
                        }
                        protoFnAction() {
                            return 3
                        }
                        protoFnNotAction() {
                            return 3
                        }
                        instanceFnAction = () => {
                            return 3
                        }
                        instanceFnNotAction = () => {
                            return 3
                        }
                    },
            )
            for (let i = 0; i < 1; i++) {
                const E1 = S1.create()
                expect({
                    attrObs: isObservableProp(E1, 'attrObs'),
                    attrNotObs: isObservableProp(E1, 'attrNotObs'),
                    getterObs: isComputedProp(E1, 'getterObs'),
                    getterNotObs: isComputedProp(E1, 'getterNotObs'),
                    protoFnAction: isAction(E1.protoFnAction),
                    protoFnNotAction: isAction(E1.protoFnNotAction),
                    instanceFnAction: isAction(E1.instanceFnAction),
                    instanceFnNotAction: isAction(E1.instanceFnNotAction),
                    // 🔶 these actually pass for bad reasons: the Glux autoExtendObservable will fill them
                    // even if the makeAutoObservableInheritance called missed them
                    fieldGroupAttr: isObservableProp(E1, 'fields'),
                    baseFieldAttr: isObservableProp(E1, 'ready'),
                }).toMatchObject({
                    attrObs: false,
                    attrNotObs: false,
                    getterObs: false,
                    getterNotObs: false,
                    protoFnAction: false,
                    protoFnNotAction: false,
                    instanceFnAction: false,
                    instanceFnNotAction: false,
                    fieldGroupAttr: true,
                    baseFieldAttr: true,
                })
            }
        })
        // it.only('work simple', () => {
        //     //
        //     class Test {
        //         foo = b.int({ default: 10 })
        //         bar = b.string()
        //         sub = {
        //             point: b
        //                 .fields({
        //                     x: b.int(),
        //                     y: b.int(),
        //                 })
        //                 .list(),
        //         }
        //     }
        // })
    })
})
