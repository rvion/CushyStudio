import type { Branded } from '../core/ComfyUtils'

export * as pathe from 'pathe'
import * as pathe from 'pathe'

export type WorkspaceRelativePath = Branded<string, 'WorkspaceRelativePath'>
export const asAbsolutePath = (path: string): AbsolutePath => {
    const isAbsolute = pathe.isAbsolute(path)
    if (!isAbsolute) throw new Error(`path is not absolute: ${path}`)
    return path as AbsolutePath
}
export type AbsolutePath = Branded<string, 'Absolute'>

// console.log(
//     //
//     pathe.resolve('/Users/loco/dev/CushyStudio/src/examples', 'New projectaaasdfa'),
//     pathe.relative(
//         '/Users/loco/dev/CushyStudio/src/examples',
//         pathe.resolve('/Users/loco/dev/CushyStudio/src/examples', 'New projectaaasdfa'),
//     ),
// )
// import * as pathe from 'pathe'
// for (const path of [
//     'src/utils/pathUtils.ts',
//     './src/utils/pathUtils.ts',
//     '.\\src\\help\\Demo.ts',
//     '.\\src\\help\\Demo.ts',
//     '/foo/src/core/Workflow.ts',
//     'C:\\foo\\src\\core\\Workflow.ts',
// ]) {
//     console.log('---------------------------')
//     console.log(path)
//     console.log(`parse:`, pathe.parse(path))
// }

// src/utils/pathUtils.ts// ---------------------------
//| parse: {
//|   root: 'src',
//|   dir: 'src/utils',
//|   base: 'pathUtils.ts',
//|   ext: '.ts',
//|   name: 'pathUtils'
//| }

// ./src/utils/pathUtils.ts// ---------------------------
//| parse: {
//|   root: '.',
//|   dir: './src/utils',
//|   base: 'pathUtils.ts',
//|   ext: '.ts',
//|   name: 'pathUtils'
//| }

// .\src\help\Demo.ts// ---------------------------
//| parse: {
//|   root: '.',
//|   dir: './src/help',
//|   base: 'Demo.ts',
//|   ext: '.ts',
//|   name: 'Demo'
//| }

// .\src\help\Demo.ts// ---------------------------
//| parse: {
//|   root: '.',
//|   dir: './src/help',
//|   base: 'Demo.ts',
//|   ext: '.ts',
//|   name: 'Demo'
//| }

// /foo/src/core/Workflow.ts// ---------------------------
//| parse: {
//|   root: '/',
//|   dir: '/foo/src/core',
//|   base: 'Workflow.ts',
//|   ext: '.ts',
//|   name: 'Workflow'
//| }

// C:\foo\src\core\Workflow.ts// ---------------------------
//| parse: {
//|   root: 'C:',
//|   dir: 'C:/foo/src/core',
//|   base: 'Workflow.ts',
//|   ext: '.ts',
//|   name: 'Workflow'
//| }
