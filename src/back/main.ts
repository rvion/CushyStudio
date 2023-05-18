import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'
import '../logger/LoggerBack'
import { join } from 'path'
import { autorun } from 'mobx'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
const path = asAbsolutePath(join(process.cwd(), 'flows/'))

const server = new ServerState(path, {
    cushySrcPathPrefix: '../src/',
    genTsConfig: false,
})

autorun(() => {
    console.log(JSON.stringify(server.db.store.images, null, 4))
})
