// https://github.com/mobxjs/mobx/discussions/2850#discussioncomment-497321
// https://github.com/inoyakaigor/mobx-store-inheritance#readme
import type { AnnotationsMap, CreateObservableOptions } from 'mobx'

import { $mobx, isObservable, makeObservable } from 'mobx'

export const annotationsSymbol = Symbol()
// export const annotationsOverridesSymbol = Symbol()
const objectPrototype = Object.prototype

type Annotations<T extends object = object, U extends PropertyKey = never> = AnnotationsMap<T, U>

let miss: number = 0
export const makeAutoObservableInheritance = <
   T extends object & { [annotationsSymbol]?: any },
   AdditionalKeys extends PropertyKey = never,
>(
   target: T,
   overrides?: Annotations<T, NoInfer<AdditionalKeys>>,
   options?: CreateObservableOptions,
   onlyKeepTopNParentClasses?: number,
): T => {
   // Make sure nobody called makeObservable/makeAutoObservable/extendObservable/makeSimpleAutoObservable previously (eg in parent constructor)
   if (isObservable(target)) {
      throw new Error('Target must not be observable')
   }

   let annotations = target[annotationsSymbol]

   // if annotations are alreay cached in the class proto,
   // just use the cached annotations, and apply them to the target
   // (legacy comment) > Apply only annotations existed in target already
   // (legacy comment) > https://github.com/mobxjs/mobx/discussions/2850#discussioncomment-1396837
   if (annotations != null) {
      // const tmp = {} as Annotations<object, any>
      // for (const key in annotations) {
      //     if (key in target) {
      //         tmp[key] = annotations[key]
      //     }
      // }
      // annotations = tmp
      return makeObservable(target, annotations, options)
   } else {
      miss++
   }

   if (miss++ % 100 === 0) console.log(`[🤠] makeAutoObservableInheritance miss: ${miss}`)

   // 1. collect all targets by walking the prototype chain
   // (include the base instance itself)
   // [ target (inst), target class(proto), sub-class(proto), ...(protos), base class(proto)]
   const stack: T[] = []
   let cursor = target as T | null
   while (cursor && cursor !== objectPrototype) {
      stack.push(cursor)
      cursor = Object.getPrototypeOf(cursor)
   }

   // 🔶 2. filter the targets that haven't finish to instanciate
   // (assuming this function have been called with the proper number
   // of parent classes from the place where it has been called)
   if (onlyKeepTopNParentClasses != null) {
      const amountOfProtoToSkip = stack.length - onlyKeepTopNParentClasses - 1
      if (amountOfProtoToSkip > 0) stack.splice(1, amountOfProtoToSkip)
   }
   // 📋 (those skipeed classes will still be able to make their own properties
   // and proto methods observable if they want via autoExtendObservable)

   // Collect annotations
   annotations = {} as Annotations
   for (const current of stack) {
      Reflect.ownKeys(current).forEach((key) => {
         if (key === $mobx || key === 'constructor') return
         annotations![key] = !overrides
            ? true
            : key in overrides
              ? overrides[key as keyof typeof overrides]
              : true
      })
   }

   // Cache if class
   const proto = Object.getPrototypeOf(target)
   if (proto && proto !== objectPrototype) {
      Object.defineProperty(proto, annotationsSymbol, { value: annotations })
   }

   return makeObservable(target, annotations, options)
}
