import { cushyFactory } from '../../controls/Builder'
import { readJSON, writeJSON } from '../../state/jsonUtils'

export const PanelOutputConf = cushyFactory.entity(
    (ui) =>
        ui.fields(
            {
                outputPreviewSize: ui.number({ default: 256, min: 64, max: 1024, step: 64 }),
                latentSize: ui.percent({ default: 25 }),
                latentTransparency: ui.percent({ default: 100 }),
            },
            { label: 'Panel output Conf' },
        ),
    {
        name: 'panel-output',
        serial: () => readJSON('settings/panel-output-config.json'),
        onSerialChange: (form) => writeJSON('settings/panel-output-config.json', form.serial),
    },
)
