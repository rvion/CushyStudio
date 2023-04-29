import type { ComfySetup, LoadImage } from '../global'
import type { Presets } from '../core-back/presets'
import type { FlowRun } from './FlowRun'

// prettier-ignore
export type LATER<T>
    // should be generated
    = T extends 'ComfySetup' ? ComfySetup
    : T extends 'LoadImage' ? LoadImage

    // those need to be mocked
    : T extends 'FlowRun' ? FlowRun
    // : T extends 'Presets' ? Presets
    : any
