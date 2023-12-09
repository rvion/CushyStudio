import { basename } from 'pathe'
import { LiveInstance } from 'src/db/LiveInstance'
import { CushyAppT } from 'src/db/TYPES.gen'
import { CushyScriptL } from 'src/models/CushyScriptL'
import { App, WidgetDict } from '../cards/App'
import { generateAvatar } from '../cards/AvatarGenerator'
import { LiveRef } from 'src/db/LiveRef'
import { LiveCollection } from 'src/db/LiveCollection'
import { DraftL } from './Draft'

export interface CushyAppL extends LiveInstance<CushyAppT, CushyAppL> {}
export class CushyAppL {
    script: LiveRef<this, CushyScriptL> = new LiveRef(this, 'scriptID', () => this.db.cushy_scripts)

    drafts = new LiveCollection<DraftL>(
        () => ({ appID: this.id }),
        () => this.db.drafts,
    )

    createDraft = (): DraftL => {
        console.log(`[👙] AAAAAAAAA`)
        const title = this.name + ' ' + this.drafts.length + 1
        const draft = this.st.db.drafts.create({
            appParams: {},
            appPath: this.relPath,
            isOpened: SQLITE_true,
            title: title,
        })
        // pj.st.layout.FOCUS_OR_CREATE('Draft', { draftID: draft.id })
        return draft
    }

    /** true if file match current library search */
    matchesSearch = (search: string): boolean => {
        if (search === '') return true
        const searchLower = search.toLowerCase()
        const nameLower = this.name.toLowerCase()
        const descriptionLower = this.description.toLowerCase()
        return nameLower.includes(searchLower) || descriptionLower.includes(searchLower)
    }

    // get manifest(): AppManifest {
    //     return this.app.metadata ?? this.defaultManifest
    // }

    get app() {
        return this.script.item.apps.find((a) => a.metadata?.name === this.name)
    }

    /** globaly unique id (in theory...); 🔶 */
    get uid() {
        return this.data.createdAt
    }

    get name(): string {
        if (this.app.metadata?.name) return this.app.metadata.name

        // take basename as name
        const relPath = this.script.relPath
        let name = basename(relPath)

        // remove the extension
        name = name.endsWith('.ts') //
            ? name.slice(0, -3)
            : name

        // support for https://comfyworkflows.com/ downloaded workflows
        if (name.match(/comfyworkflows_[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/)) {
            name = `ComfyWorkflow ${name.slice(-12, -4)}`
        }

        return name
    }

    /** retlative path to the script this app comes from */
    get relPath(): RelativePath {
        return this.script.relPath
    }

    get description(): string {
        return this.app.metadata?.description ?? '<no description>'
    }

    /** action display name */
    get illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded_or_SVG(): Maybe<string> {
        if (this.app.metadata?.illustration) return this.app.metadata.illustration
        if (this.relPath.endsWith('.png')) return this.relPath
        return generateAvatar(this.relPath)
    }

    get illustrationPathWithFileProtocol() {
        const tmp = this.illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded_or_SVG
        if (tmp?.startsWith('data:')) return tmp
        if (tmp?.startsWith('http')) return tmp
        if (tmp?.startsWith('<svg')) throw new Error('SVG not supported')
        if (tmp) return `file://${join(this.deck.folderAbs, tmp)}`
        // default illustration if none is provided
        return `file://${join(this.st.rootPath, 'library/CushyStudio/default/_illustrations/default-card-illustration.jpg')}`
    }
}
