import { readFileSync } from 'fs'
import { parse } from 'papaparse'

export type UserTag = {
    key: string
    value: string
}

export class UserTags {
    tags: UserTag[] = []

    parseRow = (data: string[]): UserTag => {
        return {
            key: data[0],
            value: data[1],
        }
    }
    static build = () => {
        if (!UserTags._instance) UserTags._instance = new UserTags()
        return UserTags._instance
    }
    private static _instance: UserTags
    private constructor() {
        if (UserTags._instance) throw new Error('UserTags is a singleton')
        UserTags._instance = this
        const resp = readFileSync('completions/user.def', 'utf-8')
        const result = parse(resp, { delimiter: '|', header: false })
        if (result.errors.length > 0) console.warn(result.errors)
        // console.log('[🏷️] UserTags:', result.data.length)
        const rows: string[][] = result.data as any
        const refined = rows.map(this.parseRow)
        this.tags = refined
        console.log(`[🏷️] UserTags: ${this.tags.length} tags parsed`)
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
