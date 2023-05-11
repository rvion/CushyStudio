import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'
import '../logger/LoggerBack'
import { join } from 'path'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
const path = asAbsolutePath(join(process.cwd(), 'src/examples/'))
new ServerState(path, false)
// const serverstate = new ServerState(asAbsolutePath('/Users/loco/dev/CushyStudio/src/examples'))
