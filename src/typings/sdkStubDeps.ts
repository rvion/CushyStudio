// 2023-04-03: this may turns out be quite annoying to maintain 😅

export const sdkStubDeps = `
// ====================================================================================
// ====================================================================================
declare type STUB = never

declare interface Thenable<T> {
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => TResult | Thenable<TResult>): Thenable<TResult>
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => void): Thenable<TResult>
}
declare type File = STUB
declare type Blob = STUB
declare namespace NodeJS {
    export type Timeout = STUB
}
declare type Buffer = never
declare module "typescript" {
    export default STUB
}
declare namespace ts {
    export type CallExpression = STUB
}
declare module "path" {}
declare module "pathe" {}
declare namespace express {
    export type Application = STUB
}
declare module "express" {
    export default STUB
}
// http --------------------------
declare module "http" {
    export default STUB
}
declare namespace http {
    export type Server = STUB
}
// ws --------------------------
declare module "ws" {
    export default STUB
    export type WebSocketServer = STUB
    export type CloseEvent = STUB
    export type Event = STUB
    export type MessageEvent = STUB
    export type EventListenerOptions = STUB
}
declare module "vscode" {
    export type TestRunProfile = STUB
    export type ExtensionContext = STUB
    export type OutputChannel = STUB
    export type Range = STUB
    export type TestItem = STUB
    export type TestRun = STUB
    export type TestRunRequest = STUB
    export type Uri = STUB
    export type Webview = STUB
    export type TextEditorDecorationType = STUB
    export type TextEditor = STUB
    export type TextDocumentWillSaveEvent = STUB
    export type TextDocumentChangeEvent = STUB
    export type TextDocument = STUB
    export type DecorationOptions = STUB
    export type StatusBarItem = STUB
    export type TestController = STUB
    export type WorkspaceFolder = STUB
    export type RelativePattern = STUB
    export type EventEmitter<T> = STUB
    export type FileSystemWatcher = STUB
    export type GlobPattern = STUB
}
// ====================================================================================
// ====================================================================================
`
