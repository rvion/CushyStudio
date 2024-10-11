import { describe, expect, it } from 'bun:test'

import { sb } from '../simple/SimpleFactory'

// most people will only have srgb monitors, without p3 nor rec 2020
// we must make sure we properly detect when our autocontrast algorithm
// offer colors outside of the available srgb gamut

describe('field schema string representations', () => {
    it('works for basic fields', () => {
        const schema = sb.fields({
            x: sb.string(),
            y: sb.string(),
        })
        expect(schema.codegenValueType()).toBe(`{ x: string; y: string }`)
    })
    it('works for list and optional', () => {
        const schema = sb.fields({
            x: sb.string(),
            y: sb.int().optional(),
            z: sb.bool().list(),
        })
        expect(schema.codegenValueType()).toBe(`{ x: string; y: Maybe<number>; z: boolean[] }`)
    })
    it('works for link and shared', () => {
        const schema = sb.with(sb.int(), (int) =>
            sb.fields({
                x: int,
            }),
        )
        expect(schema.codegenValueType()).toBe(`{ x: number }`)
    })
    it('support custom fields', () => {
        const schema = sb.fields({
            x: sb.string(),
            y: sb.int().optional(),
            z: sb.bool().list(),
        })
        expect(schema.codegenValueType()).toBe(`{ x: string; y: Maybe<number>; z: boolean[] }`)
    })
})
