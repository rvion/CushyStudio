// import { RootFolder } from '../fs/RootFolder'
import { CushyGlobalRef } from './CushyGlobalRef'

/** global Singleton state for the application */
export class Cushy {
    private constructor() {
        // this.rootFolder = new RootFolder(this.configDir)
        CushyGlobalRef.value = this
    }
}
