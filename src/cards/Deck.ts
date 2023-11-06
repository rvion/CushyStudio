import { CardFile } from './CardFile'

import { existsSync, readFileSync } from 'fs'
import JSON5 from 'json5'
import { makeAutoObservable } from 'mobx'
import { join, relative } from 'pathe'
import { assets } from 'src/utils/assets/assets'
import { Library } from 'src/cards/Library'
import { GithubRepo, GithubRepoName, asGithubRepoName } from 'src/cards/githubRepo'
import { GitManagedFolder } from 'src/cards/updater'
import { ManualPromise } from 'src/utils/misc/ManualPromise'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from 'src/utils/fs/pathUtils'
import { generateAvatar } from './AvatarGenerator'
import { CardPath, asCardPath } from './CardPath'
import { DeckManifest, ManifestError, parseDeckManifest } from './DeckManifest'
import { GithubUser, GithubUserName, asGithubUserName } from './GithubUser'

/** e.g. library/rvion/foo */
export type DeckFolder = Branded<string, { ActionPackFolder: true; RelativePath: true }>

/** e.g. library/rvion */
export type AuthorFolder = Branded<string, { ActionAuthorFolder: true; RelativePath: true }>

/** a set of cards created by someone */
export class Deck {
    // "library/rvion/example-deck"
    folderAbs: AbsolutePath
    folderRel: DeckFolder

    // "library/rvion/example-deck"
    authorFolderAbs: AbsolutePath
    authorFolderRel: AuthorFolder

    githubUserName: GithubUserName // "rvion"
    githubUser: GithubUser
    githubRepositoryName: GithubRepoName // "example-deck"
    githubRepository: GithubRepo

    // -------------
    folded = true
    updater: GitManagedFolder
    installK: ManualPromise<true>

    /** sorting socre */
    get score() {
        if (this.BUILT_IN) return 1000
        // if (this.BUILT_IN && this.githubRepositoryName === 'default') return 1000
        if (this.st.githubUsername === this.githubUserName) return 100
        return 1 + this.stars / 1000
    }

    get st() {
        return this.library.st
    }
    name: string
    github: string
    BUILT_IN: boolean

    //
    manifestError: Maybe<ManifestError> = null
    manifest!: DeckManifest
    cards: CardFile[] = []

    get cardsSorted(): CardFile[] {
        return this.cards.slice().sort((a, b) => {
            const diff = b.priority - a.priority
            if (diff) return diff
            return a.displayName.localeCompare(b.displayName)
        })
    }

    get description() {
        return this.manifest.description ?? ''
    }

    constructor(
        /** singleton libraray */
        public library: Library,
        /** e.g. "library/rvion/foo" */
        public folder: DeckFolder,
    ) {
        const parts2 = folder.split('/')
        if (parts2.length !== 3) throw new Error(`❌ Invalid github url: ${this.folder}`)
        this.github = parts2.slice(1).join('/')
        this.name = parts2[2]
        this.BUILT_IN = parts2[1] === 'CushyStudio'
        const parts = parts2.slice(1)

        // github
        this.githubUserName = asGithubUserName(parts[0])
        this.githubUser = GithubUser.get(this.st, this.githubUserName, this.BUILT_IN)
        this.githubRepositoryName = asGithubRepoName(parts[1])
        this.githubRepository = GithubRepo.get(this.st, this.githubUser, this.githubRepositoryName, this.BUILT_IN)
        this.authorFolderAbs = asAbsolutePath(join(this.st.actionsFolderPathAbs, parts[0]))
        this.authorFolderRel = asRelativePath(join(this.st.actionsFolderPathRel, parts[0])) as AuthorFolder
        this.folderAbs = asAbsolutePath(join(this.st.actionsFolderPathAbs, this.github))
        this.folderRel = asRelativePath(join(this.st.actionsFolderPathRel, this.github)) as DeckFolder
        this.updater = new GitManagedFolder(this.library.st, {
            absFolderPath: this.folderAbs,
            shouldAutoUpdate: false,
            runNpmInstallAfterUpdate: false,
            canBeUninstalled: this.githubUserName == 'CushyStudio' ? false : true,
            githubURL: this.githubURL,
            repositoryName: this.githubRepositoryName,
            userName: this.githubUserName,
        })
        this.installK = new ManualPromise<true>()

        this.loadManifest()

        if (existsSync(this.folderAbs)) {
            this.installK.resolve(true)
            if (!this.BUILT_IN) this.updater.periodicallyFetch()
        }

        makeAutoObservable(this)
    }

    /** this functions must set {manifestError, manifestType, manifest} */
    private loadManifest = () => {
        const manifestPath = join(this.folderAbs, 'cushy-deck.json')
        try {
            // case 1 - missing ----------------------------------------------- ❌
            const manifestIsHere = existsSync(manifestPath)
            if (!manifestIsHere) {
                return this._setDefaultManifest({ type: 'no manifest' })
            }

            const manifestStr = readFileSync(manifestPath, 'utf8')
            const manifestJSON_ = JSON5.parse(manifestStr)
            const parsedManifest = parseDeckManifest(manifestJSON_)
            // case 2 - valid ------------------------------------------------- 🟢
            if (parsedManifest.success) {
                this.manifestError = null
                this.manifest = parsedManifest.value
                for (const x of this.manifest.cards ?? []) {
                    const cardAbsPath = asAbsolutePath(join(this.folderAbs, x.deckRelativeFilePath))
                    this._registerCard(cardAbsPath, 'A')
                }
            } else {
                // case 3 - invalid ------------------------------------------- ❌
                return this._setDefaultManifest({
                    type: 'invalid manifest',
                    errors: parsedManifest.value,
                })
            }
        } catch (error) {
            // case 4 - crash ------------------------------------------------ ❌
            console.log(`❌ failed to read ${manifestPath}`, error)
            return this._setDefaultManifest({ type: 'crash', error })
        }
    }
    _registerCard = (cardAbsPath: AbsolutePath, debugReason: string) => {
        const cardPath: CardPath = asCardPath(relative(this.st.rootPath, cardAbsPath))
        const prev = this.library.getCard(cardPath)
        // console.log(`>> ${debugReason} 🤓👉 prev is `, Boolean(prev), `(${this.library.cardsByPath.size})`)
        if (prev != null) return
        // console.log(`>> ${debugReason} 🤓👉`, cardPath)
        const card = new CardFile(this.library, this, cardAbsPath, cardPath)
        this.library.cardsByPath.set(cardPath, card)
        this.cards.push(card)
    }
    private _setDefaultManifest = (reason: ManifestError) => {
        this.manifestError = reason
        this.manifest = {
            name: this.githubRepositoryName,
            authorName: this.githubUserName,
            description: '<no description because no manifest>',
        }
    }

    get logo() {
        if (this.BUILT_IN) return assets.public_CushyLogo_512_png
        return this.githubUser.localAvatarURL
        return generateAvatar(this.name)
    }

    get stars() {
        const cache = (this.st.configFile.value.stars ??= {})
        const hasStarsCached = this.github in cache
        if (hasStarsCached) {
            // TODO: check timestamps
            return cache[this.github].stars
        }
        return 0
    }

    get githubURL() {
        return `https://github.com/${this.github}`
    }
}
