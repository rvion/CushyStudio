/**
 * allow to check if a function is a constructor or a closure
 *
 * (made for schema.useClass(...) to support both dynamic class via lambda,
 * or statically known classes via simply passing the constructor)
 */
export function checkLambdaOrCtor(ctor: any): 'ctor' | 'closure' {
   if (ctor.prototype && ctor.prototype.constructor === ctor) {
      return 'ctor'
   }
   return 'closure'
}
