import type { CSchema } from '../model/CSchema'
import type { Field } from '../model/Field'

import { getUIDForMemoryStructure } from '../utils/getUIDForMemoryStructure'

export const hashJSONObjectToNumber = (obj: object): number => hashStringToNumber(stableStringify(obj))

export const hashPrimitiveToNumber = (s: string | null | boolean | number): number => {
   if (s == null) return 1
   if (typeof s === 'number') return s
   if (typeof s === 'boolean') return s ? 1 : 2
   return hashStringToNumber(s)
}

export const hashStringToNumber = (s: string): number => {
   let hash = 0,
      i,
      chr
   for (i = 0; i < s.length; i++) {
      chr = s.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
   }
   return hash
}

// extracted and modified from npm package "fast-json-stable-hash"
// because the npm package required crypto which didn't work on mobile

export function stableStringify(obj: any): string {
   const type = typeof obj
   if (type === 'string') return JSON.stringify(obj)
   if (Array.isArray(obj)) {
      let str = '['
      const al = obj.length - 1
      for (let i = 0; i < obj.length; i++) {
         str += stableStringify(obj[i])
         if (i !== al) str += ','
      }
      return `${str}]`
   }
   if (type === 'object' && obj !== null) {
      let str = '{'
      const keys = Object.keys(obj)
         .filter((k) => obj[k] !== undefined)
         .sort()
      for (let i = 0; i < keys.length; i++) {
         const key = keys[i]!
         const val = (obj as any)[key]
         if (val === undefined) continue
         if (i !== 0) str += ','
         str += `${JSON.stringify(key)}:${stableStringify(val)}`
      }
      return `${str}}`
   }
   if (type === 'number' || type === 'boolean' || obj == null) {
      // bool, num, null have correct auto-coercions
      return `${obj}`
   }

   throw new TypeError(
      `Invalid JSON type of ${type}, value ${obj}. stableStringiyf can only hash JSON objects.`,
   )
}

export function schemaConfigHash(obj: any): string {
   // console.log(`[🔴🔴🔴] obj`, obj)
   const type = typeof obj
   if (type === 'bigint') return `🔢${obj.toString()}`
   if (type === 'function') return `🏭${getUIDForMemoryStructure(obj, 6)}`
   if (type === 'string') return JSON.stringify(obj)
   if (Array.isArray(obj)) {
      let str = '['
      const al = obj.length - 1
      for (let i = 0; i < obj.length; i++) {
         str += schemaConfigHash(obj[i])
         if (i !== al) str += ','
      }
      return `${str}]`
   }
   if (type === 'object' && obj !== null) {
      // check if is POJO
      const isPOJO = Object.getPrototypeOf(obj) === Object.prototype
      if (!isPOJO) {
         if (obj._symCSchema === Symbol.for('CSchema')) return `🚼${(obj as CSchema)._uid}` // sub-schema
         if (obj._symField === Symbol.for('Field')) return `🚼${(obj as Field)._uid}` // sub-schema
         const readableName = obj.constructor?.name
         return `❓${readableName}#${getUIDForMemoryStructure(obj)}`
      } else {
         // react stuff are POJOs but should be identifiable thanks to their '$$typeof' properties.
         if ('$$typeof' in obj) return `⚛️${obj['$$typeof'].toString()}#${getUIDForMemoryStructure(obj, 6)}` // react stuff
      }

      let str = '{'
      const keys = Object.keys(obj)
         .filter((k) => obj[k] !== undefined)
         .sort()
      for (let i = 0; i < keys.length; i++) {
         const key = keys[i]!
         const val = (obj as any)[key]
         if (val === undefined) continue
         if (i !== 0) str += ','
         str += `${JSON.stringify(key)}:${schemaConfigHash(val)}`
      }
      return `${str}}`
   }
   if (type === 'number' || type === 'boolean' || obj == null) {
      // bool, num, null have correct auto-coercions
      return `${obj}`
   }

   console.log(`[❌❌❌❌❌❌❌❌❌❌❌❌] `, obj)
   throw new TypeError(
      `Invalid JSON type of ${type}, value ${obj}. stableStringiyf can only hash JSON objects.`,
   )
}

// --------------------------------------------------------
const memoMap = new Map<any, any>()
export function memoizedFN<FN extends (...args: any[]) => any>(stuff: FN, deps: any[]): FN {
   const key = schemaConfigHash(deps)
   const memo = memoMap.get(key)
   if (memo) return memo
   memoMap.set(key, stuff)
   return stuff
}
