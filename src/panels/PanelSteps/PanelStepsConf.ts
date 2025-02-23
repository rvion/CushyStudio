import { cushyFactory, type CushySchemaBuilder } from '../../controls/CushyBuilder'
import { readJSON, writeJSON } from '../../state/jsonUtils'

// TODO: make per-panel instead
export const PanelStepsConf = cushyFactory.document(
   (ui) =>
      ui.fields(
         {
            //
            maxItem: ui.int({ default: 10, min: 1, max: 100, step: 1 }),
            appSize: ui.remSize(),
            // outputSize: ui.remSize(),
            show: ui.choices(
               {
                  title: ui.empty(),
                  app: ui.empty({ label: 'App illustration' }),
                  draft: ui.empty({ label: 'Draft illustration' }),
                  status: ui.empty(),
                  outputs: ui_outputFilter(ui),
                  executionTime: ui.empty(),
                  date: ui.empty(),
               },
               {
                  default: {
                     title: true,
                     app: undefined,
                     draft: undefined,
                     status: true,
                     outputs: true,
                     executionTime: true,
                     date: true,
                  },
               },
            ),
         },
         { label: false, header: null },
      ),
   {
      name: 'panel-steps',
      serial: () => readJSON('settings/panel-steps-config.json'),
      onSerialChange: (form) => writeJSON('settings/panel-steps-config.json', form.serial),
   },
)

type UI_outputFilter = Z.Choices<{
   MediaTextL: Z.Empty
   MediaImageL: Z.Empty
   MediaVideoL: Z.Empty
   MediaSplatL: Z.Empty
   Media3dDisplacementL: Z.Empty
   ComfyPromptL: Z.Empty
   ComfyWorkflowL: Z.Empty
   StepL: Z.Empty
   MediaCustomL: Z.Empty
   RuntimeErrorL: Z.Empty
}>

function ui_outputFilter(ui: CushySchemaBuilder): UI_outputFilter {
   return ui.choices(
      {
         MediaTextL: ui.empty(),
         MediaImageL: ui.empty(),
         MediaVideoL: ui.empty(),
         MediaSplatL: ui.empty(),
         Media3dDisplacementL: ui.empty(),
         ComfyPromptL: ui.empty(),
         ComfyWorkflowL: ui.empty(),
         StepL: ui.empty(),
         MediaCustomL: ui.empty(),
         RuntimeErrorL: ui.empty(),
      },
      {
         // appearance: 'select',
         label: false,
         tabPosition: 'center',
         default: {
            MediaTextL: true,
            MediaImageL: true,
            MediaVideoL: true,
            MediaSplatL: true,
            Media3dDisplacementL: true,
            ComfyPromptL: true,
            ComfyWorkflowL: true,
            StepL: true,
            MediaCustomL: true,
            RuntimeErrorL: true,
         },
      },
   )
}
