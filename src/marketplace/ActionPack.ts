import { exec } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { join } from 'path'
import { ManualPromise } from 'src/utils/ManualPromise'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { Marketplace } from './makerplace'
import { Updater } from 'src/front/updater'
import { GithubRepoName, GithubUserName, asGithubRepoName, asGithubUserName } from 'src/front/githubUtils'

export type ActionPackData = {
    name: string
    github: string
    description?: string
    recommanded?: boolean
    BUILT_IN?: boolean
    customIconUrl?: string
}

export class ActionPack {
    actionPackFolder: AbsolutePath
    authorFolder: AbsolutePath
    authorName: GithubUserName
    repositoryName: GithubRepoName
    updater: Updater
    installK: ManualPromise<true>

    get st() {
        return this.makretplace.st
    }
    constructor(
        public makretplace: Marketplace,
        public data: ActionPackData,
    ) {
        const parts = this.data.github.split('/')
        if (parts.length !== 2) throw new Error(`❌ Invalid github url: ${this.data.github}`)
        this.authorName = asGithubUserName(parts[0])
        this.repositoryName = asGithubRepoName(parts[1])
        this.authorFolder = asAbsolutePath(join(this.st.actionsFolderPath, parts[0]))
        this.actionPackFolder = asAbsolutePath(join(this.st.actionsFolderPath, this.data.github))
        this.updater = new Updater(this.makretplace.st, { cwd: this.actionPackFolder, autoStart: false, runNpmInstall: false })
        this.installK = new ManualPromise<true>()

        if (existsSync(this.actionPackFolder)) {
            this.installK.resolve(true)
            if (!data.BUILT_IN) this.updater.start()
        }

        makeAutoObservable(this)
    }

    get isInstalled() {
        return Boolean(this.installK.value)
    }

    get stars() {
        const cache = (this.st.configFile.value.stars ??= {})
        const hasStarsCached = this.data.github in cache
        if (hasStarsCached) {
            // check timestamps
            return cache[this.data.github].stars
        }
        return 0
    }

    get githubURL() {
        return `https://github.com/${this.data.github}`
    }

    install = () => {
        // 1. make root folder
        mkdirSync(this.actionPackFolder, { recursive: true })

        // 2. clone
        const cmd = `git clone ${this.githubURL}`

        console.log('[💝] actionpack: installing with cmd:', cmd)
        this.installK.isRunning = true
        exec(cmd, { cwd: this.authorFolder }, (error, stdout) => {
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
