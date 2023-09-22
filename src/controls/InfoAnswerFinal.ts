import type { ToolL } from '../models/Tool'
import type { Requestable } from 'src/controls/InfoRequest'
import type { InfoAnswer } from 'src/controls/InfoAnswer'
import { BUG } from '../controls/InfoRequest'

import { ASSERT_ARRAY, bang } from '../utils/bang'
import { FormPath } from '../models/Step'
import { toJS } from 'mobx'

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
            for (const [key, req] of request.entries()) {
                processNode([...path, key], req, answer[key])
            }
            return
        }
        if (request instanceof BUG) {
            return
        }
        if (request.type === 'itemsOpt') {
            if (answer == null) return
            if (!answer.__enabled__) return
            console.log('>>>', toJS(answer))
            for (const [key, req] of Object.entries(answer)) {
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

        if (param == null) {
            console.log('🔴 PARAM', rootKey, 'IS NULL !')
            continue
        } else {
            console.log('🟢 PARAM', rootKey, 'IS HERE')
        }
        processNode([rootKey], requestable, param)
    }

    return normalizedParams
}
