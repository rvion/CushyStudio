type ExpandKV<T> = T extends object ? { [P in keyof T]: T[P] } : T

type Combine<T> = T extends [infer A, ...infer B] ? ExpandKV<A> & Combine<B> : {}

export const combine = <T extends [any, ...any[]]>(...objects: T): Combine<T> => {
   const source = objects.shift()
   const mixins = objects
   for (const minxin of mixins) {
      const mixinData = Object.getOwnPropertyDescriptors(minxin)
      Object.defineProperties(source, mixinData)
      const mixinProtoProps = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(minxin))
      Object.defineProperties(source, mixinProtoProps)
   }
   return source
}
