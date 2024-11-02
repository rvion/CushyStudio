import type { CushySchemaBuilder } from '../../controls/Builder'
import type { Field_list } from '../../csuite/fields/list/FieldList'

import { Channel } from '../../csuite'

export type CaptioningDocSchema = ReturnType<typeof captioningDocSchema>
export type CaptioningDoc = CaptioningDocSchema['$Field']

const chan = new Channel<Field_list<X.XString>>('captioning.activeImage')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function captioningDocSchema(b: CushySchemaBuilder) {
   return b.fields({
      uid: b.string(),

      activeImage: b.group({
         items: {
            index: b.number(),
            filePath: b.string(),
            captions: b.string().list().publishSelf(chan),
         },
      }),

      activeCaption: b.group({
         items: {
            index: b.number({
               onValueChange: (field) => {
                  //
                  const captions = field.consume(chan)

                  if (!captions) {
                     return
                  }

                  field.value = captions?.length
                  // field.value = captions?.lengt
                  // console.log('[FD] DOCC', field.root.fields.activeDirectory.value.files.length)
               },
            }),
            text: b.string(),
         },
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
