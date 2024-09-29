/** custom type checking;
 * valid:
 *  - true,
 *  - [],
 * invalid:
 *  - false,
 *  - ["errMsg", ...]
 *  - "errMsg"
 * */

export type Problem_Ext = boolean | string | Problem | null | undefined | Problem_Ext[]

export type Problem = {
    severity?: Severity
    message: string
    longerMessage?: string
    data?: any
}

export const normalizeProblem = (problem: Problem_Ext): Problem[] => {
    if (problem === true) return [{ message: 'Error (unknown (true))' }]
    if (problem === false) return []
    if (problem == null) return []
    if (typeof problem === 'string') return [{ message: problem }]
    if (Array.isArray(problem)) return problem.flatMap((p) => normalizeProblem(p))
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
