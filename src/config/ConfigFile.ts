import type { IJsonModel } from 'flexlayout-react'
import type { ThemeName } from 'src/theme/ThemeManager'
// import { ComfyHostID } from './ComfyHostDef'

export type PreferedFormLayout = 'mobile' | 'dense' | 'auto'

export type ConfigFile = {
    /** this will allow you to enable typechecking for folders you manage */
    githubUsername?: string

    OPENROUTER_API_KEY?: string

    /** this is the set of custom trigger owrds associated to your loras */
    loraPrompts?: {
        [loraName: string]: {
            text?: string
            url?: string
        }
    }

    /** prefer dense form */
    preferedFormLayout?: PreferedFormLayout
    ['draft.mockup-mobile']?: boolean

    favoriteApps?: CushyAppID[]
    /* list of all comfyUI setup available */
    // comfyUIHosts?: ComfyHostDef[]

    mainComfyHostID?: Maybe<HostID>
    enableTypeCheckingBuiltInApps?: boolean
    /** 'light' or 'dark'; default to dark */
    theme?: ThemeName
    /** cloud service api key */
    cushyCloudGPUApiKey?: string
    /** defaults to 48px */
    outputPreviewSize?: number
    historyAppSize?: number
    latentPreviewSize?: number
    /** defaults to 48px */
    galleryImageSize?: number
    /** defaults to 50 */
    galleryMaxImages?: number
    /** defaults to 50 */
    galleryBgColor?: string
    /** opacity of hovered images */
    galleryHoverOpacity?: number
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
     * if true, hovering any image in the ui will scale the image
     * so it use all screen real estate rather than be limited by its
     * base size
     * @default false
     */
    showPreviewInFullScreen?: boolean

    /**
     * show hovered preview in the main output panel
     * @default true
     */
    showPreviewInPanel?: boolean

    /** named perspectives */
    layouts_v8?: { [perspectiveName: string]: IJsonModel }
    // bad place to store that
    stars?: { [actionPackName: string]: { at: Timestamp; stars: number } }
    packs?: { [actionPackName: string]: { installed: boolean } }
}

export type ReleaseChannels = 'stable' | 'dev'
