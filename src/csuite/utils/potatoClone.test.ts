import { describe, expect, it } from 'bun:test'
import { makeAutoObservable, observable } from 'mobx'

import { expectPotato } from '../model/TESTS/utils/expectJSON'
import { potatoClone } from './potatoClone'

describe('smartClone', () => {
    //
    it('can detect basic objects', () => {
        // NOT object
        expect([].constructor === Object).toBe(false)
        expect(new (class Foo {})().constructor === Object).toBe(false)

        // YES object
        expect({ a: 1 }.constructor === Object).toBe(true)
        expect(observable({ a: 1 }).constructor === Object).toBe(true)
    })

    it('works with stuff that have getters', () => {
        expect(
            potatoClone({
                get a() {
                    return observable({ x: 1 })
                },
            }),
        ).toEqual({ a: { x: 1 } })
    })

    it(`DISCARD proxy or getters `, () => {
        const x = {
            foo: 1,
            get bar(): number {
                return this.foo
            },
        }
        const y = potatoClone(x)
        y.foo = 2
        expect(y.bar).toEqual(1)
    })

    it('can somewhat-clone most stuff', () => {
        const A = {
            a: 1,
            b: '2',
            c: [3, 4, 5],
            fn1: (): void => console.log('fn1'),
            fn2: function (): void {
                console.log('fn2')
            },
            fns: [(): void => console.log('fns1'), (): void => console.log('fns2')],
            cls1: new (class {
                coucou = 'yay'
            })(),
            clsObs: new (class {
                coucou = 'yay'
                constructor() {
                    makeAutoObservable(this)
                }
            })(),
            set: new Set([1, 2, 3]),
            map: new Map([[1, 2]]),
            objsObj: observable({
                a: 1,
                b: [3, 4, { c: 5 }],
            }),
        }
        const B = potatoClone(A)

        expect(A === B).toBe(false)
        expect(A.c === B.c).toBe(false)
        expect(A.fn1 === B.fn1).toBe(true)
        expect(A.fn2 === B.fn2).toBe(true)

        expectPotato(A).toEqual(B)
        expect(A.a).toEqual(B.a)
    })
})
