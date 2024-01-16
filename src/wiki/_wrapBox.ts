export const wrapBox = (code: string, maxLines: number = 10) => {
    const lines = code.split('\n')
    const totalLines = lines.length
    const logerThanMax = totalLines > maxLines
    const firstLines = lines.slice(0, maxLines)
    const maxLen = firstLines.reduce((acc, line) => Math.max(acc, line.length), 0)
    const box =
        `╔${'═'.repeat(maxLen + 2)}╗\n` +
        firstLines.map((line) => `║ ${line.padEnd(maxLen)} ║`).join('\n') +
        (logerThanMax ? `\n║ ... ${totalLines - maxLines} more lines ║` : '') +
        `\n╚${'═'.repeat(maxLen + 2)}╝`
    return box
}
