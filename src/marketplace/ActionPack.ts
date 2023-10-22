import { exec } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { join } from 'path'
import { ManualPromise } from 'src/utils/ManualPromise'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { Marketplace } from './makerplace'
import { Updater } from 'src/front/updater'

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
    authorName: string
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
        this.authorName = parts[0]
        this.authorFolder = asAbsolutePath(join(this.st.actionsFolderPath, parts[0]))
        this.actionPackFolder = asAbsolutePath(join(this.st.actionsFolderPath, this.data.github))
        this.updater = new Updater(this.makretplace.st, { cwd: this.actionPackFolder, autoStart: false })
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
        this.updateStars()
        return 0
    }

    // UGLY CODE
    private _isUpdatingStars = false
    private updateStars = () => {
        return
        if (this._isUpdatingStars) return
        this._isUpdatingStars = true
        // ugly
        const cmd = `curl -s https://api.github.com/repos/${this.data.github} | jq .stargazers_count`
        return new Promise<number>((resolve, reject) => {
            exec(cmd, {}, (error, stdout) => {
                if (error) reject(error)
                const stars = Number(stdout)
                this.st.configFile.update((t) => {
                    t.stars ??= {}
                    t.stars[this.data.github] = {
                        at: Date.now(),
                        stars,
                    }
                })
                resolve(stars)
            })
        })
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
