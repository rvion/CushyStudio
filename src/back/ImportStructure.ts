/**
 Example usage:

```
const code = `import React, { useState as useHookState, useEffect } from 'react';
import { observer as observer2 } from "mobx-react-lite";
import { jsx, jsxs } from "react/jsx-runtime";`
console.log(replaceImportsWithSyncImport(code))
```
*/
export function replaceImportsWithSyncImport(code: string): string {
    const importStructures = parseImportStatements(code)
    let modifiedCode = code

    importStructures.forEach((importStructure) => {
        const originalImportRegex = new RegExp(`import\\s+.*?from\\s+['"]${importStructure.moduleName}['"];?`)
        const replacement = generateSyncImportReplacement(importStructure)
        modifiedCode = modifiedCode.replace(originalImportRegex, replacement)
    })

    return modifiedCode
}

// --------------------------------------------------------------------

export type ImportStructure = {
    moduleName: string
    defaultImport?: string
    namedImports: { [key: string]: string }
}

function parseImportStatements(code: string): ImportStructure[] {
    const importRegex = /import\s+(?:(\w+),\s*)?\{\s*([^}]+)\s*\}\s+from\s+["'](.+?)["'];?/g
    const result: ImportStructure[] = []

    let match: RegExpExecArray | null
    while ((match = importRegex.exec(code)) !== null) {
        const [_, defaultImport, namedImportsPart, moduleName] = match

        const namedImports: { [key: string]: string } = {}
        namedImportsPart!.split(',').forEach((namedImport) => {
            const parts = namedImport.trim().split(/\s+as\s+/)
            const parts0 = parts[0]!
            namedImports[parts0] = parts[1] || parts0
        })

        result.push({ moduleName: moduleName!, defaultImport, namedImports })
    }

    return result
}

function generateSyncImportReplacement(importStructure: ImportStructure): string {
    const { moduleName, defaultImport, namedImports } = importStructure

    let importParts: string[] = []
    if (defaultImport) {
        importParts.push(defaultImport)
    }

    const namedImportParts = Object.entries(namedImports).map(([original, renamed]) => {
        return original === renamed ? original : `${original}: ${renamed}`
    })

    if (namedImportParts.length > 0) {
        importParts.push(`{ ${namedImportParts.join(', ')} }`)
    }

    return `const ${importParts.join(', ')} = CUSHY_IMPORT("${moduleName}");`
}
