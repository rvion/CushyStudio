import type { Field } from '../Field'
import type { Field_choices } from 'src/cushy-forms/main'

import { describe, expect, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from './utils/expectJSON'

describe('default values', () => {
    const S1 = b.bool_()
    const S2 = b.fields({ x: b.bool_() })

    describe('createDraft', () => {
        it('works', () => {
            expect(() => S1.createDraft().validateOrNull()).not.toThrow()
            expect(() => S1.createDraftAlt().validateOrNull()).not.toThrow()
            expect(S1.createDraft().validateOrNull()).toBeNil()
            expect(S1.createDraftAlt().validateOrNull()).toBeNil()
            expect(() => S1.createDraft().validateOrThrow()).toThrow()
            expect(() => S1.createDraftAlt().validateOrThrow()).toThrow()
        })
    })

    describe('schema.create', () => {
        it('should not throw time despite missing values', () => {
            const E1 = S1.create()
            expect(() => E1.value).toThrow()
            expect(E1.value_unchecked).toBeNil()
            expect(E1.value_or_zero).toBe(false)

            const E2 = S2.create()
            expect(() => E2.value).not.toThrow()
            expect(() => E2.value.x).toThrow()
            expect(() => E2.toValueJSON()).toThrow()
        })
    })

    describe('schema.createOrThrowIfInvalid', () => {
        it('throw at creation time', () => {
            expect(() => S1.createOrThrowIfInvalid()).toThrow()
        })

        it('throw at creation time', () => {
            expect(() => S2.createOrThrowIfInvalid()).toThrow()
        })
    })
})
