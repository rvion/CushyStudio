import type { CushySchemaBuilder } from '../../controls/Builder'

export type CaptioningDocSchema = ReturnType<typeof captioningDocSchema>
export type CaptioningDoc = CaptioningDocSchema['$Field']

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function captioningDocSchema(b: CushySchemaBuilder) {
   return b.fields({
      uid: b.string(),

      activeImage: b.group({
         items: {
            index: b.number(),
            filePath: b.string(),
            captions: b.string().list(),
         },
      }),

      activeCaption: b.group({
         items: {
            index: b.number(),
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
