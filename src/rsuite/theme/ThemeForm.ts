import { CushyFormManager } from '../../controls/FormBuilder'
import { readJSON, writeJSON } from '../../state/jsonUtils'

export const formConf = CushyFormManager.fields(
    (f) => ({
        showUndo: f.boolean({ tooltip: 'show undo button near every field', default: true }),
        showMenu: f.boolean({ tooltip: 'show action buttons at the bottom of the form', default: true }),
        showDiff: f.boolean({ tooltip: 'show diff button near every field', default: true }),
    }),
    {
        name: 'Gallery Conf',
        onSerialChange: (form) => writeJSON('settings/forms.json', form.serial),
        initialSerial: () => readJSON('settings/forms.json'),
    },
)
