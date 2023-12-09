import { basename, join } from 'pathe'
import { LiveCollection } from 'src/db/LiveCollection'
import { LiveInstance } from 'src/db/LiveInstance'
import { LiveRef } from 'src/db/LiveRef'
import { SQLITE_true } from 'src/db/SQLITE_boolean'
import { CushyAppT } from 'src/db/TYPES.gen'
import { CushyScriptL } from 'src/models/CushyScriptL'
import { App, WidgetDict } from '../cards/App'
import { generateAvatar } from '../cards/AvatarGenerator'
import { DraftL } from './Draft'

export interface CushyAppL extends LiveInstance<CushyAppT, CushyAppL> {}
export class CushyAppL {
    scriptL: LiveRef<this, CushyScriptL> = new LiveRef(this, 'scriptID', () => this.db.cushy_scripts)
    get script() { return this.scriptL.item } // prettier-ignore

    drafts = new LiveCollection<DraftL>(
        () => ({ appID: this.id }),
        () => this.db.drafts,
    )

    get isFavorite(): boolean {
        return this.st.configFile.value.favoriteApps?.includes(this.id) ?? false
    }

    setFavorite = (fav: boolean) => {
        const favArray = this.st.configFile.update((f) => {
            if (f.favoriteApps == null) f.favoriteApps = []
            const favs = f.favoriteApps
            if (fav) {
                if (!favs.includes(this.id)) favs.unshift(this.id)
            } else {
                const index = favs.indexOf(this.id)
                if (index !== -1) favs.splice(index, 1)
            }
        })
    }

    createDraft = (): DraftL => {
        console.log(`[👙] AAAAAAAAA`)
        const title = this.name + ' ' + this.drafts.items.length + 1
        const draft = this.st.db.drafts.create({
            appParams: {},
            appID: this.id,
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

    get live(): Maybe<App<WidgetDict>> {
        return this.script.getLiveApp(this.id)
    }

    /** globaly unique id (in theory...); 🔶 */
    get uid() {
        return this.data.createdAt
    }

    get name(): string {
        if (this.live?.metadata?.name) return this.live.metadata.name

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
        return this.scriptL.item.relPath
    }

    get description(): string {
        return this.live?.metadata?.description ?? '<no description>'
    }

    /** action display name */
    get illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded_or_SVG(): Maybe<string> {
        if (this.live?.metadata?.illustration) return this.live.metadata.illustration
        if (this.relPath.endsWith('.png')) return this.relPath
        return generateAvatar(this.relPath)
    }

    /** ready to be used in URL */
    get illustrationPathWithFileProtocol() {
        const tmp = this.illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded_or_SVG
        if (tmp?.startsWith('data:')) return tmp
        if (tmp?.startsWith('http')) return tmp
        if (tmp?.startsWith('<svg')) throw new Error('SVG not supported')
        if (tmp) return `file://${tmp}`
        // default illustration if none is provided
        return `file://${join(this.st.rootPath, 'library/CushyStudio/default/_illustrations/default-card-illustration.jpg')}`
    }
}
