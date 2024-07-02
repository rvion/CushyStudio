import * as icons from '@mdi/js'

// Prefixed with _ to not pollute intellisense since this needs to be exported to use in the main icon file.
export const _CushyIcons = {
    /* Inherited Icons */
    cdiDraft: icons.mdiPencil,
    cdiApp: icons.mdiAbacus,
    cdiStep: icons.mdiAccessPoint,
    cdiPreset: icons.mdiAccessPoint,

    cdiExternalCivitai: icons.mdiCityVariant,
    cdiExternalSquoosh: icons.mdiCigar,

    /* Custom Icons */
    cdiTest: 'M 2.40,7.20 A 20,20 0,0,1 12.00,7.20 A 20,20 0,0,1 21.60,7.20 Q 21.60,14.40 12.00,21.60 Q 2.40,14.40 2.40,7.20 z',

    cdiNodes:
        'M 16,5 C 16,3.89 15.1,3 14,3 H 8 C 6.8954305,3 6,3.8954305 6,5 v 3 c 0,1 1,2 2,2 V 7 6 h 6 V 8 H 8 v 2 h 6 c 1,0 2,-1 2,-2 V 5 h 1 c 1,0 1,1 1,1 h 2 c 1,0 1,1 1,1 v 10 c 0,0 0,1 -1,1 h -5 c 0,0 0,1 -1,1 v -3 h -1 v 3 c 0,0 0,2 -2,2 V 19 17 H 5 v 2 h 6 v 2 H 5 C 3,21 3,19 3,19 v -3 c 0,0 0,-2 2,-2 h 6 c 2,0 2,2 2,2 h 1 c 1,0 1,1 1,1 h 5 V 16 7 h -2 c 0,1 -1,1 -1,1 V 5 Z',
}
