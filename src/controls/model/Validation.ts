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
    data?: any
}

export const normalizeProblem = (problem: Problem_Ext): Problem[] => {
    if (problem === true) return []
    if (problem === false) return [{ message: 'Error' }]
    if (problem == null) return []
    if (typeof problem === 'string') return [{ message: problem }]
    if (Array.isArray(problem)) return problem.flatMap((p) => normalizeProblem(p))
    return [problem]
}

export enum Severity {
    Error = 'Error',
    Warning = 'Warning',
    Info = 'Info',
    Success = 'Success',
}
