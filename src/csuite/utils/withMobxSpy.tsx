import isSymbol from 'lodash/isSymbol'
import { spy } from 'mobx'

export const withMobxSpy = <T,>(
   fn: () => T,
   p: {
      //
      logEv?: boolean
   } = {},
): T => {
   const startedAt = Date.now()
   const count = new Map<string, number>()
   const incc = (name: string): void => {
      const c = count.get(name) ?? 0
      count.set(name, c + 1)
   }
   const cancel = spy((ev) => {
      let indent = 0
      if (ev.type === 'report-end') {
         indent--
      } else {
         indent++
         incc(`__${ev.type}`)
         incc(`__${ev.type}:at${indent}`)

         if (ev.type === 'add' || ev.type === 'remove') {
            if (p?.logEv ?? false)
               console.log(`[👀]${'  '.repeat(indent)} ${ev.type} ${(ev as any).name}`, ev)
            const namexxx = isSymbol((ev as any).name) //
               ? (ev as any).name.toString()
               : (ev as any).name
            incc(`${ev.type}:${namexxx}`)
         } else {
            if (p?.logEv ?? false) console.log(`[👀]${'  '.repeat(indent)} ${ev.type}`, ev)
         }
      }
   })
   const t = fn()
   cancel()
   const endedAt = Date.now()
   console.table(
      [
         //
         ['⏰ duration', endedAt - startedAt],
         ...count.entries(),
      ].toSorted((a: any, b: any) => b[1] - a[1]),
   )
   return t
}
