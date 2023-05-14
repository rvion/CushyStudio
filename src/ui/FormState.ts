import { makeAutoObservable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { FormDefinition } from 'src/core/Requirement'
import { FrontState } from 'src/front/FrontState'

export type FormPath = (string | number)[]

/** this is the Form state that centralize values for every
 * ask request */
export class FormState {
    /** this value is the root response object
     * the form will progressively fill */
    value: any = {}

    /** this should be set to true once the component
     * can no longer be interracted with */
    locked: boolean = false

    /** this is the ID of the current task
     * will be re-used as executionID for
     */
    formID = nanoid()

    constructor(
        //
        public st: FrontState,
        public formDef: FormDefinition,
    ) {
        makeAutoObservable(this)
    }

    // submitAsInfoAnswer = () => {
    // }

    getAtPath(path: FormPath): any {
        let current = this.value
        for (const key of path) {
            if (!current.hasOwnProperty(key)) {
                return undefined
            }
            current = current[key]
        }
        return current
    }

    setAtPath = (path: FormPath, value: any) => {
        console.log(path, value, toJS(this.value))
        let current = this.value
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) current[key] = typeof path[i + 1] === 'number' ? [] : {}
            current = current[key]
        }
        current[path[path.length - 1]] = value
        console.log(this.value)
    }
}
