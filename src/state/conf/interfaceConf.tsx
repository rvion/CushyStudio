import { cushyRepo } from '../../controls/Builder'
import { WidgetWithLabelUI } from '../../csuite/form/WidgetWithLabelUI'
import { readJSON, writeJSON } from '../jsonUtils'

export const interfaceConf = cushyRepo.form(
    (ui) =>
        ui.fields(
            {
                // name copied from flexlayout; will be used
                tabSetEnableSingleTabStretch: ui.boolean({
                    label: 'Auto-Hide Tabset',
                    text: 'Auto-Hide Tabset',
                    tooltip: 'Hide the tabset when there is only one tab',
                    default: false,
                }),

                //
                tooltipDelay: ui
                    .int({
                        label: false,
                        justifyLabel: false,
                        text: 'Tooltip Delay',
                        tooltip:
                            'How long in milliseconds that it takes for a tooltip to pop up when hovering over something that has a tooltip',
                        min: 0,
                        softMax: 1000,
                        default: 500,
                        unit: 'ms',
                        suffix: 'ms',
                    })
                    .optional(true),

                toolBarIconSize: ui.int({
                    label: false,
                    justifyLabel: false,
                    text: 'Toolbar Icon Size',
                    tooltip: 'Icon size of the toolbar shelves in certain Panels/Editors',
                    min: 14,
                    softMax: 128,
                    default: 48,
                    suffix: 'px',
                }),
                inputHeight: ui.number({
                    label: false,
                    justifyLabel: false,
                    text: 'Input Height',
                    tooltip:
                        'Height of the fields for most widgets. For example, the Number Field, the single line string field, Boolean Toggles (Checkboxes/Toggle Buttons)',
                    min: 1.4,
                    max: 3,
                    default: 1.6,
                    unit: 'rem',
                    suffix: 'rem',
                }),
                useDefaultCursorEverywhere: ui.boolean({
                    text: 'Default Cursor Everywhere',
                    tooltip:
                        'Interactables will show the default cursor instead of the pointer finger. Reduces cursor flickering',
                    default: false,
                }),

                // 4. Widget Components
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
                showToggleButtonBox: ui.boolean({
                    text: 'Toggle Button Box',
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
                        <div
                            tw='flex flex-1 flex-grow flex-col gap-5' //TODO(bird_d): COMPONENT REPLACE: These "containers" should be replaced by a group component.
                        >
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                <WidgetWithLabelUI fieldName='' widget={f.toolBarIconSize} />
                                <WidgetWithLabelUI fieldName='' widget={f.inputHeight} />
                                <WidgetWithLabelUI fieldName='' widget={f.tooltipDelay} />
                            </div>
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                <WidgetWithLabelUI fieldName='' widget={f.tabSetEnableSingleTabStretch} label={false} />
                                <WidgetWithLabelUI fieldName='' widget={f.useDefaultCursorEverywhere} label={false} />
                            </div>
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                {
                                    <WidgetWithLabelUI
                                        fieldName='// What does this even do lol, why is it mandatory?'
                                        widget={f.showToggleButtonBox}
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
        name: 'Interface Config',
        initialSerial: () => readJSON('settings/interface.json'),
        onSerialChange: (form) => writeJSON('settings/interface.json', form.serial),
    },
)
