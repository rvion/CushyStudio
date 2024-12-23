app({
   metadata: {
      name: '🚂 locomotive scenario',
      description: 'Show form capabilities to fulfill complex requirements unrelated to Stable diffusion.',
   },
   ui: (b) =>
      b.fields({
         name: b.string({ label: 'Scénario', default: 'iscab code A' }),
         source: b.group({
            label: 'Source des Données',
            items: {
               source: b.selectOneString(['ISCAB - Liens de borne']),
               maxEvents: b.int({ min: 1, max: 5000, default: 10, step: 100 }),
               actif: b.bool(),
            },
         }),
         template: b.prompt({ label: 'Template par défaut' }),
         signature: b.group({
            label: false,
            collapsed: false,
            items: {
               signature: b.string({ label: 'Signature par défaut' }),
               assigner: b.selectOneString(['Assigner', 'Ne pas assigner']),
            },
         }),
         date: b.group({
            label: false,
            collapsed: false,
            items: {
               at: b.choice(
                  {
                     computed: b.group({
                        // having both `collapsed` and `label` false skip the whole label line
                        border: false,
                        collapsed: false,
                        label: 'Calculée',

                        items: {
                           [`D'après la`]: b.selectOneString(['Date de création', 'Date de modification']),
                           offset: b.int({ label: 'à J+' }),
                           // time: ui.int({ label: 'Heure' /* suffix: 'min' */ }),
                           heure: b.stringTime({ default: '10:30' }),
                           limit: b.int({ label: 'Limite /jour', default: 200 }),
                        },
                     }),
                     onEventRecetption: b.group({}),
                     fixed: b.group({}),
                  },
                  { label: 'Date', appearance: 'tab', border: false },
               ),
               allowHolidays: b.bool({ label2: "Autoriser l'envoi les jours feriés", label: false }),
               canInterrupt: b.bool({ label2: 'Peut interrompre une conversation', label: false }),
               allowNight: b.bool({ label2: "Autoriser l'envoi la nuit (24h/24)", label: false }),
               allowProcessed: b.bool({
                  label2: "Autoriser l'envoi pour les conversations traitées",
                  label: false,
               }),
            },
         }),
         test: b.group({
            items: {
               aaa1: b.textarea(),
               aaa2: b.int().optional(),
               aaa3: b.int().optional(),
               aaa4: b.int().optional(),
               aaa5: b.int().optional(),
               aaa6: b.int().optional(),
               aaa7: b.int().optional(),
            },
         }),
         audience: b.group({
            label: 'Audience',
            items: {
               via: b.selectOneOptionId([
                  { id: 'sms', label: 'SMS' },
                  { id: 'email', label: 'Email' },
                  { id: 'push', label: 'Push' },
               ]),
               locations: b.selectManyStrings(['Locomotive', 'Locomotive (Bis)'], {
                  label: 'Établissements',
               }),
               filter: b.prompt({ label: 'Filtre' }),
            },
         }),
      }),

   run: async (sdk, ui) => {
      //
   },
})
