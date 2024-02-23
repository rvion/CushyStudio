import type { IJsonModel } from 'flexlayout-react'
import type { ThemeName } from 'src/theme/ThemeManager'

// import { ComfyHostID } from './ComfyHostDef'

export type PreferedFormLayout = 'mobile' | 'dense' | 'auto'

export type ConfigFile = {
    /** this will allow you to enable typechecking for folders you manage */
    githubUsername?: string
    /** @default to './completions/danbooru.csv' */
    tagFile?: string

    OPENROUTER_API_KEY?: string

    /** this is the set of custom trigger owrds associated to your loras */
    loraPrompts?: {
        [loraName: string]: {
            text?: string
            url?: string
        }
    }

    /** setting this option will make 'Edit App Definition' attempt to use this text editor first, then code/codium, then the system default text editor */
    preferredTextEditor?: string

    /** prefer dense form */
    preferedFormLayout?: PreferedFormLayout
    ['draft.mockup-mobile']?: boolean

    // favoriteApps?: CushyAppID[]
    /* list of all comfyUI setup available */
    // comfyUIHosts?: ComfyHostDef[]

    /** default: 1 */
    numberSliderSpeed?: number

    mainComfyHostID?: Maybe<HostID>
    enableTypeCheckingBuiltInApps?: boolean
    /** 'light' or 'dark'; default to dark */
    theme?: ThemeName
    /** cloud service api key */
    cushyCloudGPUApiKey?: string
    // ---------------------------------------------------------------------------------------
    /** defaults to 48px */
    outputPreviewSize?: number
    historyAppSize?: number
    latentPreviewSize?: number

    // ---------------------------------------------------------------------------------------
    /** if true, will auto-open devtools on startup */
    preferDevToolsOpen?: boolean
    /** defaults to 5 */
    checkUpdateEveryMinutes?: number
    /**
     * pick stable if you want an happy life
     * pick 'dev' if you like burning things
     * possible valules: 'stable' | 'dev'
     */
    releaseChannel?: 'stable' | 'dev'

    /**
     * show hovered preview in the main output panel
     * @default true
     */
    showPreviewInPanel?: boolean

    /** named perspectives */
    layouts_v12?: { [perspectiveName: string]: IJsonModel }
    // bad place to store that
    stars?: { [actionPackName: string]: { at: Timestamp; stars: number } }
    packs?: { [actionPackName: string]: { installed: boolean } }
    // ----------------------

    showPromptPluginPreview?: boolean
    showPromptPluginReorder?: boolean
    showPromptPluginWeights?: boolean
    showPromptPluginLora?: boolean
    showPromptPluginAst?: boolean
    showPromptPluginShortcuts?: boolean
}

export type ReleaseChannels = 'stable' | 'dev'
