import { join } from 'path'
import { asFlowID } from '../front/FlowID'
import '../logger/LoggerBack'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
const path = asAbsolutePath(join(process.cwd(), 'flows/'))

const server = new ServerState(path, {
    cushySrcPathPrefix: '../src/',
    genTsConfig: false,
})

// autorun(() => {
//     // console.log(JSON.stringify(server.db.store.images, null, 4))
//     console.log('🟢ACTIONS=', JSON.stringify(server.db.actions.values().map(a => a.data.file), null, 4))
// })

// setTimeout(() => {
//     const flow = server.getOrCreateFlow(asFlowID('test'))
//     console.log(server.db.actions.ids())
//     // flow.runAction('testAction', { test: 'test' })
// }, 200)
