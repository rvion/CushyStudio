import type { STATE } from '../../../../state/state'

import * as csv from '@fast-csv/parse'
import { createReadStream, writeFileSync } from 'fs'
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
   private static _instance: DanbooruTags

   /** as static to avoid allocating too m any */
   static TagError: DanbooruTag = Object.freeze({
      text: '❌ unknown',
      category: 0 as DanbooruTagCategory,
      count: 0,
      aliases: [],
   })

   static build = (st: STATE): DanbooruTags => {
      if (DanbooruTags._instance == null) DanbooruTags._instance = new DanbooruTags(st)
      return DanbooruTags._instance
   }

   private constructor(public st: STATE) {
      if (DanbooruTags._instance != null) throw new Error('DanbooruTags is a singleton')
      DanbooruTags._instance = this
      void this.load()
   }

   /** all tags imported */
   tags: DanbooruTag[] = []

   private tagsMap: Map<string, DanbooruTag> = new Map()

   parseRow(data: (string | undefined)[]): DanbooruTag {
      if (
         data[0] == null || //
         data[1] == null ||
         data[2] == null
      ) {
         console.log(`🔶 invalid danbooru tag row: ${data}`)
         return DanbooruTags.TagError
      }
      return {
         text: data[0] ?? '❌ unknown',
         category: parseInt(data[1] ?? '0') as DanbooruTagCategory,
         count: parseInt(data[2] ?? '0'),
         aliases: data[3]?.split(',') ?? [],
      }
   }

   private async load(): Promise<void> {
      const filePaths = []
      const enabledTags = cushy.preferences.system.ϟvalue.tags

      if (enabledTags.danbooru) filePaths.push('completions/danbooru.csv')
      if (enabledTags.danbooruNSFW) filePaths.push('completions/danbooru_nsfw.csv')
      if (enabledTags.e621) filePaths.push('completions/e621.csv')
      if (enabledTags.e621NSFW) filePaths.push('completions/e621_nsfw.csv')

      const promises = filePaths.map((f) => this.loadCSV(f, enabledTags.remove))

      await Promise.all(promises)
      console.log(`[🏷️ ⁉️] 🟢 done`)
      this.tags = Array.from(this.tagsMap.values())

      if (isObservable(this.tags)) throw new Error(`tags shouldn't be observable for perf reasons`)
   }

   private loadCSV = (filePath: string, threeshold: number) =>
      new Promise<void>((resolve) => {
         let count = 0
         let kept = 0
         const start = Date.now()
         // ⏳ const __tagsMap = new Map<string, DanbooruTag>()
         // ⏳ const cacheFile = `${filePath}.cache`
         createReadStream(filePath)
            .pipe(csv.parse({ headers: false, delimiter: ',' }))
            .on('error', (error) => console.error(error))
            .on('data', (row) => {
               count++
               const parsedTag = this.parseRow(row)

               // discard tags with less than occurrences than threeshold in config
               if (parsedTag.count < threeshold) return
               kept++

               // index in local file
               // __tagsMap.set(parsedTag.text, parsedTag)

               // index in global file
               const existingTag = this.tagsMap.get(parsedTag.text)
               if (existingTag) {
                  if (existingTag.count < parsedTag.count) {
                     this.tagsMap.set(parsedTag.text, parsedTag)
                  }
               } else {
                  this.tagsMap.set(parsedTag.text, parsedTag)
               }
            })
            .on('end', () => {
               // ⏳ writeFileSync(cacheFile, JSON.stringify([...__tagsMap.entries()]), 'utf-8')
               const ellapsed = Date.now() - start
               console.log(`[🏷️ ⁉️] parsed ${filePath}`, 'kept', kept, '/', count, `${ellapsed}ms`)
               resolve()
            })
      })
}
