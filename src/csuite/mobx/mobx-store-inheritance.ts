// https://github.com/mobxjs/mobx/discussions/2850#discussioncomment-497321
// https://github.com/inoyakaigor/mobx-store-inheritance#readme
import { $mobx, AnnotationsMap, CreateObservableOptions, isObservable, makeObservable } from 'mobx'

const annotationsSymbol = Symbol()
const objectPrototype = Object.prototype

type Annotations<T extends Object = Object, U extends PropertyKey = never> = AnnotationsMap<T, U>

export const makeAutoObservableInheritance = <
    T extends object & { [annotationsSymbol]?: any },
    AdditionalKeys extends PropertyKey = never,
>(
    target: T,
    overrides?: Annotations<T, NoInfer<AdditionalKeys>>,
    options?: CreateObservableOptions,
): T => {
    // Make sure nobody called makeObservable/makeAutoObservable/extendObservable/makeSimpleAutoObservable previously (eg in parent constructor)
    if (isObservable(target)) {
        throw new Error('Target must not be observable')
    }

    let annotations = target[annotationsSymbol]

    if (!annotations) {
        annotations = {} as Annotations

        let current = target as T | null
        while (current && current !== objectPrototype) {
            Reflect.ownKeys(current).forEach((key) => {
                if (key === $mobx || key === 'constructor') return
                annotations![key] = !overrides ? true : key in overrides ? overrides[key as keyof typeof overrides] : true
            })

            current = Object.getPrototypeOf(current)
        }

        // Cache if class
        const proto = Object.getPrototypeOf(target)
        if (proto && proto !== objectPrototype) {
            Object.defineProperty(proto, annotationsSymbol, { value: annotations })
        }
    } else {
        // Apply only annotations existed in target already
        // https://github.com/mobxjs/mobx/discussions/2850#discussioncomment-1396837
        const tmp = {} as Annotations<Object, any>
        for (const key in annotations) {
            if (key in target) {
                tmp[key] = annotations[key]
            }
        }
        annotations = tmp
    }

    return makeObservable(target, annotations, options)
}
