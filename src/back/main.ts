import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'
import '../logger/LoggerBack'
import { join } from 'path'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
const path = asAbsolutePath(join(process.cwd(), 'flows/'))
new ServerState(path, {
    genStub: false,
    genTsConfig: false,
})
