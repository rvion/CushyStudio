app({
    metadata: {
        name: '🚂 locomotive scenario',
        description: 'Show form capabilities to fulfill complex requirements unrelated to Stable diffusion.',
    },
    ui: (ui) => {
        return {
            name: ui.string({ label: 'Scénario', default: 'iscab code A' }),
            source: ui.group({
                label: 'Source des Données',
                items: {
                    source: ui.selectOneString(['ISCAB - Liens de borne']),
                    maxEvents: ui.int({ min: 1, max: 5000, default: 10, step: 100 }),
                    actif: ui.bool(),
                },
            }),
            template: ui.prompt({ label: 'Template par défaut' }),
            signature: ui.group({
                label: false,
                collapsed: false,
                items: {
                    signature: ui.string({ label: 'Signature par défaut' }),
                    assigner: ui.selectOneString(['Assigner', 'Ne pas assigner']),
                },
            }),
            date: ui.group({
                label: false,
                collapsed: false,
                items: {
                    at: ui.choice({
                        label: 'Date',
                        appearance: 'tab',
                        border: false,
                        items: {
                            computed: ui.group({
                                // having both `collapsed` and `label` false skip the whole label line
                                border: false,
                                collapsed: false,
                                label: 'Calculée',

                                items: {
                                    [`D'après la`]: ui.selectOneString(['Date de création', 'Date de modification']),
                                    offset: ui.int({ label: 'à J+' }),
                                    // time: ui.int({ label: 'Heure' /* suffix: 'min' */ }),
                                    heure: ui.time({ default: '10:30' }),
                                    limit: ui.int({ label: 'Limite /jour', default: 200 }),
                                },
                            }),
                            onEventRecetption: ui.group({}),
                            fixed: ui.group({}),
                        },
                    }),
                    allowHolidays: ui.bool({ label2: "Autoriser l'envoi les jours feriés", label: false }),
                    canInterrupt: ui.bool({ label2: 'Peut interrompre une conversation', label: false }),
                    allowNight: ui.bool({ label2: "Autoriser l'envoi la nuit (24h/24)", label: false }),
                    allowProcessed: ui.bool({ label2: "Autoriser l'envoi pour les conversations traitées", label: false }),
                },
            }),
            test: ui.group({
                items: {
                    aaa1: ui.textarea(),
                    aaa2: ui.int().optional(),
                    aaa3: ui.int().optional(),
                    aaa4: ui.int().optional(),
                    aaa5: ui.int().optional(),
                    aaa6: ui.int().optional(),
                    aaa7: ui.int().optional(),
                },
            }),
            audience: ui.group({
                label: 'Audience',
                items: {
                    via: ui.selectOneOptionId([
                        { id: 'sms', label: 'SMS' },
                        { id: 'email', label: 'Email' },
                        { id: 'push', label: 'Push' },
                    ]),
                    locations: ui.selectManyStrings(['Locomotive', 'Locomotive (Bis)'], {
                        label: 'Établissements',
                    }),
                    filter: ui.prompt({ label: 'Filtre' }),
                },
            }),
        }
    },

    run: async (sdk, ui) => {
        //
    },
})
