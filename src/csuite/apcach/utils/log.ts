// ----------------------------------------------
const LOG_ON: boolean = false
/** log to the console when LOG_ON */

export function log(srt: unknown): void {
    if (LOG_ON) {
        // eslint-disable-next-line no-console
        console.log(srt)
    }
}
