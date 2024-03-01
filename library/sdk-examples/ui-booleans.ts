app({
    metadata: {
        name: 'ui-booleans',
        description: 'sdk demo for boolean ui primitives',
    },
    ui: (form) => ({
        check: form.bool({}),
        checkLabel: form.bool({
            label: false,
            text: 'Check Label',
        }),
        checkLabelIcon: form.bool({
            label: false,
            text: 'Check Label',
            icon: 'save',
        }),
        toggleButton: form.bool({
            label: '',
            text: 'Toggle Button',
            display: 'button',
        }),
        toggleButtonIcon: form.bool({
            label: false,
            text: 'Toggle Button Icon',
            display: 'button',
            icon: 'check_box',
        }),
        toggleButtonExpand: form.bool({
            label: '',
            text: 'Toggle Button Expand',
            display: 'button',
            expand: true,
        }),
        toggleButtonExpandIcon: form.bool({
            label: '',
            text: 'Toggle Button Expand',
            display: 'button',
            expand: true,
            icon: 'check_box',
        }),
    }),
    run: async (run, ui) => {},
})
