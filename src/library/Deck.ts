import type { CardFile } from './CardFile'

import { existsSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { join } from 'pathe'
import { assets } from 'src/assets/assets'
import { GitManagedFolder } from 'src/front/updater'
import { ActionLibrary } from 'src/library/Library'
import { GithubRepo, GithubRepoName, asGithubRepoName } from 'src/library/githubRepo'
import { ManualPromise } from 'src/utils/ManualPromise'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from 'src/utils/fs/pathUtils'
import { generateAvatar } from './AvatarGenerator'
import { DeckManifest } from './DeckManifest'
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
        if (this.st.githubUsername === this.githubUserName) return 100
        if (this.BUILT_IN && this.githubRepositoryName === 'default') return 99
        if (this.BUILT_IN) return 1
        return 1 + this.stars / 1000
    }

    get st() {
        return this.library.st
    }
    name: string
    github: string
    BUILT_IN: boolean
    manifest: DeckManifest = {}
    cards: CardFile[] = []

    get description() {
        return this.manifest.description ?? ''
    }

    constructor(
        /** singleton libraray */
        public library: ActionLibrary,
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
            cwd: this.folderAbs,
            autoStart: false,
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
