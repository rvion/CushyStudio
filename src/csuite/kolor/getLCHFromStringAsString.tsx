/** return any color in oklch notation */
import Color from 'colorjs.io'

export function getLCHFromStringAsString(str: string): string {
   // empty case: let's have some default without generating any error
   if (str === '') return 'lch(.5 1 0)'

   try {
      const color = new Color(str)
      const [l, c, h_] = color.oklch
      const h = isNaN(h_!) ? 0 : h_
      return `lch(${fmtNum1(l! * 100)}% ${fmtNum2(c!)} ${fmtNum1(h!)})`
   } catch (e) {
      console.error(`[🔴] getLCHFromStringAsString FAILURE (string is: "${str}")`)
      return `lch(.5 1 0)`
   }
}

/** toFixed(2), but without the uncesseray leading 0 */
function fmtNum2(n: number): string {
   const s = n.toFixed(2)
   return s.endsWith('.00') //
      ? s.slice(0, -3)
      : s.endsWith('0')
        ? s.slice(0, -1)
        : s
}

/** toFixed(1), but without the uncesseray leading 0 */
function fmtNum1(n: number): string {
   const s = n.toFixed(1)
   return s.endsWith('.0') //
      ? s.slice(0, -2)
      : s
}
