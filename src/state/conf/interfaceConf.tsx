import { CushyFormManager } from '../../controls/FormBuilder'
import { WidgetWithLabelUI } from '../../csuite/form/WidgetWithLabelUI'
import { readJSON, writeJSON } from '../jsonUtils'

export const interfaceConf = CushyFormManager.form(
    (ui) =>
        ui.fields(
            {
                // name copied from flexlayout; will be used
                tabSetEnableSingleTabStretch: ui.boolean({
                    label: 'Auto-Hide Tabset',
                    tooltip: 'Hide the tabset when there is only one tab',
                    default: false,
                }),

                // ...
                tooltipDelay: ui.int({ min: 0, softMax: 1000, default: 500, unit: 'ms', suffix: 'ms' }).optional(true),
                toolBarIconSize: ui.int({ min: 14, softMax: 128, default: 48, suffix: 'px' }),
                // fields group

                // 4. components
                useDefaultCursorEverywhere: ui.boolean({ default: false }),
                showWidgetUndo: ui.boolean({
                    text: 'Widget Undo',
                    tooltip: 'Show undo button near every field',
                    default: true,
                }),
                showWidgetMenu: ui.boolean({
                    text: 'Widget Menu',
                    tooltip: 'Show action buttons at the bottom of the form',
                    default: true,
                }),
                showWidgetDiff: ui.boolean({
                    text: 'Widget Diff',
                    tooltip: 'Show diff button near every field',
                    default: true,
                }),
                showToggleButtonIcons: ui.boolean({
                    text: 'Toggle Button Icons',
                    default: false,
                    tooltip: 'Show icons in toggle buttons',
                }),
            },
            {
                label: false,
                collapsed: false,
                body: (w) => {
                    const f = w.widget.fields
                    return (
                        <div tw='flex flex-col gap-1'>
                            <div tw='flex flex-col gap-1'>
                                {/* <InputNumberUI mode='int' onValueChange={(val) => f.} /> */}
                                <WidgetWithLabelUI fieldName='' widget={f.toolBarIconSize} label='Toolbar Icon Size' />
                                {
                                    <WidgetWithLabelUI
                                        fieldName='// What does this even do lol, why is it mandatory?'
                                        widget={f.showToggleButtonIcons}
                                        label='Show'
                                    />
                                }
                                {<WidgetWithLabelUI fieldName='' widget={f.showWidgetUndo} />}
                                {<WidgetWithLabelUI fieldName='' widget={f.showWidgetMenu} />}
                                {<WidgetWithLabelUI fieldName='' widget={f.showWidgetDiff} />}
                            </div>
                        </div>
                    )
                },
            },
        ),
    {
        name: 'theme config',
        initialSerial: () => readJSON('settings/theme2.json'),
        onSerialChange: (form) => writeJSON('settings/theme2.json', form.serial),
    },
)
