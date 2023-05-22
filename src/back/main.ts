import { join } from 'path'
import '../logger/LoggerBack'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'
import { StepL } from 'src/models/Step'
import { Runtime } from './Workflow'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
const path = asAbsolutePath(join(process.cwd(), 'flows/'))

console.log({ path })
const server = new ServerState(path, {
    cushySrcPathPrefix: '../src/',
    genTsConfig: false,
})

server.db.steps.when(
    (step: StepL) => {
        console.log('a1')
        const r = step.action.item && step.data.value && !step.data.graphID
        console.log('b')
        return r
    },
    (step: StepL) => {
        const action = step.action.item
        const project = step.project.item
        const rt = new Runtime(server, step)

        console.log(`should run: `, action?.data.name)
    },
)
// autorun(() => {
//     // console.log(JSON.stringify(server.db.store.images, null, 4))
//     // console.log('🟢ACTIONS=', JSON.stringify(server.db.actions.values().map(a => a.data.file), null, 4))
//     console.log(server.db.steps)
// })

// setTimeout(() => {
//     const flow = server.getOrCreateFlow(asFlowID('test'))
//     console.log(server.db.actions.ids())
//     // flow.runAction('testAction', { test: 'test' })
// }, 200)
