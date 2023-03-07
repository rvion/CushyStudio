import * as T from 'monaco-editor/esm/vs/editor/editor.api'

export type TypescriptOptions = T.languages.typescript.CompilerOptions
export type ITextModel = ReturnType<typeof T.editor.createModel>
