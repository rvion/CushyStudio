import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

execSync(`tsc -p tsconfig.decl.json`, { stdio: 'inherit' })
const originalDefPath = 'dts/Comfy.d.ts'
const originalDefContent = readFileSync(originalDefPath, 'utf8')
// console.log(originalDefContent)

const outPath = 'src/ui/samples/c.ts'
let out: string = originalDefContent
out = out.replace('/// <reference types="react" />', '')

// 🔴 this will be quite annoying to maintain 😅
for (const [from, to] of [
    [`import * as T from 'monaco-editor/esm/vs/editor/editor.api';`, ''],
    [`export type TypescriptOptions = T.languages.typescript.CompilerOptions;`, `export type TypescriptOptions = any`],
    [`export type ITextModel = ReturnType<typeof T.editor.createModel>;`, `export type ITextModel = any`],
    [
        `export type IStandaloneCodeEditor = import('monaco-editor').editor.IStandaloneCodeEditor;`,
        `export type IStandaloneCodeEditor = any`,
    ],
    [
        `export type Monaco = typeof import('/Users/loco/dev/intuition/node_modules/monaco-editor/esm/vs/editor/editor.api');`,
        `export type Monaco = any;`,
    ],
    // declare module "ui/VisUI" {
    [`import type { Edge, Node, Options } from 'vis-network/declarations/network/Network';`, ''],
    [`export const VisUI: import("react").FunctionComponent<{}>;`, 'export const VisUI:any'],
    [`export type VisNodes = Node;`, 'export type VisNodes = any;'],
    [`export type VisEdges = Edge;`, 'export type VisEdges = any;'],
    [`export type VisOptions = Options;`, 'export type VisOptions = any;'],
    [`export const stContext: import("react").Context<ComfyClient | null>;`, `export const stContext: any`],
    // declare module "core/ComfyScriptEditor" {
    [`import type { Monaco } from '@monaco-editor/react';`, ''],
    [`current: import("monaco-editor").editor.IStandaloneCodeEditor | null;`, `current: any`],
    [`current: typeof import("monaco-editor") | null;`, `current: any`],
    [`setupMonaco(monaco: Monaco): void;`, `setupMonaco(monaco: any): void;`],
    // ws stuff
    [`import * as WS from 'ws';`, ''],
    [`/// <reference types="ws" />`, ''],
    [`WS.WebSocket | WebSocket`, 'WebSocket'],
]) {
    out = out.replace(from, to)
}
out = `export const c__:string = \`${out}\``

writeFileSync(outPath, out, 'utf8')
