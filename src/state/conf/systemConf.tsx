import { cushyFactory } from '../../controls/CushyBuilder'
import { readJSON, writeJSON } from '../jsonUtils'

export const systemConf = cushyFactory.document(
   (b) =>
      b.fields(
         {
            // output: ui.group({
            //     items: {
            //         primary: ui.int({ min: 0 }),
            //         paths: ui.list({
            //             element: (i: number) =>
            //                 ui.group({
            //                     //
            //                     items: {
            //                         //
            //                         name: ui.string(),
            //                         path: ui.string({ default: cushy.outputFolderPath }),
            //                     },
            //                 }),
            //         }),
            //     },
            // }),
            externalEditor: b.string({
               label: 'External Editor',
               description:
                  'The name of your preffered text editor to use when opening text files externally',
               default: 'code',
            }),
            tags: b.fields({
               danbooru: b.bool({
                  default: true,
                  label: 'Danbooru',
               }),
               danbooruNSFW: b.bool({
                  default: false,
                  label: 'Danbooru NSFW',
               }),
               e621: b.bool({ default: false, label: 'e621' }),

               e621NSFW: b.bool({ default: false, label: 'e621 NSFW' }),
               remove: b.int({ default: 0, min: 0, label: 'Minimum count' }),
            }),
         },
         {
            label: false,
            collapsed: false,
            body: (w) => {
               const f = w.field.zFields
               return (
                  <div
                     tw='flex flex-1 flex-grow flex-col gap-5' //TODO(bird_d): COMPONENT REPLACE: These "containers" should be replaced by a group component.
                  >
                     <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                        <f.externalEditor.UI Title={null} />
                     </div>
                  </div>
               )
            },
         },
      ),
   {
      name: 'System Config',
      serial: () => readJSON('settings/system.json'),
      onSerialChange: (form) => writeJSON('settings/system.json', form.zSerial),
   },
)
