/** micro bench */
export const microbench = async (title: string, cb: () => Promise<void>) => {
    const A = process.hrtime.bigint() // TIMER start
    let x = await cb()
    const B = process.hrtime.bigint() // TIMER end
    const ms = Number(B - A) / 1_000_000
    console.log(`[🏎️] ${title} [${ms.toFixed(1)}ms]`) // debug
}
