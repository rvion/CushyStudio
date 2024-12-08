import { beforeEach, describe, expect, it } from 'bun:test'

import { simpleBuilder as b, simpleFactory as f } from '../'

const r = f.repository

describe('repo.reset', () => {
   beforeEach(() => r.reset())
   it('works', () => {
      const A1 = b.string().create()
      expect(r.allDocuments.size).toBe(1)
      expect(r.allFields.size).toBe(1)
      const A2 = b.string().optional(true).list({ min: 1 }).create()
      expect(r.allDocuments.size).toBe(2)
      expect(r.allFields.size).toBe(4)
      expect(r.transactionCount).toBe(2)
      r.resetEntities()
      expect(r.transactionCount).toBe(3) // +1
      expect(r.allDocuments.size).toBe(0) // resetted
      expect(r.allFields.size).toBe(0) // resetted
      expect(r.deleteCount).toBe(4) // to what was in allFields
   })
})
