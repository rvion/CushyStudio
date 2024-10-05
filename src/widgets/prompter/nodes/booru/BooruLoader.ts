import type { STATE } from '../../../../state/state'

import * as csv from '@fast-csv/parse'
import { createReadStream } from 'fs'
import { isObservable } from 'mobx'

export enum DanbooruTagCategory {
    General = 0,
    Artist = 1,
    Copyright = 3,
    Character = 4,
    Meta = 5,
}

export type DanbooruTagCategoryData = { name: string; color: string }

export type DanbooruTag = {
    /** main tag label */
    text: string
    /** tag category */
    category: DanbooruTagCategory
    /** proxy for popularity */
    count: number
    /** alternative wording that must not be used */
    aliases: string[]
}

export class DanbooruTags {
    tags: DanbooruTag[] = []
    // tagsByCategory: Record<string, DanbooruTag> = {}
    // aliases: Record<string, number> = {}

    parseRow = (data: string[]): DanbooruTag => {
        if (
            data[0] == null || //
            data[1] == null ||
            data[2] == null
        ) {
            console.log(`🔶 invalid danbooru tag row: ${data}`)
        }
        return {
            text: data[0] ?? '❌ unknown',
            category: parseInt(data[1] ?? '❌ unknown'),
            count: parseInt(data[2] ?? '0'),
            aliases: data[3]?.split(',') ?? [],
        }
    }

    static build = (st: STATE): DanbooruTags => {
        if (!DanbooruTags._instance) DanbooruTags._instance = new DanbooruTags(st)
        return DanbooruTags._instance
    }

    private static _instance: DanbooruTags
    private constructor(public st: STATE) {
        if (DanbooruTags._instance) throw new Error('DanbooruTags is a singleton')
        DanbooruTags._instance = this

        const filePath = this.st.configFile.get('tagFile') ?? 'completions/danbooru.csv'
        createReadStream(filePath)
            .pipe(csv.parse({ headers: false, delimiter: ',' }))
            .on('error', (error) => console.error(error))
            .on('data', (row) => this.tags.push(this.parseRow(row)))
            .on('end', (rowCount: number) => {
                console.log(`[🏷️] DanbooruTags: ${rowCount} tags parsed`)
                // console.log(`[🤠] `, this.tags[0])
            })

        if (isObservable(this.tags)) throw new Error(`tags shouldn't be observable for perf reasons`)
    }
}
