import { CushyFormManager, type FormBuilder } from '../../controls/FormBuilder'
import { readJSON, writeJSON } from '../../state/jsonUtils'

// TODO: make per-panel instead
export const PanelStepsConf = CushyFormManager.form(
    (ui) =>
        ui.fields(
            {
                //
                maxItem: ui.int({ default: 10, min: 1, max: 100, step: 1 }),
                appSize: ui.remSize(),
                // outputSize: ui.remSize(),
                show: ui.choicesV2(
                    {
                        title: ui.ok(),
                        app: ui.ok({ label: 'App illustration' }),
                        draft: ui.ok({ label: 'Draft illustration' }),
                        status: ui.ok(),
                        outputs: ui_outputFilter(ui),
                        executionTime: ui.ok(),
                        date: ui.ok(),
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

function ui_outputFilter(ui: FormBuilder) {
    return ui.choicesV2(
        {
            MediaTextL: ui.ok(),
            MediaImageL: ui.ok(),
            MediaVideoL: ui.ok(),
            MediaSplatL: ui.ok(),
            Media3dDisplacementL: ui.ok(),
            ComfyPromptL: ui.ok(),
            ComfyWorkflowL: ui.ok(),
            StepL: ui.ok(),
            MediaCustomL: ui.ok(),
            RuntimeErrorL: ui.ok(),
        },
        {
            // appearance: 'select',
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
