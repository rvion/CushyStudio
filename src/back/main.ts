import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'
import '../logger/LoggerBack'

const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))
