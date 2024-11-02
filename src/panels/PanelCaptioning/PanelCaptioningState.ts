import type { CushySchemaBuilder } from '../../controls/Builder'

import { clamp } from 'three/src/math/MathUtils'

import { Channel } from '../../csuite'

export type CaptioningDocSchema = ReturnType<typeof captioningDocSchema>
export type CaptioningDoc = CaptioningDocSchema['$Field']

const chan = new Channel<number>()
const chan2 = new Channel<string[]>()

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function captioningDocSchema(b: CushySchemaBuilder) {
   return b.fields({
      uid: b.string(),

      activeImage: b.fields({
         index: b.number(),
         filePath: b.string(),
         captions: b
            .string()
            .list()
            .publish(chan, (self) => self.length) //  🟢 WORKS
            .publishValue(chan2), //                  🔴 DOESN'T (mobx issue)
      }),

      activeCaption: b.fields({
         text: b.string(),
         index: b
            .number()
            .subscribe(chan, (captionsLen, self) => {
               const nextValue = clamp(self.value, 0, captionsLen - 1)
               // console.log(`[🤠] FUCKME`, {
               //    captionsLen,
               //    nextValue,
               // })
               self.value = nextValue
            })
            .subscribe(chan2, (captions, self) => {
               console.log(`[🔴] OK`, captions)
            }),
      }),
      activeGlobalCaption: b.group({
         items: {
            index: b.number(),
            text: b.string(),
         },
      }),
      activeDirectory: b.group({
         items: {
            path: b.string(),
            files: b.string().list(),
         },
      }),

      floatingCaption: b.string(),
      floatingGlobalCaption: b.string(),

      selected: b.number().list(),
      folderPath: b.string(),
   })
}
