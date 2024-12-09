import { formatDateTimeEN_US, formatDateTimeFR, parseDateTimeEN_US, parseDateTimeFR } from './date-utils'
import { formatNumberEN, formatNumberFR, parseNumberEN, parseNumberFR } from './number-utils'

export type SupportedCSuiteLang = 'en' | 'fr'
export type DateFormat = 'date' | 'datetime'
export const NumberFormats = ['int', 'float', 'amount'] as const
export type NumberFormat = (typeof NumberFormats)[number]

export const csuite_i18n_en = {
   langCode: 'en' as SupportedCSuiteLang,
   lang: 'English',
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
      number: {
         notANumber: 'Enter a valid number',
         greaterThanMax: ({ max }: { max: number }): string => `Must be less than or equal to ${max}`,
         lessThanMin: ({ min }: { min: number }): string => `Must be greater than or equal to ${min}`,
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
      date: {
         invalid: `Invalid date`,
      },
   },
   ui: {
      selectMany: {
         selectAll: 'Select all',
         selectNone: 'Select none',
      },
      field: {
         empty: 'Empty',
      },
      date: {
         parse: parseDateTimeEN_US,
         format: formatDateTimeEN_US,
      },
      number: {
         parse: parseNumberEN,
         format: formatNumberEN,
      },
      select: {
         noResults: 'No results',
         create: 'Create',
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
         minGreaterThanMax: ({ min, max }: { min: number; max: number }): string =>
            `Min (${min}) doit être inférieur à max (${max})`,
         minSameThanMax: ({ minmax }: { minmax: number }): string =>
            `Min et max (${minmax}) sont définis à la même valeur`,
         defaultTooSmall: ({ min, def }: { min: number; def: number }): string => `Le défaut (${def}) doit être supérieur à min (${min})`, // prettier-ignore
         defaultTooBig: ({ def, max }: { def: number; max: number }): string => `Le défaut (${def}) doit être inférieur à max (${max})`, // prettier-ignore
      },
      number: {
         notANumber: 'Renseignez un nombre valide',
         greaterThanMax: ({ max }: { max: number }): string => `Doit être inférieur ou égal à ${max}`,
         lessThanMin: ({ min }: { min: number }): string => `Doit être supérieur ou égal à ${min}`,
      },
      str: {
         // config
         minLengthGreaterThanMaxLength: ({ min, max }: { min: number; max: number }): string => `min-length (${min}) doit être inférieur à max-length (${max}).`, // prettier-ignore
         minLengthSameThanMaxLength: ({ minmax }: { minmax: number }): string => `max-length et min-length (${minmax}) ne doivent pas être la même valeur.`, // prettier-ignore
         defaultTooSmall: ({ min, def }: { min: number; def: number }): string => `Le défaut (${def}) doit etre plus long que min-length (${min}).`, // prettier-ignore
         defaultTooBig: ({ def, max }: { def: number; max: number }): string => `Le défaut (${def}) doit etre plus court que max-length (${max}).`, // prettier-ignore
         // value
         tooShort: ({ min }: { min: number }): string =>
            `Doit contenir au moins ${min === 1 ? 'un caractère' : `${min} caractères`}`,
         tooLong: ({ max }: { max: number }): string =>
            `Doit contenir au plus ${max === 1 ? 'un caractère' : `${max} caractères`}`,
         required: ({ prefix }: { prefix: string }): string =>
            `Le champ ${prefix.toLowerCase()} est obligatoire`,
         pattern: ({ pattern }: { pattern: string }): string => `Format incorrect`,
      },
      email: {
         invalid: `Adresse email invalide`,
      },
      field: {
         not_set: 'Valeur manquante',
         defaultExplicitelySetToNullButFieldNotNullable: 'La valeur par défaut est explicitement définie à null, mais le champ n\'est pas nullable', // prettier-ignore
      },
      selectMany: {
         required: (): string => `Au moins une valeur doit être sélectionnée`,
         notEnoughValues: ({ min }: { min: number }): string =>
            `Au moins ${min} valeurs doivent être sélectionnées`,
      },
      date: {
         invalid: `Date invalide`,
      },
   },
   ui: {
      selectMany: {
         selectAll: 'Tout sélectionner',
         selectNone: 'Tout désélectionner',
      },
      field: {
         empty: 'Vide',
      },
      date: {
         parse: parseDateTimeFR,
         format: formatDateTimeFR,
      },
      number: {
         parse: parseNumberFR,
         format: formatNumberFR,
      },
      select: {
         noResults: 'Aucun résultat',
         create: 'Créer',
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
