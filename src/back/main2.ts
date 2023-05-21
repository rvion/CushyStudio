// import { autorun } from 'mobx'
// import { createRequire } from 'module'
// import { LiveDB } from '../db/LiveDB'
// import { asAbsolutePath } from '../utils/fs/pathUtils'

// const require = createRequire(import.meta.url)
// const WebSocketPolyfill = require('ws')

// class Main2 {
//     db = new LiveDB({ WebSocketPolyfill: WebSocketPolyfill.WebSocket })
//     constructor() {
//         // setTimeout(() => {
//         //     console.log('ok')
//         //     this.db.store.actions = { file: asAbsolutePath('/foo'), form: {}, name: 'foo' }
//         //     this.db.actions = { file: asAbsolutePath('/foo'), form: {}, name: 'foo' }
//         // }, 2000)
//     }
// }

// const b = new Main2()

// autorun(() => {
//     console.log(JSON.stringify(b.db.store.images, null, 4))
// })
