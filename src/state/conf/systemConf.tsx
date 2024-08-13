import { cushyFactory } from '../../controls/Builder'
import { WidgetWithLabelUI } from '../../csuite/form/WidgetWithLabelUI'
import { readJSON, writeJSON } from '../jsonUtils'

export const systemConf = cushyFactory.entity(
    (ui) =>
        ui.fields(
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
                externalEditor: ui.string({
                    //
                    label: 'External Editor',
                    tooltip: 'The name of your preffered text editor to use when opening text files externally',
                    default: 'code',
                }),
            },
            {
                label: false,
                collapsed: false,
                body: (w) => {
                    const f = w.field.fields
                    return (
                        <div
                            tw='flex flex-1 flex-grow flex-col gap-5' //TODO(bird_d): COMPONENT REPLACE: These "containers" should be replaced by a group component.
                        >
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                <WidgetWithLabelUI fieldName='' field={f.externalEditor} />
                            </div>
                        </div>
                    )
                },
            },
        ),
    {
        name: 'System Config',
        serial: () => readJSON('settings/system.json'),
        onSerialChange: (form) => writeJSON('settings/system.json', form.serial),
    },
)
