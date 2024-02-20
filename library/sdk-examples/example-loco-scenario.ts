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
                    source: ui.selectOne({ choices: [{ id: 'a', label: 'ISCAB - Liens de borne' }] }),
                    maxEvents: ui.int({ min: 1, max: 5000, default: 10, step: 100 }),
                    actif: ui.bool(),
                },
            }),
            template: ui.prompt({ label: 'Template par défaut' }),
            signature: ui.group({
                label: false,
                collapsible: false,
                items: {
                    signature: ui.string({ label: 'Signature par défaut' }),
                    assigner: ui.selectOneV2(['Assigner', 'Ne pas assigner']),
                },
            }),
            date: ui.group({
                label: false,
                collapsible: false,
                items: {
                    at: ui.choice({
                        label: 'Date',
                        appearance: 'tab',
                        items: {
                            ['Calculée']: ui.group({
                                collapsible: false,
                                label: false,
                                items: {
                                    [`D'après la`]: ui.selectOneV2(['Date de création', 'Date de modification']),
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
            audience: ui.group({
                label: 'Audience',
                items: {
                    via: ui.selectOne({
                        label: 'Via',
                        choices: [
                            { id: 'sms', label: 'SMS' },
                            { id: 'email', label: 'Email' },
                            { id: 'push', label: 'Push' },
                        ],
                    }),
                    locations: ui.selectMany({
                        label: 'Établissements',
                        choices: [
                            { id: 'a', label: 'Locomotive' },
                            { id: 'b', label: 'Locomotive (Bis)' },
                        ],
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
