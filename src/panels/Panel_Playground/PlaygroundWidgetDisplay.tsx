import { observer } from 'mobx-react-lite'
import { Fragment } from 'react/jsx-runtime'

import { cushyRepo } from '../../controls/Builder'
import { CSuiteOverride } from '../../csuite/ctx/CSuiteOverride'
import { FormUI } from '../../csuite/form/FormUI'
import { type FrameAppearance, frameTemplates } from '../../csuite/frame/FrameTemplates'
import { getIconName } from '../../csuite/icons/getAllIcons'
import { mapObjectEntries } from '../../csuite/utils/mapObjectEntries'
import { mapObjectValues } from '../../csuite/utils/mapObjectValues'
import { readJSON, writeJSON } from '../../state/jsonUtils'
import { useSt } from '../../state/stateContext'

export const PlaygroundWidgetDisplay = observer(function PlaygroundRequirements_(p: {}) {
    const st = useSt()
    return (
        <Fragment>
            <CSuiteOverride
                config={{
                    //
                    showWidgetUndo: false,
                    showWidgetMenu: false,
                }}
            >
                <FormUI form={FORM_PlaygroundWidgetDisplay} />
            </CSuiteOverride>
            <FormUI form={FORM_PlaygroundWidgetDisplay} />
        </Fragment>
    )
})

