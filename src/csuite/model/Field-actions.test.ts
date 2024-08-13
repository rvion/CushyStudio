import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleFactory as f } from '../'

const r = f.repository

describe('field customizations', () => {
    it('works', () => {
        type T1 = {
            squareV2(): number
            square(): number
            toSquare(): void
            toSquareV2(): void
            set abc(x: number)
        }
        const SA = b.int().extend(
            (self): T1 => ({
                squareV2: (): number => self.value ** 2,
                square(): number {
                    return self.value ** 2
                },
                set abc(x: number) {
                    self.value = x * 2
                },
                toSquareV2: (): void => void (self.value = self.value ** 2),
                toSquare(): void {
                    self.value = self.value ** 2
                },
            }),
        )
        const S1 = b
            .fields({
                a1: SA,
                a2: SA,
                b: b.string({ default: 'ok' }),
                // .withClass(
                //     class FieldStringPlusPlus extends Field_string {
                //         get coucou(): string {
                //             return '👋'
                //         }
                //         constructor(
                //             //
                //             ...args:any[]
                //         ) {
                //             super(repo, root, parent, schema)
                //             this.init(serial)
                //         }
                //     },
                // ),
            })

            .extend((self) => {
                return {
                    bang: (): void => {
                        // TODO: this should be done implicitly
                        // not critical
                        self.runInValueTransaction(() => {
                            self.fields.b.value += '!'
                            self.value.a1 += 11
                            self.value.a2 += 11
                        })
                    },
                    get atimes2(): number {
                        return self.value.a1 * 2
                    },
                    someValue: 2,
                }
            })

        const E1 = S1.create()
        expect({ a1: 0, a2: 0, b: 'ok' }).toMatchObject(E1.toValueJSON())

        expect(r.transactionCount).toBe(1)
        E1.bang()
        expect(r.transactionCount).toBe(2)

        expect({ a1: 11, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())
        const z1 = E1.fields.a1.square()
        const z2 = E1.fields.a1.squareV2()
        expect(z1).toBe(121)
        expect(z2).toBe(121)
        expect({ a1: 11, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())

        E1.fields.a1.toSquare()
        expect({ a1: 121, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())
        expect(E1.atimes2).toBe(242)
        expect({ a1: 121, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())
        E1.fields.a1.abc = 4
        expect({ a1: 8, a2: 11, b: 'ok!' }).toMatchObject(E1.toValueJSON())

        expect(E1.someValue).toBe(2)
        E1.someValue = 3
        expect(E1.someValue).toBe(3)
    })
})
