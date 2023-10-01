import type { InfoAnswer } from 'src/controls/InfoAnswer'
import type { Requestable } from 'src/controls/InfoRequest'
import type { ToolL } from '../models/Tool'

// import { BUG } from '../controls/InfoRequest'
import { FormPath } from '../models/Step'
import { ASSERT_ARRAY, ASSERT_EQUAL } from '../utils/bang'

export const finalizeAnswer = (
    //
    tool: ToolL,
    params: { [key: string]: Requestable },
): { [key: string]: InfoAnswer<any> } => {
    try {
        return finalizeAnswer_UNSAFE(tool, params)
    } catch (error) {
        console.log(`🔴 error`)
        console.log(error)
        return { [`🔴 error`]: true }
    }
}

const getDefault = (request: Requestable): any => {
    if (Array.isArray(request)) {
        return request.map(getDefault)
    }
    // if (request instanceof BUG) return null
    if (request.type === 'items?') {
        const obj: any = {}
        for (const [key, req] of Object.entries(request.items)) {
            obj[key] = getDefault(req as Requestable)
        }
        return obj
    }
    if (request.type === 'items') {
        const obj: any = {}
        for (const [key, req] of Object.entries(request.items)) {
            obj[key] = getDefault(req as Requestable)
        }
        return obj
    }
    return request.default
}

export const finalizeAnswer_UNSAFE = (
    //
    tool: ToolL,
    params: { [key: string]: any },
) => {
    const normalizedParams: { [key: string]: any } = {}
    const form = tool.data.form
    if (form == null) return {}

    function setAtPath(path: FormPath, value: any) {
        // console.log(path, value, toJS(this.data.value))
        let current = normalizedParams
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) current[key] = typeof path[i + 1] === 'number' ? [] : {}
            current = current[key]
        }
        current[path[path.length - 1]] = value
        // console.log(this.Form)
    }

    function processNode<Req extends Requestable>(
        //
        path: FormPath,
        request: Req,
        answer: InfoAnswer<Req>,
    ) {
        if (Array.isArray(request)) {
            ASSERT_ARRAY(answer)
            ASSERT_EQUAL(request.length, answer.length)
            for (const [key, req] of request.entries()) {
                processNode([...path, key], req, answer[key])
            }
            return
        }
        // if (request instanceof BUG) return

        if (request.type === 'items?') {
            if (answer == null) return
            if (!answer.__enabled__) return
            const entries = Object.entries(answer).filter((i) => i[0] !== '__enabled__')
            if (entries.length === 0) setAtPath(path, {})
            for (const [key, req] of entries) {
                if (key === '__enabled__') continue
                processNode([...path, key], req, answer[key])
            }
            return
        }

        setAtPath(path, answer)
    }

    // process root object
    for (const [rootKey, requestable] of Object.entries(form)) {
        const param = params[rootKey]

        // if (param == null) {
        //     const def = getDefault(requestable)
        //     processNode([rootKey], requestable, param ?? def)
        //     // console.log('🔴 PARAM', rootKey, 'IS NULL !')
        //     continue
        // } else {
        //     // console.log('🟢 PARAM', rootKey, 'IS HERE')
        // }
        processNode([rootKey], requestable, param ?? getDefault(requestable))
    }

    return normalizedParams
}