export const FORM_PlaygroundWidgetDisplay = cushyRepo.fields(
    (ui) => {
        const booleanForm = {
            check: ui.bool({}),
            checkLabel: ui.bool({
                label: false,
                text: 'Check Label',
            }),
            checkLabelIcon: ui.bool({
                label: false,
                text: 'Check Label w icon',
                icon: 'mdiContentSaveOutline',
            }),
            toggleButton: ui.bool({
                label: '',
                text: 'Toggle Button',
                display: 'button',
            }),
            toggleButtonIcon: ui.bool({
                label: false,
                text: 'Toggle Button Icon',
                display: 'button',
                icon: 'mdiCheckboxOutline',
            }),
            toggleButtonExpand: ui.bool({
                label: '',
                text: 'Toggle Button Expand',
                display: 'button',
                expand: true,
            }),
            toggleButtonExpandIcon: ui.bool({
                label: '',
                text: 'Toggle Button Expand w Icon',
                display: 'button',
                expand: true,
                icon: 'mdiCheckboxOutline',
            }),
        }

        const intForm = {
            int: ui.int(),
            intConstrained: ui.int({ min: 0, max: 100, step: 10 }),
            intConstrainedSoft: ui.int({ min: 0, max: 100, softMax: 10, step: 10 }),
            intSuffix: ui.int({ min: 0, max: 100, step: 10, suffix: 'px' }),
            intLabel: ui.int({ label: false, text: 'Inner Label', min: 0, max: 100, step: 10 }),
            intLabelSuffix: ui.int({ label: false, text: 'Inner Label Suffix', min: 0, max: 100, step: 10, suffix: 'px' }),
        }

        const floatForm = {
            float: ui.float(),
            floatConstrained: ui.float({ min: 0, max: 100, step: 10 }),
            floatConstrainedSoft: ui.float({ min: 0, max: 100, softMax: 10, step: 10 }),
            floatSuffix: ui.float({ min: 0, max: 100, step: 10, suffix: 'px' }),
            floatLabel: ui.float({ label: false, text: 'Inner Label', min: 0, max: 100, step: 10 }),
            floatLabelSuffix: ui.float({ label: false, text: 'Inner Label Suffix', min: 0, max: 100, step: 10, suffix: 'px' }),
        }

        const dateForm = {
            date: ui.date(),
            dateTime: ui.datetime(),
        }

        const emailForm = {
            email: ui.email(),
        }

        const enumForm = {
            choice: ui.fields({
                enumSelection: ui.choice({
                    items: Object.fromEntries(Object.entries(ui.enum).map(([key]) => [key, ui.group()])),
                }),
            }),
        }

        const groupForm = {
            test: ui.group(),
        }

        const choiceForm = {
            choice: ui.choice({
                label: 'Choice',
                items: { choiceOne: ui.group(), choiceTwo: ui.group(), choiceThree: ui.group() },
            }),
            choices: ui.choices({
                label: 'Choices',
                items: { choiceOne: ui.group(), choiceTwo: ui.group(), choiceThree: ui.group() },
            }),
        }

        return {
            boolean: ui.group({
                startCollapsed: true,
                items: {
                    aligned: ui.group({
                        border: false,
                        items: booleanForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        justifyLabel: false,
                        items: booleanForm,
                    }),
                },
            }),
            string: ui.group({
                items: {
                    aligned: ui.group({
                        border: false,
                        items: {
                            stringLive: ui.string({}),
                            stringBuffered: ui.string({ buffered: true }),
                        },
                    }),
                },
            }),
            int: ui.group({
                startCollapsed: true,
                items: {
                    aligned: ui.group({
                        border: false,
                        items: intForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        justifyLabel: false,
                        items: intForm,
                    }),
                },
            }),

            float: ui.group({
                startCollapsed: true,
                items: {
                    aligned: ui.group({
                        border: false,
                        items: floatForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        justifyLabel: false,
                        items: floatForm,
                    }),
                },
            }),

            button: ui.group({
                startCollapsed: true,
                items: {
                    button: ui.button({}),
                    ...mapObjectValues(frameTemplates, (k, v, ix) =>
                        ui.button({
                            text: k,
                            icon: getIconName(ix * 10),
                            look: k as FrameAppearance,
                        }),
                    ),
                    ...mapObjectEntries(frameTemplates, (k, v, ix) => [
                        k + '_',
                        ui.button({
                            text: k,
                            icon: getIconName(1000 + ix * 10),
                            look: k as FrameAppearance,
                            expand: true,
                        }),
                    ]),
                },
            }),

            color: ui.group({
                startCollapsed: true,
                items: {
                    v1: ui.group({
                        border: false,
                        items: { color: ui.color({}), colorN: ui.color({ label: false, justifyLabel: false }) },
                    }),
                    v2: ui.group({
                        border: false,
                        items: { color: ui.colorV2({}), colorN: ui.colorV2({ label: false, justifyLabel: false }) },
                    }),
                },
            }),

            date: ui.group({
                items: {
                    aligned: ui.group({
                        border: false,
                        items: dateForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        justifyLabel: false,
                        items: dateForm,
                    }),
                },
            }),

            email: ui.group({
                items: {
                    aligned: ui.group({ border: false, items: emailForm }),
                    notAligned: ui.group({ border: false, justifyLabel: false, items: emailForm }),
                },
            }),

            enum: ui.group({
                items: { aligned: ui.group({ border: false, items: enumForm }) },
            }),

            group: ui.group({
                items: {
                    group: ui.group({ items: { inside: ui.float() } }),
                    groupNoAlign: ui.group({ justifyLabel: false, items: { inside: ui.float() } }),
                    groupNoBorder: ui.group({ border: false, items: { inside: ui.float() } }),
                    groupNoCollapse: ui.group({ collapsed: false, items: { inside: ui.float() } }),
                    columnExamples: ui.group({
                        items: {
                            column: ui.column({
                                items: {
                                    top: ui.float(),
                                    middle: ui.float(),
                                    bottom: ui.float(),
                                },
                            }),
                            column2: ui.column({
                                border: true,
                                justifyLabel: false,
                                items: {
                                    top: ui.float({ label: false }),
                                    middle: ui.float({ label: false }),
                                    bottom: ui.float({ label: false }),
                                },
                            }),
                        },
                    }),
                    rowExamples: ui.group({
                        items: {
                            row: ui.row({
                                items: {
                                    left: ui.float(),
                                    center: ui.float(),
                                    right: ui.float(),
                                },
                            }),
                            row2: ui.row({
                                border: true,
                                items: {
                                    left: ui.float({ label: false }),
                                    center: ui.float({ label: false }),
                                    right: ui.float({ label: false }),
                                },
                            }),
                        },
                    }),
                },
            }),

            test: ui.choice({
                items: choiceForm,
            }),
        }
    },
    {
        name: 'Playground Widget Showcase',
        initialSerial: () => readJSON('settings/playground_form_display.json'),
        onSerialChange: (form) => writeJSON('settings/playground_form_display.json', form.serial),
    },
)
