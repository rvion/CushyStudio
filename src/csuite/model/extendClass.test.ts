/* eslint-disable vitest/require-to-throw-message */
import type { SimpleBuilder } from '../simple/SimpleBuilder'

import { action, computed, isAction, isComputedProp, isObservableProp, observable, reaction, runInAction } from 'mobx'
import { describe, expect, it } from 'vitest'

import { type CSchema, type SchemaDict, simpleBuilder as b, simpleFactory as f } from '../'
import { Field_bool } from '../fields/bool/FieldBool'
import { Field_group, type MAGICFIELDS } from '../fields/group/FieldGroup'

const r = f.repository

describe('field customizations', () => {
   describe('multiple custom class', () => {
      it('fails when useClass + useClass', () => {
         const S0 = b.fields({ foo: b.int({ default: 10 }) })
         class A extends Field_group<any> {}
         const S1 = S0.useClass(A, null)
         class B extends Field_group<any> {}
         expect(() => S1.useClass(B, null)).toThrow()
      })
   })

   describe('useClass', () => {
      it('works with prims like Field_number or Field_bool', (): void => {
         class F extends Field_bool {
            @computed get inverse(): boolean {
               return !this.value
            }
         }
         // const z: CSchema<CSchema<F>> = 0 as any
         const S1 = b.bool().useClass(F, null)
         const E1 = S1.create()
         E1 satisfies CSchema<CSchema<F>['$field']>['$field']
         E1 satisfies CSchema<CSchema<CSchema<F>['$field']>['$field']>['$field']

         expect(E1.value).toBe(false)
         expect(E1.inverse).toBe(true)
      })

      it('works with external class', () => {
         const S0 = b.fields({ foo: b.int({ default: 10 }) })

         type T0 = Z.FRecord<{
            foo: Z.Number
         }>['$subfields']

         interface Foo2 extends MAGICFIELDS<T0> {}
         class Foo2 extends Field_group<T0> {
            static HELLO: string = 'WORLD'
            volatile1: number = 12
            get volatile2(): number {
               return 33
            }
            get bar2(): number {
               return this.value.foo * 2
            }
         }

         const S1 = S0.useClass(Foo2, null)

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
   describe('multi-extensibility', () => {
      it('works well enough', () => {
         class MyCollection<T extends SchemaDict> extends Field_group<T> {
            @action save(): void {
               console.log('save')
            }
         }

         type FooStuff = {
            a: Z.Number
            b: Z.Record<{
               points: Z.List<Z.Record<{ x: Z.Number; y: Z.Number }>>
            }>
         }

         // 💬 2025-02-06 rvion:
         // until we pick a better default for MagicFields, I can't find an other way
         // than just having it merged at the final subclass.
         // from a practical standpoint, it's probably ok since we anyway need to merge the $field for now.
         interface MyFooCollection extends MAGICFIELDS<FooStuff> {  } // prettier-ignore
         class MyFooCollection extends MyCollection<FooStuff> {
            static schema = (b: SimpleBuilder): CSchema<MyFooCollection> =>
               b
                  .fields({
                     a: b.number(),
                     b: b.fields({ points: b.fields({ x: b.number(), y: b.number() }).list() }),
                  })
                  .useClass<MyFooCollection>(MyFooCollection, null)
            @action upTwice_action(): void {
               this.up()
               this.up()
            }
            upTwice_notAction(): void {
               this.up()
               this.up()
            }
            @computed get distance(): number {
               let dist = 0
               for (let p = 1; p < this.value.b.points.length; p++) {
                  const prev = this.value.b.points[p - 1]!
                  const curr = this.value.b.points[p]!
                  const segmentLen = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2)
                  dist += segmentLen
               }
               return dist
            }
            get X():number{return this._.b._.points.at(-1)?._.x.value??0} // prettier-ignore
            get Y(): number {
               return this._.b._.points.at(-1)?._.y.value ?? 0
            }
            @action up(): void {
               this._.b._.points.push({ x: this.X, y: this.Y - 1 })
            }
            @action down():void{this._.b._.points.push({x: this.X, y: this.Y+1})} // prettier-ignore
         }

         const t1 = MyFooCollection.schema(b)
            .create()
            .set({
               b: {
                  points: [
                     { x: 0, y: 0 },
                     { x: 0, y: 2 },
                  ],
               },
            })

         const emmittedDistances: number[] = []
         reaction(
            () => t1.distance,
            (val) => emmittedDistances.push(val),
         )
         expect(emmittedDistances).toEqual([])
         expect(t1.distance).toBe(2)
         t1.up()
         expect(JSON.parse(JSON.stringify(t1.value))).toMatchObject({
            a: 0,
            b: {
               points: [
                  { x: 0, y: 0 },
                  { x: 0, y: 2 },
                  { x: 0, y: 1 },
               ],
            },
         })
         expect(t1.distance).toBe(3)
         t1.up()
         runInAction(() => {
            t1.up()
            t1.up()
         })
         expect(t1.distance).toBe(6)
         expect(emmittedDistances).toEqual([3, 4, 6])
         t1.upTwice_action()
         t1.upTwice_notAction()
         expect(emmittedDistances).toEqual([3, 4, 6, 8, 9, 10])
      })
   })
   describe('useBuilder', () => {
      it('works via `useBuilder`', () => {
         const S0 = b.fields({ foo: b.int({ default: 10 }) })

         type T0 = { foo: Z.Number }
         interface Foo3 extends MAGICFIELDS<{ foo: Z.Number }> {}
         class Foo3 extends Field_group<T0> {
            static HELLO: string = 'WORLD'
            volatile1: number = 12
            @computed get volatile2(): number {
               return 33
            }
            @computed get bar2(): number {
               return this.value.foo * 2
            }
         }

         const S1 = S0.useClass(Foo3, null)

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

   describe('observability', () => {
      it('allow the subclass to configure its fields/methods observability', () => {
         const S0 = b.fields({ foo: b.int({ default: 10 }) })

         interface Glux extends MAGICFIELDS<any> {}
         class Glux extends Field_group<any> {
            // constructor(...args: FieldCtorProps<any>) {
            //    super(...args)
            // }

            @observable accessor attrObs = 1
            attrNotObs = 1
            @computed get getterObs(): number {
               return 2
            }
            get getterNotObs(): number {
               return 2
            }
            @action protoFnAction(): number {
               return 3
            }
            protoFnNotAction(): number {
               return 3
            }
            @action instanceFnAction = (): number => {
               return 3
            }
            instanceFnNotAction = (): number => {
               return 3
            }
         }

         const S1 = S0.useClass(Glux, null)
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
               fieldGroupAttr: false,
               baseFieldAttr: true,
            })
         }
      })
      it('have the right observability for parents when we subclass but not extend', () => {
         const S0 = b.fields({ foo: b.int({ default: 10 }) })

         interface Glux extends MAGICFIELDS<any> {}
         class Glux extends Field_group<any> {
            attrObs = 1
            attrNotObs = 1
            get getterObs(): number {
               return 2
            }
            get getterNotObs(): number {
               return 2
            }
            protoFnAction(): number {
               return 3
            }
            protoFnNotAction(): number {
               return 3
            }
            instanceFnAction = (): number => {
               return 3
            }
            instanceFnNotAction = (): number => {
               return 3
            }
         }

         const S1 = S0.useClass(Glux, null)
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
               fieldGroupAttr: false,
               baseFieldAttr: true,
            })
         }
      })
      // eslint-disable-next-line vitest/no-commented-out-tests
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
