import { join } from 'path'
import '../logger/LoggerBack'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { ServerState } from './ServerState'

// const serverstate = new ServerState(asAbsolutePath('/Users/loco/csdemo'))

export const startServerState = () => {
    const path = asAbsolutePath(join(process.cwd(), 'flows/'))
    console.log({ path })
    return new ServerState(path, {
        cushySrcPathPrefix: '../src/',
        genTsConfig: false,
    })
}
// server.db.steps.when(
//     (step: StepL) => {
//         console.log('a1')
//         const r = step.action.item && step.data.value && !step.data.graphID
//         console.log('b')
//         return r
//     },
//     (step: StepL) => {
//         const action = step.action.item
//         // const project = step.project
//         // if (project)
//         // const rt = new Runtime(server, step)

//         console.log(`should run: `, action?.data.name)
//     },
// )

// auto-download images
// server.db.images.when(
//     (_) => true,
//     async (img: ImageL) => {
//         const lPath = img.data.localAbsolutePath
//         if (lPath != null) return console.log('image already downloaded')
//         const comfyURL = img.data.comfyURL
//         if (comfyURL == null) return console.log('image has no comfyURL')

//         console.log(`should download and update image local path`)

//         const response = await fetch(comfyURL, {
//             headers: { 'Content-Type': 'image/png' },
//             method: 'GET',
//             // responseType: ResponseType.Binary,
//         })
//         const binArr = await response.buffer()

//         const localFileName: string = img.id + '.png'
//         const localAbsolutePath = asAbsolutePath(join(server.cacheFolderPath, 'outputs', localFileName))
//         server.writeBinaryFile(localAbsolutePath, binArr)

//         img.update({
//             localAbsolutePath,
//             localURL: server.server.baseURL + localAbsolutePath.replace(server.cacheFolderPath, ''),
//         })
//     },
// )

// // autorun(() => {
// //     // console.log(JSON.stringify(server.db.store.images, null, 4))
// //     // console.log('🟢ACTIONS=', JSON.stringify(server.db.actions.values().map(a => a.data.file), null, 4))
// //     console.log(server.db.steps)
// // })

// // setTimeout(() => {
// //     const flow = server.getOrCreateFlow(asFlowID('test'))
// //     console.log(server.db.actions.ids())
// //     // flow.runAction('testAction', { test: 'test' })
// // }, 200)
