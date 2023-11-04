import type { CardFile } from './CardFile'

import { existsSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { join } from 'pathe'
import { assets } from 'src/assets/assets'
import { GitManagedFolder } from 'src/front/updater'
import { Library } from 'src/cards/Library'
import { GithubRepo, GithubRepoName, asGithubRepoName } from 'src/cards/githubRepo'
import { ManualPromise } from 'src/utils/ManualPromise'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from 'src/utils/fs/pathUtils'
import { generateAvatar } from './AvatarGenerator'
import { CardManifest, DeckManifest } from './DeckManifest'
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
        if (this.BUILT_IN && this.githubRepositoryName === 'default') return 1000
        if (this.st.githubUsername === this.githubUserName) return 100
        if (this.BUILT_IN) return 1
        return 1 + this.stars / 1000
    }

    get st() {
        return this.library.st
    }
    name: string
    github: string
    BUILT_IN: boolean
    manifest: DeckManifest = {
        name: '',
        authorName: '',
        description: '',
    }
    cards: CardFile[] = []
    get cardManifests(): CardManifest[] {
        const seen = new Set<string>()
        const out: CardManifest[] = []
        // add cards listed in manifest:
        for (const cardManifest of this.manifest.cards ?? []) {
            // if (seen.has(card.name)) continue
            seen.add(cardManifest.relativePath)
            out.push(cardManifest)
        }
        // add cards detected locally but not listed in manifest
        for (const card of this.cards) {
            if (seen.has(card.name)) continue
            const cardManifest = card.manifest
            seen.add(cardManifest.relativePath)
            out.push(cardManifest)
        }
        return out
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

        if (existsSync(this.folderAbs)) {
            this.installK.resolve(true)
            if (!this.BUILT_IN) this.updater.periodicallyFetch()
        }

        makeAutoObservable(this)
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
