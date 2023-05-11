import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'
import '../logger/LoggerBack'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
// join(process.cwd(), 'src/examples/')
const serverstate = new ServerState(asAbsolutePath('/Users/loco/dev/CushyStudio/src/examples'))
