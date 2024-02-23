import type { TreeNode } from '../xxx/TreeNode'
import type { STATE } from 'src/state/state'

import { makeAutoObservable } from 'mobx'
import { basename } from 'pathe'
import { cwd } from 'process'

import { ITreeElement, ITreeEntry, TreeEntryAction } from '../TreeEntry'
import { TreeApp } from './TreeApp'
import { LibraryFile } from 'src/cards/LibraryFile'
import { assets } from 'src/utils/assets/assets'

export class TreeFile implements ITreeEntry {
    file: LibraryFile

    onExpand = async () => {
        await this.file.extractScriptFromFile()
    }

    constructor(
        //
        public st: STATE,
        public path: RelativePath,
    ) {
        this.file = st.library.getFile(path)
        makeAutoObservable(this)
    }

    /** 🔶 'isFolder' for the tree widget, not on the filesystem */
    isFolder = true

    /** icon to display in the treeview */
    get icon() {
        if (this.path.endsWith('.ts')) return assets.typescript_512_png
        if (this.path.endsWith('.tsx')) return assets.typescript_512_png
        if (this.path.endsWith('.png')) return `file://${cwd()}/${this.path}`
        // if (this.file) return <AppIllustrationUI size='1.3rem' app={this.file} />
        return <span>❓</span>
        // if (this.path === 'library/Installed') return <span className='material-symbols-outlined'>get_app</span>
        // if (this.path === 'library/Local') return <span className='material-symbols-outlined'>privacy_tip</span>
        // if (this.path === 'library/CushyStudio') return <span className='material-symbols-outlined'>home</span>
        // return <span className='material-symbols-outlined'>home</span>
    }

    get script() {
        return this.file.script
    }

    // get index(){return `path#${this.path}`} //prettier-ignore
    get name() { return basename(this.path) } // prettier-ignore

    actions: TreeEntryAction[] = [
        {
            name: 'add Draft',
            icon: 'find_in_page', //'play_arrow',
            mode: 'small',
            onClick: () => {
                if (this.file == null) return
                this.file.extractScriptFromFile()
            },
        },
    ]

    onFocusItem = () => {
        if (this.file.scriptExtractionAttemptedOnce) return
        this.file.extractScriptFromFile()
    }

    onPrimaryAction = (n: TreeNode) => {
        this.file.extractScriptFromFile()
        if (!n.isOpen) {
            n.open()
            this.script?.evaluateAndUpdateApps()
        } else {
            n.close()
        }
    }

    children = (): ITreeElement<CushyAppID>[] => {
        // if (!this.file.hasBeenLoadedAtLeastOnce) return []
        if (this.file == null) { console.log(`[🔴] TreeFile (${this.path}): FILE is null`); return [] } // prettier-ignore
        if (this.script == null) { console.log(`[🔴] TreeFile (${this.path}): SCRIPT is null`); return [] } // prettier-ignore

        const apps = this.script.apps
        // console.log(`[👙] 🔴 ${this.path} => ${apps.length}`)
        if (apps.length === 0) {
            console.log(`[🔴] TreeFile (${this.path}): APPS.length = 0`)
            return []
        }

        // console.log(`[🟢] TreeFile: found ${apps.length} apps`)
        return [
            //
            ...apps.map((app) => ({
                ctor: TreeApp,
                key: app.id,
                props: app.id,
            })),
            // ...this.script,
        ]
    }
}
