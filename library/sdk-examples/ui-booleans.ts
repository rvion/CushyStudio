app({
   metadata: {
      name: 'ui-booleans',
      description: 'sdk demo for boolean ui primitives',
   },
   ui: (b) =>
      b.fields({
         check: b.bool({}),
         checkLabel: b.bool({
            label: false,
            text: 'Check Label',
         }),
         checkLabelIcon: b.bool({
            label: false,
            text: 'Check Label',
            icon: IKONS.mdiContentSaveOutline,
         }),
         toggleButton: b.bool({
            label: '',
            text: 'Toggle Button',
            display: 'button',
         }),
         toggleButtonIcon: b.bool({
            label: false,
            text: 'Toggle Button Icon',
            display: 'button',
            icon: IKONS.mdiCheckboxOutline,
         }),
         toggleButtonExpand: b.bool({
            label: '',
            text: 'Toggle Button Expand',
            display: 'button',
            expand: true,
         }),
         toggleButtonExpandIcon: b.bool({
            label: '',
            text: 'Toggle Button Expand',
            display: 'button',
            expand: true,
            icon: IKONS.mdiCheckboxOutline,
         }),
      }),
   run: async (run, ui) => {},
})
