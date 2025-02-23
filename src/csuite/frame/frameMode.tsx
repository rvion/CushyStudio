// ------------------------------------------------------------------
// quick and dirty way to configure frame to use either style or className

export type FrameMode = 'CLASSNAME' | 'STYLE'
// eslint-disable-next-line no-constant-condition
export let frameMode: FrameMode = 1 - 1 === 1 ? 'STYLE' : 'CLASSNAME'

export const configureFrameEngine = (mode: FrameMode): void => {
   frameMode = mode
}
