import { describe, expect, it } from 'bun:test'

describe.skip('migration system', () => {
   // prettier-ignore
   it('properly fails at crashing when successfully instanciating with errors unless told otherwise', () => {
      expect('🔴').toBe('🟢')
    })
   it('migrates stuff', () => {
      expect('🔴').toBe('🟢')
   })
})
