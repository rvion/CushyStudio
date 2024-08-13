import BetterSqlite3 from 'better-sqlite3'
import { writeFileSync } from 'fs'
import JSON5 from 'json5'

import { bang } from '../csuite/utils/bang'
import { _getAllColumnsForTable } from './_getAllColumnsForTable'
import { _getAllForeignKeysForTable } from './_getAllForeignKeysForTable'

export const _codegenORM = (store: {
    //
    db: BetterSqlite3.Database
    log: (...res: any[]) => void
}) => {
    const db = store.db

    // 1. get all tables
    const stmt = db.prepare(`select name from sqlite_master where type='table'`)
    const tables = stmt.all().filter((x: any) => x.name != 'migrations') as { name: string }[]
    store.log(`found tables ${tables.map((r) => r.name)}`)

    let out1 = ''
    const tableSortedAlphabetically = tables.slice().sort((a, b) => a.name.localeCompare(b.name))
    for (const table of tableSortedAlphabetically) {
        const jsName = convertTableNameToJSName(table.name)
        out1 += `import type { ${jsName}L } from '../models/${jsName}'\n`
    }
    out1 += `\n`
    out1 += `import { Type } from '@sinclair/typebox'\n`
    out1 += `import { Generated, Insertable, Selectable, Updateable } from 'kysely'\n`
    out1 += `\n`
    out1 += `import * as T from './TYPES_json'\n`
    out1 += `\n`

    let out2 = `` // global typedef
    // let out3 = '' // schema

    let tableNames = '\n'
    tableNames += 'declare type TableNameInDB =\n'
    for (const table of tables) {
        tableNames += `    | '${table.name}'\n`
    }
    tableNames += `\n`
    out2 += tableNames

    type DBRef = { fromTable: string; fromField: string; toTable: string; tofield: string }
    const backRefs = new Map<string, DBRef[]>()
    const refs = new Map<string, DBRef[]>()
    const addRef = (p: DBRef) => {
        // ref
        if (refs.has(p.fromTable)) refs.get(p.fromTable)!.push(p)
        else refs.set(p.fromTable, [p])
        // back
        if (backRefs.has(p.toTable)) backRefs.get(p.toTable)!.push(p)
        else backRefs.set(p.toTable, [p])
    }

    for (const table of tables) {
        const fks = _getAllForeignKeysForTable(db, table.name)
        for (const fk of fks) {
            addRef({
                fromTable: table.name,
                fromField: fk.from,
                toTable: fk.table,
                tofield: fk.to,
            })
        }
    }

    const LiveDBSubKeys: string[] = []
    out2 += `declare type CushyViewID = Tagged<string, { CushyViewID: true }>\n`
    for (const table of tables) {
        const jsTableName = convertTableNameToJSName(table.name)
        LiveDBSubKeys.push(`'${table.name}'`)
        const fks = _getAllForeignKeysForTable(db, table.name)
        const cols = _getAllColumnsForTable(db, table.name)

        const tableRefs = refs.get(table.name) ?? []
        const tableBackRefs = backRefs.get(table.name) ?? []
        const xxx =
            [
                tableRefs.length
                    ? [
                          //
                          `export const ${jsTableName}Refs = [`,
                          tableRefs.map((fk) => `    ${JSON5.stringify(fk)}`).join(',\n'),
                          ']',
                      ].join('\n')
                    : `export const ${jsTableName}Refs = []`,
                tableBackRefs.length
                    ? [
                          //
                          `export const ${jsTableName}BackRefs = [`,
                          tableBackRefs.map((fk) => `    ${JSON5.stringify(fk)}`).join(',\n'),
                          ']',
                      ].join('\n')
                    : `export const ${jsTableName}BackRefs = []`,
            ].join('\n') + '\n'
        console.log(`[🧐] `, xxx)
        //

        let typeDecl: string = '' // '\n'
        // let typeDeclCreate: string = '\n'
        let schemaDecl: string = `\n`
        let fieldsDef: string = `\n`
        out2 += `declare type ${jsTableName}ID = Tagged<string, { ${jsTableName}ID: true }>\n`
        typeDecl += `export const as${jsTableName}ID = (s: string): ${jsTableName}ID => s as any\n`
        schemaDecl = `export const ${jsTableName}Schema = Type.Object(\n    {\n`
        typeDecl += `export type ${jsTableName}Table = {\n`
        // typeDeclCreate += `export type ${jsTableName}_C = {\n`
        fieldsDef += `${xxx}\nexport const ${jsTableName}Fields = {\n`
        for (const col of cols) {
            LiveDBSubKeys.push(`'${table.name}.${col.name}'`)
            const comment = `/** @default: ${JSON.stringify(col.dflt_value) ?? 'null'}, sqlType: ${col.type} */`
            const isGenerated =
                col.name === 'createdAt' || //
                col.name === 'updatedAt' ||
                col.dflt_value != null
            const fieldType = (() => {
                if (col.name === 'createdAt') return `number`
                if (col.name === 'updatedAt') return `number`
                // foreign keys
                const hasFK = fks.find((fk) => fk.from === col.name)
                if (hasFK != null) return `${convertTableNameToJSName(hasFK.table)}ID`
                // custom cases
                if (col.name === 'id') return `${jsTableName}ID`
                if (col.name === 'appPath') return `AppPath`
                if (col.name === 'status') return `T.StatusT`
                // by types
                if (col.type === 'INT') return 'number'
                if (col.type === 'float') return 'number'
                if (col.type === 'INTEGER') return 'number'
                if (col.type === 'TEXT') return 'string'
                if (col.type === 'string') return 'string'
                if (col.type === 'BLOB') return 'Uint8Array'

                // 🔶 the `JSONColumnType` makes update / insert use string instead of T
                // if (col.type === 'json') return `JSONColumnType<T.${jsTableName}_${col.name}>`
                // if (col.type === 'json') return `ColumnType<T.${jsTableName}_${col.name}>`
                if (col.type === 'json') return `T.${jsTableName}_${col.name}`

                throw new Error(`unknown type '${col.type}' in ${jsTableName}.${col.name}`)
            })()

            const schemaField = (() => {
                // foreign keys
                if (fks.find((fk) => fk.from === col.name)) return `Type.String()`
                // by types
                if (col.type === 'INT') return 'Type.Number()'
                if (col.type === 'INTEGER') return 'Type.Number()'
                if (col.type === 'float') return 'Type.Number()'
                if (col.type === 'TEXT') return 'Type.String()'
                if (col.type === 'string') return 'Type.String()'
                if (col.type === 'BLOB') return 'Type.Uint8Array()'
                if (col.type === 'json') return `T.${jsTableName}_${col.name}_Schema`
                throw new Error(`unknown type '${col.type}' in ${jsTableName}.${col.name}`)
            })()

            schemaDecl += col.notnull //
                ? `        ${col.name}: ${schemaField},\n`
                : `        ${col.name}: Type.Optional(T.Nullable(${schemaField})),\n`
            const colon = col.notnull ? ':' : '?:'
            const colonCreate = col.notnull && !col.dflt_value ? ':' : '?:'
            typeDecl += `    ${comment}\n`
            // typeDeclCreate += `    ${comment}\n`
            let TYPE = col.notnull //
                ? fieldType
                : `Maybe<${fieldType}>`
            if (isGenerated) TYPE = `Generated<${TYPE}>`
            typeDecl += `    ${col.name}${colon} ${TYPE}\n`
            // typeDeclCreate += `    ${col.name}${colonCreate} ${col.notnull ? fieldType : `Maybe<${fieldType}>`};\n\n`
            fieldsDef += `    ${col.name}: ${JSON5.stringify(col)},\n`
        }
        typeDecl += `}\n`
        // typeDecl += `export type ${jsTableName} = Selectable<${jsTableName}Table>`
        typeDecl += `export type New${jsTableName} = Insertable<${jsTableName}Table>\n`
        typeDecl += `export type ${jsTableName}Update = Updateable<${jsTableName}Table>`

        // typeDeclCreate += `}`
        schemaDecl += '    },\n    { additionalProperties: false },\n)'
        fieldsDef += `}\n`

        // store.log(typeDecl)
        // out1 += insertFn
        out1 += typeDecl + '\n'
        out1 += `export type ${jsTableName}T = Selectable<${jsTableName}Table>\n`
        // out1 += typeDeclCreate + '\n'
        out1 += schemaDecl + '\n'
        out1 += fieldsDef + '\n'
    }

    for (const table of tables) {
        const jsName = convertTableNameToJSName(table.name)
        out1 += `// prettier-ignore\n`
        out1 += `export const TABLE_${table.name} = new T.TableInfo<'${table.name}', ${jsName}T, ${jsName}L, New${jsName}, ${jsName}Update, ${jsName}ID>(\n`
        out1 += `    '${table.name}',\n`
        out1 += `    '${jsName}',\n`
        out1 += `    ${jsName}Fields,\n`
        out1 += `    ${jsName}Schema,\n`
        out1 += `    ${jsName}Refs,\n`
        out1 += `    ${jsName}BackRefs,\n`
        // out1 += `        insert${convertTableNameToJSName(table.name)}SQL,\n`
        out1 += `)\n`
    }
    out1 += '\nexport type TABLES = typeof schemas\n\n'

    out1 += '// prettier-ignore\n'
    out1 += 'export const schemas = {\n'
    for (const table of tables) {
        out1 += `    ${table.name.padEnd(21)}: TABLE_${table.name},\n`
    }
    out1 += '}'

    out1 += `\nexport type TableName = keyof typeof schemas\n`
    out1 += '\nexport type KyselyTables = {\n'
    for (const table of tables) {
        const jsName = convertTableNameToJSName(table.name)
        out1 += `    ${table.name}: ${jsName}Table\n`
    }
    out1 += '}\n'

    out1 += `export type LiveDBSubKeys = \n    | ${LiveDBSubKeys.join('\n    | ')}\n`
    out1 += `export const liveDBSubKeys = new Set([\n    ${LiveDBSubKeys.join(',\n    ')},\n])\n`

    // console.log(out1)
    writeFileSync('src/db/TYPES.gen.ts', out1)
    writeFileSync('src/db/TYPES.d.ts', out2)

    console.log(`[🧐] `, backRefs)
    console.log(`[🧐] `, refs)
}

const convertTableNameToJSName = (tableName: string) => {
    let out = tableName.replace(/_(.)/g, (m, p1) => p1.toUpperCase())
    out = bang(out[0]).toUpperCase() + out.slice(1)
    return out
}

// const toJSKey = (s: string): string => {
//     const jsObjectKeyReg = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/g
//     const isValidJSObjectKey = jsObjectKeyReg.test(s)
//     if (isValidJSObjectKey) return s
//     return JSON.stringify(s)
// }
