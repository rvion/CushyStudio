import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'pathe'

export const readJSON = (absPath: string): Maybe<object> => {
    console.log(absPath)
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

export const writeJSON = (absPath: string, json: object) => {
    console.log(absPath)
    mkdirSync(dirname(absPath), { recursive: true })
    const str = JSON.stringify(json, null, 2)
    writeFileSync(absPath, str, 'utf8')
}
