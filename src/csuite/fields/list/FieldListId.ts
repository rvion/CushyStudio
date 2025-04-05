/**
 * must handle any number up to Number.MAX_SAFE_INTEGER
 * and be reversible via `stringToNumber`
 */
export function numberToListKey(num: number): string {
   if (num === 0) return '0'
   if (num < 0) throw new Error('Negative numbers are not supported')
   if (num > Number.MAX_SAFE_INTEGER) throw new Error('Number exceeds maximum safe integer')
   const str = num.toString(36)
   return str
}

export function listKeyToNumber(str: string): number {
   if (str === '0') return 0
   const num = parseInt(str, 36)
   if (isNaN(num)) throw new Error('Invalid string format')
   if (num < 0) throw new Error('Negative numbers are not supported')
   if (num > Number.MAX_SAFE_INTEGER) throw new Error('Number exceeds maximum safe integer')
   return num
}
