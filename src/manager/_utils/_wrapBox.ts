export const wrapBox = (
   //
   code: string,
   maxLines: number = 10,
   formatter?: (line: string) => string,
) => {
   const lines = code.split('\n')
   const totalLines = lines.length
   const logerThanMax = totalLines > maxLines
   const firstLines = lines.slice(0, maxLines)
   const maxLen = firstLines.reduce((acc, line) => Math.max(acc, line.length), 0)
   const box =
      `╔${'═'.repeat(maxLen + 2)}╗\n` +
      firstLines
         .map((line) => `║ ${formatter ? formatter(line.padEnd(maxLen)) : line.padEnd(maxLen)} ║`)
         .join('\n') +
      (logerThanMax ? `\n║ ... ${totalLines - maxLines} more lines ║` : '') +
      `\n╚${'═'.repeat(maxLen + 2)}╝`
   return box
}

export const withGutter = (code: string) => {
   const lines = code.split('\n')
   return lines
      .map((line, i) => `${(i + 1).toString().padStart(lines.length.toString().length)} | ${line}`)
      .join('\n')
}
