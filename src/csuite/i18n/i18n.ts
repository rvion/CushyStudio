export type SupportedCSuiteLang = 'en' | 'fr'

export const csuite_i18n_en = {
   langCode: 'en' as SupportedCSuiteLang,
   lang: 'English',
   misc: {
      words: {
         empty: 'empty',
      },
   },
   err: {
      int: {
         // config
         minGreaterThanMax: ({ min, max }: { min: number; max: number }): string =>
            `Min (${min}) must be less than max (${max}).`,
         minSameThanMax: ({ minmax }: { minmax: number }): string =>
            `Max and Min (${minmax}) are set to the same value.`,
         defaultTooSmall: ({ min, def }: { min: number; def: number }): string => `default (${def}) must be greater than min (${min}).`, // prettier-ignore
         defaultTooBig: ({ def, max }: { def: number; max: number }): string =>
            `default (${def}) must be smaller than max (${max}).`,
      },
      str: {
         // config
         minLengthGreaterThanMaxLength: ({ min, max }: { min: number; max: number }): string => `min-length (${min}) must be less than max-length (${max}).`, // prettier-ignore
         minLengthSameThanMaxLength: ({ minmax }: { minmax: number }): string => `max-length and min-length (${minmax}) must not be the same value.`, // prettier-ignore
         defaultTooSmall: ({ min, def }: { min: number; def: number }): string => `default (${def}) must be greater than min (${min}).`, // prettier-ignore
         defaultTooBig: ({ def, max }: { def: number; max: number }): string =>
            `default (${def}) must be smaller than max (${max}).`,
         // value
         tooShort: ({ min }: { min: number }): string => `Must be at least ${min} characters`,
         tooLong: ({ max }: { max: number }): string => `Must be at most ${max} characters`,
         required: ({ prefix }: { prefix: string }): string => `${prefix} is required`,
         pattern: ({ pattern }: { pattern: string }): string => `Invalid format`,
      },
      email: {
         invalid: `Invalid email address`,
      },
      field: {
         not_set: 'Field is not set',
         defaultExplicitelySetToNullButFieldNotNullable: 'Default value is explicitely set to null, but field is not nullable', // prettier-ignore
      },
      selectMany: {
         required: (): string => `At least one value must be selected`,
         notEnoughValues: ({ min }: { min: number }): string => `At least ${min} values must be selected`,
      },
   },
   ui: {
      selectMany: {
         selectAll: 'Select all',
         selectNone: 'Select none',
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
   misc: {
      words: {
         empty: 'Vide',
      },
   },
   err: {
      int: {
         minGreaterThanMax: ({ min, max }: { min: number; max: number }) =>
            `Min (${min}) doit être inférieur à max (${max})`,
         minSameThanMax: ({ minmax }: { minmax: number }) =>
            `Min et max (${minmax}) sont définis à la même valeur`,
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
         required: ({ prefix }: { prefix: string }) => `Le champ ${prefix.toLowerCase()} est obligatoire`,
         pattern: ({ pattern }: { pattern: string }) => `Format incorrect`,
      },
      field: {
         not_set: 'Valeur manquante',
         defaultExplicitelySetToNullButFieldNotNullable: 'La valeur par défaut est explicitement définie à null, mais le champ n\'est pas nullable', // prettier-ignore
      },
      email: {
         invalid: `Adresse email invalide`,
      },
      selectMany: {
         required: (): string => `Au moins une valeur doit être sélectionnée`,
         notEnoughValues: ({ min }: { min: number }) => `Au moins ${min} valeurs doivent être sélectionnées`,
      },
   },
   ui: {
      selectMany: {
         selectAll: 'Tout sélectionner',
         selectNone: 'Tout désélectionner',
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
