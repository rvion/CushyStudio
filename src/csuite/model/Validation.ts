/** custom type checking;
 * valid:
 *  - true,
 *  - [],
 * invalid:
 *  - false,
 *  - ["errMsg", ...]
 *  - "errMsg"
 * */

import type { FL_FieldPath } from './Field'

export type Problem_Ext = boolean | string | Problem | null | undefined | Problem_Ext[]

export type Problem = {
   path: FL_FieldPath
   severity?: Severity
   message: string
   longerMessage?: string
   data?: any
}

export const normalizeProblem = (field: { zPath: string }, problem: Problem_Ext): Problem[] => {
   if (problem === true) return [{ path: field.zPath, message: 'Error (unknown (true))' }]
   if (problem === false) return []
   if (problem == null) return []
   if (typeof problem === 'string') return [{ path: field.zPath, message: problem }]
   if (Array.isArray(problem)) return problem.flatMap((p) => normalizeProblem(field, p))
   return [problem]
}

export enum Severity {
   Error = 'Error',
   Warning = 'Warning',
   // 💬 2024-09-06 rvion:
   // | we probably don't need these since this type is only used in errors
   // | Info = 'Info',
   // | Success = 'Success',
}
