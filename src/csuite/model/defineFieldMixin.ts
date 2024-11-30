import type { Field } from './Field'

export function defineFieldMixin<T>(mixin: T & ThisType<Field & T>): T {
    return mixin
}
