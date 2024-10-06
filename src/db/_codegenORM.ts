import BetterSqlite3 from 'better-sqlite3'
import { writeFileSync } from 'fs'
import JSON5 from 'json5'

import { bang } from '../csuite/utils/bang'
import { _getAllColumnsForTable, type SqlColDef } from './_getAllColumnsForTable'
import { _getAllForeignKeysForTable, type SqlFKDef } from './_getAllForeignKeysForTable'

export const _codegenORM = (store: {
    //
    db: BetterSqlite3.Database
    log: (...res: any[]) => void
}): void => {
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
    out1 += `import { Generated, /* Insertable, Selectable, Updateable */ } from 'kysely'\n`
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

    type DBRef = {
        fromTable: string
        fromField: string
        toTable: string
        tofield: string
    }
    const backRefs = new Map<string, DBRef[]>()
    const refs = new Map<string, DBRef[]>()
    const addRef = (p: DBRef): void => {
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
    // precompute a bunch of data for easier access
    type PrecomputedTableInfo = {
        sqliteTableName: string
        jsTableName: string
        fks: SqlFKDef[]
        cols: SqlColDef[]
        refs: DBRef[]
        backRefs: DBRef[]
    }
    const precomputedTableInfosDict = new Map<string, PrecomputedTableInfo>()
    const precomputedTableInfos = []
    for (const table of tables) {
        const jsTableName = convertTableNameToJSName(table.name)
        const fks = _getAllForeignKeysForTable(db, table.name)
        const cols = _getAllColumnsForTable(db, table.name)
        const tRefs = refs.get(table.name) ?? []
        const tBackRefs = backRefs.get(table.name) ?? []
        const pti: PrecomputedTableInfo = {
            jsTableName: jsTableName,
            sqliteTableName: table.name,
            fks,
            cols,
            refs: tRefs,
            backRefs: tBackRefs,
        }
        // index by BOTH jsName and sqliteName
        precomputedTableInfosDict.set(table.name, pti)
        precomputedTableInfosDict.set(jsTableName, pti)

        // and push ONCE in array for single iterration in next step
        precomputedTableInfos.push(pti)
    }

    const LiveDBSubKeys: string[] = []
    out2 += `declare type CushyViewID = Tagged<string, { CushyViewID: true }>\n`

    for (const pti of precomputedTableInfos) {
        const table = { name: pti.sqliteTableName }
        const jsTableName = pti.jsTableName
        LiveDBSubKeys.push(`'${pti.sqliteTableName}'`)
        const fks = pti.fks
        const cols = pti.cols
        const tableRefs = pti.refs
        const tableBackRefs = pti.backRefs
        const xxx =
            [
                tableRefs.length
                    ? [
                          //
                          '// prettier-ignore',
                          `export const ${jsTableName}Refs = [`,
                          // prettier-ignore
                          tableRefs
                              .map((fk) => `    ${JSON5.stringify(fk).replaceAll(',', ', ').replaceAll('{', '{ ').replaceAll('}', ' }')}`)
                              .join(',\n'),
                          ']',
                      ].join('\n')
                    : `export const ${jsTableName}Refs = []`,
                tableBackRefs.length
                    ? [
                          //
                          `// prettier-ignore`,
                          `export const ${jsTableName}BackRefs = [`,
                          // prettier-ignore
                          tableBackRefs
                              .map((fk) => `    ${JSON5.stringify(fk).replaceAll(',', ', ').replaceAll('{', '{ ').replaceAll('}', ' }')}`)
                              .join(',\n'),
                          ']',
                      ].join('\n')
                    : `export const ${jsTableName}BackRefs = []`,
            ].join('\n\n') + '\n'
        // console.log(`[🧐] `, xxx)
        //

        let typeDecl: string = `// #region ${jsTableName}\n` // '\n'
        // let typeDeclCreate: string = '\n'
        let schemaDecl: string = `\n`
        let fieldsDef: string = `\n`
        out2 += `declare type ${jsTableName}ID = Tagged<string, { ${jsTableName}ID: true }>\n`
        typeDecl += `\nexport const as${jsTableName}ID = (s: string): ${jsTableName}ID => s as any\n`
        schemaDecl = `\n\nexport const ${jsTableName}Schema = Type.Object(\n    {\n`
        typeDecl += `\nexport type ${jsTableName}Table = {\n`
        // typeDeclCreate += `export type ${jsTableName}_C = {\n`
        fieldsDef += `${xxx}\nexport const ${jsTableName}Fields = {\n`
        for (const col of cols) {
            LiveDBSubKeys.push(`'${table.name}.${col.name}'`)
            const comment = `/** @default: ${JSON.stringify(col.dflt_value) ?? 'null'}, sqlType: ${col.type} */`
            const isGenerated =
                col.name === 'createdAt' || //
                col.name === 'updatedAt' ||
                col.dflt_value != null
            const fieldType = getFieldTypeFor(col, fks, jsTableName)

            const schemaField = ((): string => {
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
        // typeDecl += `export type New${jsTableName} = Insertable<${jsTableName}Table>\n`

        // #region create type
        typeDecl += `\nexport type New${jsTableName} = {\n`
        for (const col of cols) {
            // if (col.name === 'id') continue
            if (col.name === 'createdAt') continue
            if (col.name === 'updatedAt') continue
            const isNullable = !col.notnull
            const hasDefault = col.dflt_value !== undefined
            const fieldType = getFieldTypeFor(col, fks, jsTableName)
            let finalType = fieldType
            if (isNullable) finalType = `Maybe<${fieldType}>`
            if (hasDefault || isNullable) {
                typeDecl += `    ${col.name}?: ${finalType}\n`
            } else {
                typeDecl += `    ${col.name}: ${fieldType}\n`
            }
        }
        typeDecl += `}`

        // #region update type
        // typeDecl += `export type ${jsTableName}Update = Updateable<${jsTableName}Table>`
        typeDecl += `\n\nexport type ${jsTableName}Update = {\n`
        typeDecl += `   id?: never // ${jsTableName}ID\n`
        for (const col of cols) {
            if (col.name === 'id') continue
            const isNullable = !col.notnull
            const fieldType = getFieldTypeFor(col, fks, jsTableName)
            typeDecl += `    ${col.name}?: ${fieldType}${isNullable ? ' | null' : ''}\n`
        }
        typeDecl += `}`

        // #region backref (del)
        // typeDecl += `export type ${jsTableName}Update = Updateable<${jsTableName}Table>`
        typeDecl += `\n\nexport type ${jsTableName}BackRefsToHandleOnDelete = {\n`
        const tableBackref = backRefs.get(table.name) ?? []
        for (const br of tableBackref) {
            const jsTableName = convertTableNameToJSName(br.fromTable)
            const backrefTable = bang(precomputedTableInfosDict.get(br.fromTable))
            const backRefColInfos = bang(backrefTable.cols.find((c) => c.name === br.fromField))
            const backRefIsNullabel = !backRefColInfos.notnull
            console.log(`[🤠] ${br.fromTable}_${br.fromField}`, {
                jsTableName,
                backrefTable,
                backRefColInfos,
                backRefIsNullabel,
            })
            const colon = backRefIsNullabel ? '?:' : ':'
            typeDecl += `    ${br.fromTable}_${br.fromField}${colon} ${jsTableName}BackRefsToHandleOnDelete${backRefIsNullabel ? ` | 'set null'` : ''}\n`
        }
        typeDecl += `}`

        // #region ....
        // typeDeclCreate += `}`
        schemaDecl += '    },\n    { additionalProperties: false },\n)'
        fieldsDef += `}\n`

        // store.log(typeDecl)
        // out1 += insertFn
        // #region Read type
        out1 += typeDecl + '\n'
        // out1 += `export type ${jsTableName}T = Selectable<${jsTableName}Table>\n`
        out1 += `\nexport type ${jsTableName}T = {\n`
        for (const col of cols) {
            const isNullable = !col.notnull
            const fieldType = getFieldTypeFor(col, fks, jsTableName)
            const colon = isNullable ? '?:' : ':'
            out1 += `    ${col.name}${colon} ${fieldType}${isNullable ? ' | null' : ''}\n`
        }
        out1 += `}\n`

        // #region #sum types
        out1 += `\nexport type ${jsTableName}Types = {\n`
        out1 += `    TableName: '${table.name}',\n`
        out1 += `    JSName: '${jsTableName}',\n`
        out1 += `    Read: ${jsTableName}T,\n`
        out1 += `    Instance: ${jsTableName}L,\n`
        out1 += `    Create: New${jsTableName},\n`
        out1 += `    Update: ${jsTableName}Update,\n`
        out1 += `    ID: ${jsTableName}ID,\n`
        out1 += `    Delete: ${jsTableName}BackRefsToHandleOnDelete,\n`
        out1 += `}\n`

        // out1 += typeDeclCreate + '\n'
        out1 += schemaDecl + '\n'
        out1 += fieldsDef + '\n'
    }

    for (const table of tables) {
        const jsName = convertTableNameToJSName(table.name)
        out1 += `// prettier-ignore\n`
        out1 += `export const TABLE_${table.name} = new T.TableInfo<\n`
        out1 += `    '${table.name}',\n`
        out1 += `    ${jsName}T,\n`
        out1 += `    ${jsName}L,\n`
        out1 += `    New${jsName},\n`
        out1 += `    ${jsName}Update,\n`
        out1 += `    ${jsName}ID,\n`
        out1 += `    ${jsName}BackRefsToHandleOnDelete\n`
        out1 += `>(\n`
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

    // console.log(`[🧐] `, backRefs)
    // console.log(`[🧐] `, refs)
}

const convertTableNameToJSName = (tableName: string): string => {
    let out = tableName.replace(/_(.)/g, (m, p1) => p1.toUpperCase())
    out = bang(out[0]).toUpperCase() + out.slice(1)
    return out
}

function getFieldTypeFor(col: SqlColDef, fks: SqlFKDef[], jsTableName: string): string {
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
}
// const toJSKey = (s: string): string => {
//     const jsObjectKeyReg = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/g
//     const isValidJSObjectKey = jsObjectKeyReg.test(s)
//     if (isValidJSObjectKey) return s
//     return JSON.stringify(s)
// }
