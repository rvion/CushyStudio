import { makeAutoObservable } from 'mobx'

export type AskPath = (string | number)[]

export class AskState {
    /** this value is the root response object the form will progressively fill */
    value: any = {}

    /** this should be set to true once the component can no longer be interracted with */
    locked: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    getAtPath(path: AskPath): any {
        let current = this.value
        for (const key of path) {
            if (!current.hasOwnProperty(key)) {
                return undefined
            }
            current = current[key]
        }
        return current
    }

    setAtPath = (path: AskPath, value: any) => {
        let current = this.value
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) current[key] = typeof path[i + 1] === 'number' ? [] : {}
            current = current[key]
        }
        current[path[path.length - 1]] = value
    }
}
