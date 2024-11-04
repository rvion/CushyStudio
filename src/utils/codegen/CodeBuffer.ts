/** this class is used to buffer text and then write it to a file */
export class CodeBuffer {
   public tab: string = '   '
   constructor(
      private _indent: number = 0,
      lines: string[] = [],
   ) {
      for (const line of lines) this.writeLine(line)
   }

   content: string = ''

   // #region adding text
   newLine = (): string => (this.content += '\n')
   line = (...txts: string[]): this => this.writeLine(txts.join(''))
   append = (str: string): string => (this.content += str)
   writeLine = (txt: string): this => {
      this.content +=
         txt
            .split('\n')
            .map((line) => repeatStr(this._indent, this.tab) + line)
            .join('\n') + '\n'
      return this
   }
   w = (txt: string, opts: { if: boolean } = { if: true }): void => {
      if (opts.if) this.writeLine(txt)
   }

   // #region indentations
   indent = (): number => this._indent++
   deindent = (): number => this._indent--
   indented = (fn: () => void): void => {
      this._indent++
      fn()
      this._indent--
   }

   bar = (text: string): void => this.w(renderBar(text, '// '))

   // writeTS = (path: string) => {
   //     // const prefix = `// FILE GENERATED: do not edit. Changes made manually will be overwritten.\n\n`
   //     // const outPretty = prefix + prettify(this.content)
   //     const outPretty = prettify(this.content)
   //     writeFileSync(path, outPretty, 'utf-8')
   // }
}

export const repeatStr = (x: number, str: string): string => {
   let out = ''
   for (let i = 0; i < x; i++) out += str
   return out
}

export const renderBar = (text: string, prefix: string = ''): string => {
   const ___bar___ = '============================================================================='
   return (
      `${prefix}|${___bar___}|\n` +
      `${prefix}| ${text} ${repeatStr(___bar___.length - text.length - 4, ' ')}  |\n` +
      `${prefix}|${___bar___}|`
   )
}
