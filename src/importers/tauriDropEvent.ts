import { AbsolutePath } from '../fs/pathUtils'

export type TauriDropEvent = {
    event: 'tauri://file-drop'
    windowLabel: 'main'
    payload: AbsolutePath[] // ['/Users/loco/dev/CushyStudio/public/CushyLogo.png']
    id: number // 15748143500588720000
}
