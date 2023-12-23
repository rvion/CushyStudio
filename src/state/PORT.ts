const mode = process.env['CUSHY_RUN_MODE']
if (mode == null) throw new Error('CUSHY_RUN_MODE is not defined')
const allowedModes = ['dev', 'dist']
if (!allowedModes.includes(mode)) {
    console.error(`CUSHY_RUN_MODE is not allowed: ${mode}`)
    process.exit(1)
}

export const CUSHY_PORT =
    mode === 'dist' //
        ? 8688
        : 8788
