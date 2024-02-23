import { customAlphabet } from 'nanoid'

export const genUID = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5)

export const FAIL = (msg: string, data?: any): never => {
    throw new Error(`🔴 ${msg}`, data)
}

export const VIOLATION = (msg: string, data?: any): never => {
    throw new Error(`🔴 INVARIANT VIOLATION: ${msg}`, data)
}

// import type { Node } from './Node'
// export const ENSURE_PROXY = (n: Node) => {
//     if (n.isProxy) return
//     FAIL('node is not a proxy')
// }
