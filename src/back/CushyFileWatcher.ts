import type { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { STATE } from 'src/front/state'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import path, { join } from 'path'
import { LiteGraphJSON } from 'src/core/LiteGraph'
import { convertLiteGraphToPrompt } from '../core/litegraphToPrompt'
import { getPngMetadataFromUint8Array } from '../importers/getPngMetadata'
import { asAbsolutePath } from '../utils/fs/pathUtils'
import { CushyFile } from './CushyFile'

export class CushyFileWatcher {
    filesMap = new Map<AbsolutePath, CushyFile>()

    constructor(
        //
        public st: STATE,
        public extensions: string = '.ts',
    ) {
        // this.filesMap = new Map()
    }

    walk = async (dir: string): Promise<boolean> => {
        console.log(`[💙] TOOL: starting discovery in ${dir}`)
        this._walk(dir)
        console.log(`[💙] TOOL: done walking, found ${this.filesMap.size} files`)
        await Promise.all([...this.filesMap.values()].map((f) => f.extractWorkflowsV2()))
        console.log(`[💙] TOOL: all ${this.filesMap.size} files are ready`)
        return true
    }

    private _walk = (dir: string) => {
        // console.log(`[💙] TOOL:  ...exploring ${dir}`)

        // 🔴
        // this.st.db.actions.clear()
        const files = readdirSync(dir)
        // console.log(files)
        for (const file of files) {
            if (file.startsWith('.')) continue
            // console.log('>>', file)
            const filePath = join(dir, file)
            const stat = statSync(filePath)
            if (stat.isDirectory()) {
                this._walk(filePath)
            } else {
                this.handleNewFile(filePath)
            }
        }
    }

    private handleNewFile = (filePath: string) => {
        //
        const dest = filePath + '.ts'
        const destExists = existsSync(dest)
        if (destExists) return

        if (filePath.endsWith('workflow_api.json')) {
            const json = JSON.parse(readFileSync(filePath, 'utf-8'))
            const filename = path.basename(filePath)
            const author = path.dirname(filePath)
            const code = this.st.importer.convertFlowToCode(json, {
                title: filename,
                author,
                preserveId: false,
            })
            writeFileSync(dest, code, 'utf-8')
            this.handleNewFile(filePath + '.ts')
            return
            // console.log(code)
        }
        if (filePath.endsWith('.png')) {
            console.log('🟢 found ', filePath)
            const result = getPngMetadataFromUint8Array(readFileSync(filePath))
            if (result == null) {
                console.log(`❌0. no metadata`)
                return // <>loading...</>
            }

            if (result.type === 'failure') {
                console.log(`❌1. metadata extraction failed`, result.value)
                return
            }
            const metadata = result.value
            const workflowStr = (metadata as { [key: string]: any }).workflow

            if (workflowStr == null) {
                console.log(metadata)
                console.log(`❌2. no workflow in metadata`)
                return
            }
            let workflowJSON: LiteGraphJSON
            try {
                workflowJSON = JSON.parse(workflowStr)
            } catch (error) {
                console.log(`❌3. workflow is not valid json`)
                return
            }
            let promptJSON: ComfyPromptJSON
            try {
                console.groupCollapsed()
                promptJSON = convertLiteGraphToPrompt(this.st.schema, workflowJSON)
                console.groupEnd()
            } catch (error) {
                console.log(`❌4. cannot convert LiteGraph To Prompt`)
                console.log(error)
                return
            }

            try {
                const filename = path.basename(filePath)
                const author = path.dirname(filePath)
                const code = this.st.importer.convertFlowToCode(promptJSON, {
                    title: filename,
                    author,
                    preserveId: false,
                })
                writeFileSync(dest, code, 'utf-8')
                this.handleNewFile(filePath + '.ts')
                return
            } catch (e) {
                console.log(e)
                console.log('❌5. cannot convert prompt to code')
            }
        }

        if (!filePath.endsWith(this.extensions)) return
        // console.log(`found`)
        const absPath = asAbsolutePath(filePath)
        this.filesMap.set(asAbsolutePath(absPath), new CushyFile(this.st, absPath))
    }

    // private handleFileChange(filePath: string) {
    //     // console.log(`${filePath} changed`)
    //     const absPath = asAbsolutePath(filePath)
    //     if (!filePath.endsWith(this.extensions)) return
    //     this.st.knownFiles.set(absPath, new CushyFile(this.st, absPath))
    // }

    // private handleFileRemoval(filePath: string) {
    //     if (this.filesMap.has(filePath)) {
    //         this.filesMap.delete(filePath)
    //     }
    // }
}
