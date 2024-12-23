import { describe, expect, it } from 'bun:test'

import { _parseImportStatements, type ImportStructure } from './transpiler'

describe('_parseImportStatements', () => {
   it('can parse typescript imports', () => {
      type TC = {
         code: string
         expected: ImportStructure[]
      }

      const TC1: TC = {
         code: `import { Field_bool } from '../../src/csuite/fields/bool/FieldBool'`,
         expected: [
            {
               defaultImport: undefined,
               moduleName: '../../src/csuite/fields/bool/FieldBool',
               namedImports: { Field_bool: 'Field_bool' },
               stringToReplace: `import { Field_bool } from '../../src/csuite/fields/bool/FieldBool'`,
            },
         ],
      }

      const TC2: TC = {
         code: [`coucou`, `import * as F from "src/cushy-forms/main"`, `coucou`].join('\n'),
         expected: [
            {
               defaultImport: 'F',
               moduleName: 'src/cushy-forms/main',
               namedImports: {},
               stringToReplace: `import * as F from "src/cushy-forms/main"`,
            },
         ],
      }

      for (const { code, expected } of [TC1, TC2]) {
         const res = _parseImportStatements(code)
         expect(res).toMatchObject(expected)
      }
   })
})
