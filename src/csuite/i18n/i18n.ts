export type SupportedCSuiteLang = 'en' | 'fr'

export const csuite_i18n_en = {
    langCode: 'en' as SupportedCSuiteLang,
    lang: 'English',
    err: {
        int: {
            // config
            minGreaterThanMax: ({ min, max }: { min: number; max: number }) => `Min (${min}) must be less than max (${max}).`,
            minSameThanMax: ({ minmax }: { minmax: number }) => `Max and Min (${minmax}) are set to the same value.`,
            defaultTooSmall: ({ min, def }: { min: number; def: number }) => `default (${def}) must be greater than min (${min}).`, // prettier-ignore
            defaultTooBig: ({ def, max }: { def: number; max: number }) => `default (${def}) must be smaller than max (${max}).`,
        },
        str: {
            // config
            minLengthGreaterThanMaxLength: ({ min, max }: { min: number; max: number }) => `min-length (${min}) must be less than max-length (${max}).`, // prettier-ignore
            minLengthSameThanMaxLength: ({ minmax }: { minmax: number }) => `max-length and min-length (${minmax}) must not be the same value.`, // prettier-ignore
            defaultTooSmall: ({ min, def }: { min: number; def: number }) => `default (${def}) must be greater than min (${min}).`, // prettier-ignore
            defaultTooBig: ({ def, max }: { def: number; max: number }) => `default (${def}) must be smaller than max (${max}).`,
            // value
            tooShort: ({ min }: { min: number }) => `Must be at least ${min} characters`,
            tooLong: ({ max }: { max: number }) => `Must be at most ${max} characters`,
        },
        field: {
            not_set: 'Field is not set',
            defaultExplicitelySetToNullButFieldNotNullable: 'Default value is explicitely set to null, but field is not nullable', // prettier-ignore
        },
    },
    langs: {
        en: 'English',
        fr: 'French',
    },
}

export type CsuiteI18nConfig = typeof csuite_i18n_en

export const csuite_i18n_fr: CsuiteI18nConfig = {
    langCode: 'fr' as SupportedCSuiteLang,
    lang: 'Français',
    err: {
        int: {
            minGreaterThanMax: ({ min, max }: { min: number; max: number }) => `Min (${min}) doit être inférieur à max (${max})`,
            minSameThanMax: ({ minmax }: { minmax: number }) => `Min et max (${minmax}) sont définis à la même valeur`,
            defaultTooSmall: ({ min, def }: { min: number; def: number }) => `Le défaut (${def}) doit être supérieur à min (${min})`, // prettier-ignore
            defaultTooBig: ({ def, max }: { def: number; max: number }) => `Le défaut (${def}) doit être inférieur à max (${max})`, // prettier-ignore
        },
        str: {
            // config
            minLengthGreaterThanMaxLength: ({ min, max }: { min: number; max: number }) => `min-length (${min}) doit être inférieur à max-length (${max}).`, // prettier-ignore
            minLengthSameThanMaxLength: ({ minmax }: { minmax: number })  => `max-length et min-length (${minmax}) ne doivent pas être la même valeur.`, // prettier-ignore
            defaultTooSmall: ({ min, def }: { min: number; def: number }) => `Le défaut (${def}) doit etre plus long que min-length (${min}).`, // prettier-ignore
            defaultTooBig: ({ def, max }: { def: number; max: number }) => `Le défaut (${def}) doit etre plus court que max-length (${max}).`, // prettier-ignore
            // value
            tooShort: ({ min }: { min: number }) => `Doit contenir au moins ${min} caractères`,
            tooLong: ({ max }: { max: number }) => `Doit contenir au plus ${max} caractères`,
        },
        field: {
            not_set: 'Valeur manquante (not set)',
            defaultExplicitelySetToNullButFieldNotNullable: 'La valeur par défaut est explicitement définie à null, mais le champ n\'est pas nullable', // prettier-ignore
        },
    },
    langs: {
        en: 'Anglais',
        fr: 'Français',
    },
}

export const csuite_languages: {
    [key in SupportedCSuiteLang]: CsuiteI18nConfig
} = {
    en: csuite_i18n_en,
    fr: csuite_i18n_fr,
}

export const csuite_languages_UNSAFE: {
    [key: string]: CsuiteI18nConfig
} = csuite_languages