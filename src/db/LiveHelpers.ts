export type Mixins<T> = {
    [k: string]: PropertyDescriptor & ThisType<T>
}

type Class<T> = {
    new (...args: unknown[]): T
}

export const MIX = <T>(TargetCls: Class<T>, mixins: Mixins<T>) => {
    return Object.defineProperties(TargetCls.prototype, mixins)
}

export const MERGE_PROTOTYPES = (TargetCls: Class<unknown>, SrcCls: Class<unknown>) => {
    return Object.defineProperties(TargetCls.prototype, Object.getOwnPropertyDescriptors(SrcCls.prototype))
}

export const DEPENDS_ON = (x: any) => {}
