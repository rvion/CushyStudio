import { cushyFactory, type CushySchemaBuilder } from '../../controls/Builder'
import { readJSON, writeJSON } from '../jsonUtils'

// ---------------
export type $schemaFavbar = X.XGroup<{
    size: X.XNumber
    visible: X.XBool
    grayscale: X.XBool
    appIcons: X.XOptional<X.XNumber>
}>
const schemaFavbar = (b: CushySchemaBuilder): $schemaFavbar =>
    b.group({
        items: {
            size: b.int({ text: 'Size', min: 24, max: 128, default: 48, suffix: 'px', step: 4 }),
            visible: b.bool(),
            grayscale: b.boolean({ label: 'Grayscale' }),
            appIcons: b.int({ text: 'App Icons', default: 100, step: 10, min: 1, max: 100, suffix: '%' }).optional(true),
        },
    })

// ---------------
export const interfaceConf = cushyFactory.document(
    (ui) =>
        ui.fields(
            {
                // name copied from flexlayout; will be used
                tabSetEnableSingleTabStretch: ui.boolean({
                    label: 'Auto-Hide Tabset',
                    text: 'Auto-Hide Tabset',
                    tooltip: 'Hide the tabset when there is only one tab',
                    default: false,
                    onValueChange: (v) => cushy.layout.setSingleTabStretch(v.value),
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
                widgetHeight: ui.number({
                    // label: false,
                    // justifyLabel: false,
                    text: 'Widget Height',
                    tooltip: 'Height of the Widget line',
                    min: 1.4,
                    max: 3,
                    default: 1.8,
                    unit: 'rem',
                    suffix: 'rem',
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
                insideHeight: ui.number({
                    label: false,
                    justifyLabel: false,
                    text: 'Inside Height', // name is bad
                    tooltip: 'Height of the content frames within inputs',
                    min: 1,
                    max: 3,
                    default: 1.2,
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
                showWidgetFoldButtons: ui.boolean({
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

                favBar: schemaFavbar(ui),
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
                                <f.toolBarIconSize.UI LabelText={null} />
                            </div>
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                <f.widgetHeight.UI LabelText={null} />
                                <f.inputHeight.UI LabelText={null} />
                                <f.insideHeight.UI LabelText={null} />
                            </div>
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                <f.tooltipDelay.UI LabelText={null} />
                            </div>
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                <f.tabSetEnableSingleTabStretch.UI LabelText={null} />
                                <f.useDefaultCursorEverywhere.UI LabelText={null} />
                            </div>
                            <div tw='flex w-full flex-1 flex-grow flex-col gap-1'>
                                {<f.showToggleButtonBox.UI LabelText='Show' />}
                                {f.showWidgetUndo.UI({ LabelText: null })}
                                {f.showWidgetFoldButtons.UI({ LabelText: 'showWidgetFoldButtons' })}
                                {f.showWidgetMenu.UI({ LabelText: null })}
                                {f.showWidgetDiff.UI({ LabelText: null })}
                            </div>
                        </div>
                    )
                },
            },
        ),
    {
        name: 'Interface Config',
        serial: () => readJSON('settings/interface.json'),
        onSerialChange: (form) => writeJSON('settings/interface.json', form.serial),
    },
)
