import { describe, expect, it } from 'bun:test'
import { isObservableProp, reaction } from 'mobx'

import { simpleBuilder as b, simpleFactory as f } from '../'

const r = f.repository

describe('field customizations', () => {
    it('works via `useClass`', () => {
        //
        const S0 = b.fields({
            foo: b.int({ default: 10 }),
        })
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
        expect(isObservableProp(E1, 'bar2')).toBeTruthy()
        // expect(isObservableProp(E1, 'volatile1')).toBeTruthy()
        expect(isObservableProp(E1, 'volatile2')).toBeTruthy()
        reaction(
            () => E1.bar2,
            (val) => console.log(`[🤠] val`, val),
        )
        E1.value.foo++
        E1.value.foo++
        E1.value.foo++
        E1.value.foo++
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
