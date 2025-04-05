import type { Field_number } from '../fields/number/FieldNumber'

import { describe, expect, it } from 'vitest'

import { naiveDeepClone } from '../utils/naiveDeepClone'
import { getGlobalRepository, type Repository } from './Repository'

describe('field', () => {
   type Stats = {
      root: number
      subscriber: number
      publisher: number
   }

   const mkFields = (stats: Stats): { publisher: Z.Number; subscriber: Z.Number } => {
      const b = getBuilder()
      const publisher = b
         .number({ default: 20, onValueChange: () => stats.publisher++ })
         .publishSelfToChannel('X', { hoist: 1, on: 'tct.trackAsCreated+Updated' })

      const subscriber = b
         .number({ default: 10, onValueChange: () => stats.subscriber++ })
         .subscribeToChannel('X', (other: Field_number, self) => (self.value = other.value))
      return { publisher, subscriber }
   }

   const repo: Repository = getGlobalRepository()

   it('should only generate one transaction when some fields are depends on each other', () => {
      const stats = { root: 0, subscriber: 0, publisher: 0 }
      const { publisher, subscriber } = mkFields(stats)
      const SCHEMA = b.fields({ publisher, subscriber }, { onValueChange: () => stats.root++ })

      // --------------------
      const tct_1 = repo.transactionCount
      const field = SCHEMA.create()
      const tct_2 = repo.transactionCount

      expect(stats).toEqual({ root: 0, publisher: 0, subscriber: 0 })
      expect(tct_2 - tct_1).toBe(1)
      expect(naiveDeepClone(field.value)).toEqual({ publisher: 20, subscriber: 20 })

      // --------------------
      field._.publisher.value++
      const tct_3 = repo.transactionCount

      expect(tct_3 - tct_2).toBe(1)
      expect(naiveDeepClone(field.value)).toEqual({ publisher: 21, subscriber: 21 })
      expect(stats).toEqual({ root: 1, publisher: 1, subscriber: 1 })
   })

   it('should only generate one transaction when some fields are depends on each other (v2)', () => {
      const stats = { root: 0, subscriber: 0, publisher: 0 }
      const { publisher, subscriber } = mkFields(stats)
      const SCHEMA = b.fields({ subscriber, publisher }, { onValueChange: () => stats.root++ })

      // --------------------
      const tct_1 = repo.transactionCount
      const field = SCHEMA.create()
      const tct_2 = repo.transactionCount

      expect(stats).toEqual({ root: 0, publisher: 0, subscriber: 0 })
      expect(tct_2 - tct_1).toBe(1)
      expect(naiveDeepClone(field.value)).toEqual({ publisher: 20, subscriber: 20 })

      // --------------------
      field._.publisher.value++
      const tct_3 = repo.transactionCount

      expect(tct_3 - tct_2).toBe(1)
      expect(naiveDeepClone(field.value)).toEqual({ publisher: 21, subscriber: 21 })
      expect(stats).toEqual({ root: 1, publisher: 1, subscriber: 1 })
   })
})
