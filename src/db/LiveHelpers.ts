export type Mixins<T> = {
   [k: string]: PropertyDescriptor & ThisType<T>
}

type Class<T> = {
   new (...args: any[]): T
}

export const MIX = <T>(TargetCls: Class<T>, mixins: Mixins<T>) => {
   return Object.defineProperties(TargetCls.prototype, mixins)
}

export const MERGE_PROTOTYPES = (TargetCls: Class<unknown>, SrcCls: Class<unknown>) => {
   return Object.defineProperties(TargetCls.prototype, Object.getOwnPropertyDescriptors(SrcCls.prototype))
}

// ⏸️ export const MERGE_PROTOTYPES_V2 = (TargetCls: Class<unknown>, SrcCls: Class<unknown>) => {
// ⏸️     const to_copy = Object.getOwnPropertyDescriptors(SrcCls.prototype)
// ⏸️     for (const key in to_copy) {
// ⏸️         if (key === 'constructor') delete to_copy[key]
// ⏸️         to_copy[key].enumerable = true
// ⏸️     }
// ⏸️     console.log(`[🤠] to_copy=`, to_copy)
// ⏸️     return Object.defineProperties(TargetCls.prototype, to_copy)
// ⏸️ }

export const DEPENDS_ON = (x: any) => {}
