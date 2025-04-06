import { cushyFactory } from '../../controls/CushyBuilder'
import { commandManager } from '../../csuite/commands/CommandManager'
import { bang } from '../../csuite/utils/bang'
import { readJSON, writeJSON } from '../jsonUtils'

export const systemConf = cushyFactory.document(
   (b) =>
      b.fields(
         {
            // aaa: b.list({
            //    auto: { keys: (self) => commandManager.allKnownContextNames },
            //    uiui: { Body: uy.list.DefaultBody.with({ forLabelUse: 'key' }) },
            //    element: b.string(),
            // }),
            keybindings: b.list({
               auto: { keys: (self) => commandManager.allKnownContextNames },
               uiui: { Body: uy.list.DefaultBody.with({ forLabelUse: 'key', className: 'pl-4' }) },
               element: b.list<Z.String>({
                  element: b.string(),
                  uiui: {
                     Body: uy.list.DefaultBody.with({ forLabelUse: 'key' }),
                     // Decoration: uy.wrappers.ColoredPadding,
                  },
                  auto: {
                     init: (key) => commandManager.getCommandById(key)?.firstCombo ?? '',
                     keys: (self) => {
                        const contextName = self.zMountKey
                        console.log(`🔴1:`, [...commandManager.contextByName.values()])
                        const contex = bang(commandManager.contextByName.get(contextName))
                        const commands = bang(commandManager.commandByContext.get(contex))
                        return commands.map((c) => c.id)
                     },
                  },
               }),
            }),

            keybindings2: b.list<Z.String>({
               element: b.string(/* { label: 'coucou' } */),
               auto: {
                  keys: (self) => commandManager.commandsAsArray.map((c) => c.id),
                  init: (key) => commandManager.getCommandById(key)?.firstCombo ?? '',
               },
               uiui: { Body: uy.list.DefaultBody.with({ forLabelUse: 'key' }) },
            }),
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

// fast hot-reload
if (import.meta.hot && typeof cushy !== 'undefined') {
   import.meta.hot.accept()
   cushy.preferences.system = systemConf
}
