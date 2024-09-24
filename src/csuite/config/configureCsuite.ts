/** GLOBAL CONFIG */
import type { CsuiteI18nConfig, SupportedCSuiteLang } from '../i18n/i18n'

import { csuite_i18n_en, csuite_languages_UNSAFE } from '../i18n/i18n'

// #region config
export type CSuiteConfig = {
    lang: string
    i18n: CsuiteI18nConfig
    isDev: boolean
}

export const csuiteConfig: CSuiteConfig = {
    lang: 'en',
    i18n: csuite_i18n_en,
    isDev: false,
}

// #region override
export type CSuiteConfigOverride = {
    lang?: SupportedCSuiteLang
    langDefinition?: CsuiteI18nConfig
    isDev?: boolean
}

export const configureCsuite = (xx: CSuiteConfigOverride) => {
    const { lang, langDefinition, isDev } = xx

    // assign lang by name
    if (lang != null) {
        const i18n = csuite_languages_UNSAFE[lang]
        if (i18n == null) {
            console.error(`❌ configureCsuite > invalid lang: "${lang}" `)
        } else {
            Object.assign(csuiteConfig, {
                lang: lang,
                i18n: csuite_languages_UNSAFE[lang],
            })
        }
    }

    // assign lang by dict
    if (langDefinition != null) {
        // TODO: check config is valid
        Object.assign(csuiteConfig, {
            lang: langDefinition.lang,
            i18n: langDefinition,
        })
    }

    //  assign isDev
    if (isDev != null) {
        csuiteConfig.isDev = isDev
    }
}
