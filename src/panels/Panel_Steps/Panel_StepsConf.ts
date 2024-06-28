import { type Builder, cushyRepo } from '../../controls/Builder'
import { readJSON, writeJSON } from '../../state/jsonUtils'

// TODO: make per-panel instead
export const PanelStepsConf = cushyRepo.form(
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
        initialSerial: () => readJSON('settings/panel-steps-config.json'),
        onSerialChange: (form) => writeJSON('settings/panel-steps-config.json', form.serial),
    },
)

function ui_outputFilter(ui: Builder) {
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
