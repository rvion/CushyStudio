import type { STATE } from 'src/state/state'

import { readFileSync } from 'fs'
import { parse } from 'papaparse'

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
        return {
            text: data[0],
            category: parseInt(data[1]),
            count: parseInt(data[2]),
            aliases: data[3]?.split(',') ?? [],
        }
    }

    static build = (st: STATE) => {
        if (!DanbooruTags._instance) DanbooruTags._instance = new DanbooruTags(st)
        return DanbooruTags._instance
    }

    private static _instance: DanbooruTags
    private constructor(public st: STATE) {
        if (DanbooruTags._instance) throw new Error('DanbooruTags is a singleton')
        DanbooruTags._instance = this
        const filePath = this.st.configFile.get('tagFile') ?? 'completions/danbooru.csv'
        const resp = readFileSync(filePath, 'utf-8')
        const result = parse(resp, { delimiter: ',', header: false })
        if (result.errors.length > 0) console.warn(result.errors)
        // console.log('[🏷️] DanBooru:', result.data.length)
        const rows: string[][] = result.data as any
        const refined = rows.map(this.parseRow)
        this.tags = refined
        console.log(`[🏷️] DanBooru: ${this.tags.length} tags parsed`)
    }
}

// ⏸️ export async function timeExecutionMs(fn: (...any: any[]) => Promise<any>, ...args: any[]): Promise<number> {
// ⏸️     const start = new Date().getTime()
// ⏸️     await fn.apply(null, args)
// ⏸️     return new Date().getTime() - start
// ⏸️ }

// ⏸️ const TAG_CATEGORY_DATA: Record<DanbooruTagCategory, DanbooruTagCategoryData> = {
// ⏸️     [DanbooruTagCategory.General]: { name: 'general', color: 'lightblue' },
// ⏸️     [DanbooruTagCategory.Artist]: { name: 'artist', color: 'red' },
// ⏸️     [DanbooruTagCategory.Copyright]: { name: 'copyright', color: 'lightpurple' },
// ⏸️     [DanbooruTagCategory.Character]: { name: 'character', color: 'green' },
// ⏸️     [DanbooruTagCategory.Meta]: { name: 'meta', color: 'pink' },
// ⏸️ }
// ⏸️
// ⏸️ // export const TAG_CATEGORY_COLORS = Object.values(TAG_CATEGORY_DATA)
// ⏸️ //     .flatMap((d) => { //         return [[`.cm-autocompletion-${d.name}`, { color: d.color + ' !important' }]] //     })
// ⏸️ //     .reduce((dict: StyleSpec, el: [string, any]) => ((dict[el[0]] = el[1]), dict), {})
// ⏸️
// ⏸️ function escapeRegExp(s: string) {
// ⏸️     return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// ⏸️ }
// ⏸️
// ⏸️ function formatPostCount(postCount: number): string {
// ⏸️     if (!postCount || !isNaN(postCount)) return ''
// ⏸️
// ⏸️     let formatter: Intl.NumberFormat
// ⏸️
// ⏸️     // Danbooru formats numbers with a padded fraction for 1M or 1k, but not for 10/100k
// ⏸️     if (postCount >= 1000000 || (postCount >= 1000 && postCount < 10000))
// ⏸️         formatter = Intl.NumberFormat('en', { notation: 'compact', minimumFractionDigits: 1, maximumFractionDigits: 1 })
// ⏸️     else formatter = Intl.NumberFormat('en', { notation: 'compact' })
// ⏸️
// ⏸️     return formatter.format(postCount)
// ⏸️ }
// ⏸️
