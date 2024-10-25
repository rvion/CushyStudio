export class Namer {
   outputNamer: { [key: string]: number } = {}
   constructor() {}

   name = (txt: string): string => {
      const at = (this.outputNamer[txt] ??= 0)
      const out = at === 0 ? txt : `${txt}_${at}`
      this.outputNamer[txt]++
      // console.log(this.outputNamer[txt])
      return out
   }
}
