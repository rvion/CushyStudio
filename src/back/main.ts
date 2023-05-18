import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'
import '../logger/LoggerBack'
import { join } from 'path'
import { autorun } from 'mobx'
import { asFlowID } from 'src/front/FrontFlow'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
const path = asAbsolutePath(join(process.cwd(), 'flows/'))

const server = new ServerState(path, {
    cushySrcPathPrefix: '../src/',
    genTsConfig: false,
})

autorun(() => {
    console.log(JSON.stringify(server.db.store.images, null, 4))
})

setTimeout(() => {
    const flow = server.getOrCreateFlow(asFlowID('test'))
    console.log(server.db.actions.mapData((d) => d.id))
    // flow.runAction('testAction', { test: 'test' })
}, 200)
