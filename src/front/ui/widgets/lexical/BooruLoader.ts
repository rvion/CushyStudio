import { readFileSync } from 'fs'
import { parse } from 'papaparse'

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
    tagsByCategory: Record<string, DanbooruTag> = {}
    aliases: Record<string, number> = {}

    parseRow = (data: string[]): DanbooruTag => {
        return {
            text: data[0],
            category: parseInt(data[1]),
            count: parseInt(data[2]),
            aliases: data[3]?.split(',') ?? [],
        }
    }
    static build = () => {
        if (!DanbooruTags._instance) DanbooruTags._instance = new DanbooruTags()
        return DanbooruTags._instance
    }
    private static _instance: DanbooruTags
    private constructor() {
        if (DanbooruTags._instance) throw new Error('DanbooruTags is a singleton')
        DanbooruTags._instance = this
        const resp = readFileSync('workspace/completions/danbooru.csv', 'utf-8')
        const result = parse(resp, { delimiter: ',', header: false })
        if (result.errors.length > 0) console.warn(result.errors)
        // console.log('[🏷️] DanBooru:', result.data.length)
        const rows: string[][] = result.data as any
        const refined = rows.map(this.parseRow)
        this.tags = refined
        console.log('[🏷️] DanBooru: tags parsed', this)
    }

    autocomplete() {
        // let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
        // let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
        // let weightBefore = /:[0-9.]+$/.exec(textBefore)
        // if (weightBefore) return null
        // let tagBefore = /\b[a-zA-Z0-9_()-]+$/.exec(textBefore)
        // if (!tagBefore) return null
        // let tagword = tagBefore[0]
        // console.warn(tagword)
        // let searchRegex: RegExp
        // if (tagword.startsWith('*')) {
        //     tagword = tagword.slice(1)
        //     searchRegex = new RegExp(`${escapeRegExp(tagword)}`, 'i')
        // } else {
        //     searchRegex = new RegExp(`(^|[^a-zA-Z])${escapeRegExp(tagword)}`, 'i')
        // }
        // const sanitize = (rawTag: string): string => {
        //     let sanitized = rawTag.replaceAll('_', ' ')
        //     // TODO config
        //     const escapeParentheses = true
        //     const isTagType = true
        //     if (escapeParentheses && isTagType) {
        //         sanitized = sanitized.replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('[', '\\[').replaceAll(']', '\\]')
        //     }
        //     return sanitized
        // }
        // const apply = (view: EditorView, completion: Completion, from: number, to: number) => {
        //     const sanitized = sanitize(completion.label)
        //     view.dispatch(insertCompletionText(view.state, sanitized, from, to))
        // }
        // const filter = (x: DanbooruTag) => x.text.toLowerCase().search(searchRegex) > -1
        // const options: Completion[] = this.tags.filter(filter).map((t) => {
        //     const categoryName = TAG_CATEGORY_DATA[t.category]?.name || 'unknown'
        //     return {
        //         label: t.text,
        //         apply,
        //         detail: formatPostCount(t.count),
        //         type: categoryName,
        //         section: 'Tags',
        //     }
        // })
        // return {
        //     from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
        //     options,
        //     validFor: /^\b([\w_()-]+)?$/,
        // }
    }

    // static getCompletionExt(): Extension {
    //     const source: CompletionSource = DanbooruTags.instance.autocomplete.bind(DanbooruTags.instance)

    //     const optionClass = (completion: Completion): string => {
    //         return `cm-autocompletion-${completion.type}`
    //     }

    //     return autocompletion({
    //         override: [source],
    //         interactionDelay: 250,
    //         optionClass,
    //     })
    // }
}

export async function timeExecutionMs(fn: (...any: any[]) => Promise<any>, ...args: any[]): Promise<number> {
    const start = new Date().getTime()
    await fn.apply(null, args)
    return new Date().getTime() - start
}

export enum DanbooruTagCategory {
    General = 0,
    Artist = 1,
    Copyright = 3,
    Character = 4,
    Meta = 5,
}

export type DanbooruTagCategoryData = { name: string; color: string }

const TAG_CATEGORY_DATA: Record<DanbooruTagCategory, DanbooruTagCategoryData> = {
    [DanbooruTagCategory.General]: { name: 'general', color: 'lightblue' },
    [DanbooruTagCategory.Artist]: { name: 'artist', color: 'red' },
    [DanbooruTagCategory.Copyright]: { name: 'copyright', color: 'lightpurple' },
    [DanbooruTagCategory.Character]: { name: 'character', color: 'green' },
    [DanbooruTagCategory.Meta]: { name: 'meta', color: 'pink' },
}

// export const TAG_CATEGORY_COLORS = Object.values(TAG_CATEGORY_DATA)
//     .flatMap((d) => { //         return [[`.cm-autocompletion-${d.name}`, { color: d.color + ' !important' }]] //     })
//     .reduce((dict: StyleSpec, el: [string, any]) => ((dict[el[0]] = el[1]), dict), {})

function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function formatPostCount(postCount: number): string {
    if (!postCount || !isNaN(postCount)) return ''

    let formatter: Intl.NumberFormat

    // Danbooru formats numbers with a padded fraction for 1M or 1k, but not for 10/100k
    if (postCount >= 1000000 || (postCount >= 1000 && postCount < 10000))
        formatter = Intl.NumberFormat('en', { notation: 'compact', minimumFractionDigits: 1, maximumFractionDigits: 1 })
    else formatter = Intl.NumberFormat('en', { notation: 'compact' })

    return formatter.format(postCount)
}
