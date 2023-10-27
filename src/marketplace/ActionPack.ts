import type { ActionFile } from './ActionFile'

import { exec } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { join } from 'pathe'
import { ActionLibrary } from 'src/marketplace/ActionLibrary'
import {
    GithubRepo,
    GithubRepoName,
    GithubUser,
    GithubUserName,
    asGithubRepoName,
    asGithubUserName,
} from 'src/marketplace/githubUtils'
import { Updater } from 'src/front/updater'
import { ManualPromise } from 'src/utils/ManualPromise'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import { asAbsolutePath, asRelativePath } from 'src/utils/fs/pathUtils'
import { generateAvatar } from './AvatarGenerator'

export type ActionPackManifest = {
    /** customize your action pack name */
    name?: string
    /** customize your author name */
    authorName?: string
    /** short summary of your action pack */
    description?: string
    /** local path to an image in your action pack that should be used */
    icon?: string
}

/** e.g. actions/rvion/foo */
export type ActionPackFolder = Branded<string, { ActionPackFolder: true; RelativePath: true }>

/** e.g. actions/rvion */
export type ActionAuthorFolder = Branded<string, { ActionAuthorFolder: true; RelativePath: true }>

export class ActionPack {
    // "actions/rvion/cushy-example-actions"
    folderAbs: AbsolutePath
    folderRel: ActionPackFolder

    // "actions/rvion/cushy-example-actions"
    authorFolderAbs: AbsolutePath
    authorFolderRel: ActionAuthorFolder

    githubUserName: GithubUserName // "rvion"
    githubUser: GithubUser
    githubRepositoryName: GithubRepoName // "cushy-example-actions"
    githubRepository: GithubRepo

    // -------------
    updater: Updater
    installK: ManualPromise<true>

    /** sorting socre */
    get score() {
        if (this.st.githubUsername === this.githubUserName) return 100
        if (this.BUILT_IN) return 30
        return 1
    }

    get st() {
        return this.makretplace.st
    }
    name: string
    github: string
    BUILT_IN: boolean
    manifest: ActionPackManifest = {}
    actions: ActionFile[] = []

    get description() {
        return this.manifest.description ?? ''
    }

    constructor(
        //
        public makretplace: ActionLibrary,
        public folder: ActionPackFolder,
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
        this.authorFolderRel = asRelativePath(join(this.st.actionsFolderPathRel, parts[0])) as ActionAuthorFolder
        this.folderAbs = asAbsolutePath(join(this.st.actionsFolderPathAbs, this.github))
        this.folderRel = asRelativePath(join(this.st.actionsFolderPathRel, this.github)) as ActionPackFolder
        this.updater = new Updater(this.makretplace.st, { cwd: this.folderAbs, autoStart: false, runNpmInstall: false })
        this.installK = new ManualPromise<true>()

        if (existsSync(this.folderAbs)) {
            this.installK.resolve(true)
            if (!this.BUILT_IN) this.updater.start()
        }

        makeAutoObservable(this)
    }

    get logo() {
        if (this.BUILT_IN) return '/CushyLogo-512.png'
        return this.githubUser.localAvatarURL
        return generateAvatar(this.name)
    }

    get isInstalled() {
        return Boolean(this.installK.value)
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

    uninstall = () => {
        // toaster.push(<Notification>message</Notification>, { placement: 'topEnd' })
    }

    install = () => {
        // 1. make root folder
        mkdirSync(this.folderAbs, { recursive: true })

        // 2. clone
        const cmd = `git clone ${this.githubURL}`

        console.log('[💝] actionpack: installing with cmd:', cmd)
        this.installK.isRunning = true
        exec(cmd, { cwd: this.authorFolderAbs }, (error, stdout) => {
            console.log(stdout)
            this.installK.addLog(stdout)
            if (error) {
                this.installK.addLog(error.message)
                return this.installK.reject(error)
            }
            this.installK.resolve(true)
        })
        return this.installK
    }
}
