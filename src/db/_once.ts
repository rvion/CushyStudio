// 💬 2025-02-12 rvion:
// this is a copy-pasta from the tc39 decorator proposal
// github readme, showing the type the decorator.
// https://github.com/tc39/proposal-decorators?tab=readme-ov-file#class-methods
type ClassMethodDecorator<T extends () => any> = (
   value: T,
   context: {
      kind: 'method'
      name: string | symbol
      access: { get(): unknown }
      static: boolean
      private: boolean
      addInitializer(initializer: () => void): void
   },
) => T | void

// 💬 2025-02-12 rvion: I don't know what I'm doing
export function once(value: any, { kind, name }: any) {
   if (kind === 'method') {
      let CACHE: any
      let DONE = false
      return function (this: any, ...args: any[]): any {
         if (DONE) return CACHE
         const ret = value.call(this, ...args)
         DONE = true
         CACHE = ret
         return ret
      }
   }
}
