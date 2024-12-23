// ------------------------------------------------------------------
// quick and dirty way to configure frame to use either style or className

export type FrameMode = 'CLASSNAME' | 'STYLE'
export let frameMode: FrameMode = Math.random() > 1 ? 'STYLE' : 'CLASSNAME'

export const configureFrameEngine = (mode: FrameMode): void => {
   frameMode = mode
}
