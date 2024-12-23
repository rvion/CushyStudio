import { describe, expect, it } from 'bun:test'

import { mapPathToModule } from './mapPathToModule'

describe('mapPathToModule', () => {
   it('should map path to module correctly', () => {
      expect(mapPathToModule('/lib/utils/example.ts')).toEqual('src/utils/example')
   })
})
