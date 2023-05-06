// 2023-04-03: this may turns out be quite annoying to maintain 😅
export const sdkRewriteRules: [string | RegExp, string][] = [
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
    [`/// <reference types="vscode" />`, ''],
    [`/// <reference types="node" />`, ''],
    [`/// <reference types="node" />`, ''],
    [`/// <reference types="cytoscape" />`, ''],

    [`WS.WebSocket | WebSocket`, 'WebSocket'],

    // monaco
    [`import * as monaco from 'monaco-editor';`, 'const monaco: any'],

    // cytoscape
    [`import cytoscape from 'cytoscape';`, ''],
    [`cytoscape.Core`, 'any'],

    // later
    ['import type { LATER } from "core-back/LATER.foo";', `import type * as CUSHY_RUNTIME from 'CUSHY_RUNTIME'`],
    [`LATER<'LoadImage'>`, 'CUSHY_RUNTIME.LoadImage'],
    [`LATER<'FlowRun'>`, 'import("sdk/IFlowExecution").IFlowExecution'],
    // [`LATER<'Enum_CheckpointLoader_ckpt_name'>`, 'CUSHY_RUNTIME.Enum_CheckpointLoader_ckpt_name'],
    [`LATER<'ComfySetup'>`, 'CUSHY_RUNTIME.ComfySetup'],
    [`LATER<'Embeddings'>`, 'CUSHY_RUNTIME.Embeddings'],
    [/LATER<'(Enum_[a-zA-Z0-9_]+)'>/g, 'CUSHY_RUNTIME.$1'],
]
