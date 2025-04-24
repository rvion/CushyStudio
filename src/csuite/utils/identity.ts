export function ALWAYS() {
   return true
}
export function NEVER() {
   return false
}
export function IDENTITY<V extends any>(v: V): V {
   return v
}
