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
import { LibraryFile } from 'src/cards/LibraryFile'
import { Executable } from './Executable'

export interface CushyAppL extends LiveInstance<CushyAppT, CushyAppL> {}
export class CushyAppL {
    scriptL: LiveRef<this, CushyScriptL> = new LiveRef(this, 'scriptID', () => this.db.cushy_scripts)
    get script() { return this.scriptL.item } // prettier-ignore

    get drafts(): DraftL[] {
        return this.draftsCollection.items
    }

    private draftsCollection = new LiveCollection<DraftL>({
        table: () => this.db.drafts,
        where: () => ({ appID: this.id }),
    })

    /** shortcut to open the last draft of the first app defined in this file */
    openLastDraftAsCurrent = () => {
        this.st.currentDraft = this.getLastDraft()
    }

    getLastDraft = (): DraftL => {
        const drafts = this.drafts
        return drafts.length > 0 ? drafts[0] : this.createDraft()
    }

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
        const title = this.name + ' ' + this.draftsCollection.items.length + 1
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

    get executable(): Maybe<Executable> {
        return this.script.getExecutable(this.id)
    }

    isPublishing = false
    publish = async () => {
        if (this.isPublishing) return
        this.isPublishing = true
        try {
            const st = this.st
            const supa = st.supabase
            const user_id = st.auth.user?.id
            if (user_id == null) throw new Error('not logged in')
            console.log(`[🐩] ✅ logged-in`)
            const prev = await supa.from('published_apps').select('*').eq('user_id', user_id)
            const count = prev.data?.length ?? prev.count ?? 0
            if (count === 0) {
                console.log(`[🐩] no published app found; inserting`)
                const res = await supa.from('published_apps').insert({
                    user_id,
                    name: this.name,
                })
                console.log(`[🐩] ✅ inserted !`)
            } else {
                //
                console.log(`[🐩] found`, prev)
            }
        } catch (e) {
            console.error(`[🐩] ❌ publish failed !`)
            console.error(e)
        } finally {
            this.isPublishing = false
        }
    }

    /** globaly unique id (in theory...); 🔶 */
    get uid() {
        return this.data.createdAt
    }

    get name(): string {
        if (this.executable?.metadata?.name) return this.executable.metadata.name

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

    /** quick way to access the LibraryFile this app script comes from */
    get file(): LibraryFile {
        return this.st.library.getFile(this.relPath)
    }

    /** app description */
    get description(): string {
        return this.executable?.metadata?.description ?? '<no description>'
    }

    /** action display name */
    get illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded_or_SVG(): Maybe<string> {
        if (this.executable?.metadata?.illustration) return this.executable.metadata.illustration
        if (this.relPath.endsWith('.png')) return this.relPath
        return generateAvatar(this.relPath)
    }

    /** ready to be used in URL */
    get illustrationPathWithFileProtocol() {
        const tmp = this.illustrationPath_eiter_RelativeToDeckRoot_or_Base64Encoded_or_SVG
        if (tmp?.startsWith('data:')) return tmp
        if (tmp?.startsWith('http')) return tmp
        if (tmp?.startsWith('<svg')) throw new Error('SVG not supported')
        if (tmp) {
            if (tmp.startsWith('/')) return `file://${tmp}`
            return `file://${join(this.st.rootPath, tmp)}`
        }
        // default illustration if none is provided
        return `file://${join(this.st.rootPath, 'library/CushyStudio/default/_illustrations/default-card-illustration.jpg')}`
    }
}
