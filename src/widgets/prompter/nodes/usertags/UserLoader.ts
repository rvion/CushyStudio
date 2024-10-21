import * as csv from '@fast-csv/parse'
import { createReadStream } from 'fs'

import { bang } from '../../../../csuite/utils/bang'

export type UserTag = {
    key: string
    value: string
}

export class UserTags {
    private static _instance: UserTags
    static build = (): UserTags => {
        if (!UserTags._instance) UserTags._instance = new UserTags()
        return UserTags._instance
    }

    tags: UserTag[] = []

    parseRow = (data: string[]): UserTag => ({ key: bang(data[0]), value: bang(data[1]) })

    private constructor() {
        if (UserTags._instance) throw new Error('UserTags is a singleton')
        UserTags._instance = this
        const filePath = 'completions/user.def'
        createReadStream(filePath)
            .pipe(csv.parse({ headers: false, delimiter: '|' }))
            .on('error', (error) => console.error(error))
            .on('data', (row) => this.tags.push(this.parseRow(row)))
            .on('end', (rowCount: number) => {
                console.log(`[🏷️] UserTags: ${rowCount} tags parsed`)
                // console.log(`[🤠] `, this.tags[0])
            })
    }
}

export async function timeExecutionMs(fn: (...any: any[]) => Promise<any>, ...args: any[]): Promise<number> {
    const start = new Date().getTime()
    await fn.apply(null, args)
    return new Date().getTime() - start
}
