import { beforeEach, describe, expect, it } from 'vitest'

import { simpleBuilder as b, simpleFactory as f } from '../'

const r = f.repository

describe('repo.reset', () => {
   beforeEach(() => r.reset())
   it('works', () => {
      const A1 = b.string().create()
      expect(r.documentCount).toBe(1)
      expect(r.fieldCount).toBe(1)
      const A2 = b.string().optional(true).list({ min: 1 }).create()
      expect(r.documentCount).toBe(2)
      expect(r.fieldCount).toBe(4)
      expect(r.transactionCount).toBe(2)
   })
})
