import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'pathe'

export const readJSON = <T extends object = object>(absPath: string): Maybe<T> => {
    // ⏸️ console.log('reading json at' , absPath)
    const exists = existsSync(absPath)
    if (!exists) return null

    const str = readFileSync(absPath, 'utf8')
    try {
        const json = JSON.parse(str)
        return json
    } catch (e) {
        console.error(`❌ failed to parse JSON: ${absPath}`)
        console.error(e)
        return null
    }
}

export const writeJSON = (absPath: string, json: object): void => {
    // ⏸️ console.log('writing json at' , absPath)
    mkdirSync(dirname(absPath), { recursive: true })
    const str = JSON.stringify(json, null, 2)
    writeFileSync(absPath, str, 'utf8')
}
