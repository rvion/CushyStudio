import { type Builder, cushyFactory } from '../../controls/Builder'
import { readJSON, writeJSON } from '../../state/jsonUtils'

// TODO: make per-panel instead
export const PanelStepsConf = cushyFactory.entity(
    (ui) =>
        ui.fields(
            {
                //
                maxItem: ui.int({ default: 10, min: 1, max: 100, step: 1 }),
                appSize: ui.remSize(),
                // outputSize: ui.remSize(),
                show: ui.choicesV2(
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
                            app: false,
                            draft: false,
                            status: true,
                            outputs: true,
                            executionTime: true,
                            date: true,
                        },
                    },
                ),
            },
            { label: 'Panel steps Conf' },
        ),
    {
        name: 'panel-steps',
        serial: () => readJSON('settings/panel-steps-config.json'),
        onSerialChange: (form) => writeJSON('settings/panel-steps-config.json', form.serial),
    },
)

type UI_outputFilter = X.XChoices<{
    MediaTextL: X.XEmpty
    MediaImageL: X.XEmpty
    MediaVideoL: X.XEmpty
    MediaSplatL: X.XEmpty
    Media3dDisplacementL: X.XEmpty
    ComfyPromptL: X.XEmpty
    ComfyWorkflowL: X.XEmpty
    StepL: X.XEmpty
    MediaCustomL: X.XEmpty
    RuntimeErrorL: X.XEmpty
}>

function ui_outputFilter(ui: Builder): UI_outputFilter {
    return ui.choicesV2(
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
