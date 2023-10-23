import type { RelativePath } from 'src/utils/fs/BrandedPaths'
import type { STATE } from './state'

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { asRelativePath } from 'src/utils/fs/pathUtils'

export type Timestamp = Branded<number, 'Timestamp'>

// --------------------------------------------------------------------------------
export type GithubRepoData = {
    fetchedAt: Timestamp
    json: {
        stargazers_count: number
    }
}
export type GithubRepoName = Branded<string, 'GithubRepoName'>
export const asGithubRepoName = (s: string) => s as GithubRepoName
export class GithubRepo {
    static cache = new Map<GithubRepoName, GithubRepo>()
    static get = (
        //
        st: STATE,
        user: GithubUser,
        repoName: GithubRepoName,
    ) => {
        // ensure cache folder exists
        const cacheFolder = `.cushy/github/${user.username}/`
        mkdirSync(cacheFolder, { recursive: true })

        let repo = GithubRepo.cache.get(repoName)
        if (repo) return repo
        repo = new GithubRepo(st, user, repoName)
        GithubRepo.cache.set(repoName, repo)
        return repo
    }
    fPath: RelativePath
    data: Maybe<GithubRepoData> = null
    constructor(
        //
        public st: STATE,
        public user: GithubUser,
        public repoName: GithubRepoName,
    ) {
        this.fPath = asRelativePath(`.cushy/github/${user.username}/${repoName}.json`)
        const prevExists = existsSync(this.fPath)
        if (prevExists) {
            try {
                const raw = readFileSync(this.fPath, 'utf-8')
                const json = JSON.parse(raw)
                this.data = json
            } catch (error) {}
        } else {
            this.downloadInfos()
        }
        makeAutoObservable(this)
    }

    downloadInfos = async () => {
        const now = Date.now()
        const response = await fetch(`https://api.github.com/repos/${this.user.username}/${this.repoName}`)
        if (!response.ok) throw new Error('Failed to fetch user data')
        try {
            const json = await response.json()
            writeFileSync(this.fPath, JSON.stringify({ fetchedAt: now, json }, null, 4))
            this.data = json
        } catch (error) {
            console.error(error)
        }
    }
}

// --------------------------------------------------------------------------------
export type GithubUserData = {
    fetchedAt: Timestamp
    json: {
        avatar_url: string
    }
}
export type GithubUserName = Branded<string, 'GithubUserName'>
export const asGithubUserName = (s: string) => s as GithubUserName
export class GithubUser {
    static cache = new Map<string, GithubUser>()
    static get = (
        //
        st: STATE,
        username: GithubUserName,
    ): GithubUser => {
        // ensure cache folder exists
        const cacheFolder = `.cushy/github/${username}/`
        mkdirSync(cacheFolder, { recursive: true })
        // instanciate a Github user
        let user = GithubUser.cache.get(username)
        if (user) return user
        user = new GithubUser(st, username)
        GithubUser.cache.set(username, user)
        return user
    }
    fPath: RelativePath
    data: Maybe<GithubUserData> = null
    private constructor(
        //
        public st: STATE,
        public username: GithubUserName,
    ) {
        this.fPath = asRelativePath(`.cushy/github/${username}/.${username}.json`)
        const prevExists = existsSync(this.fPath)

        // 1. cache info
        if (prevExists) {
            try {
                const raw = readFileSync(this.fPath, 'utf-8')
                const json = JSON.parse(raw)
                this.data = json
            } catch (error) {}
        } else {
            this.downloadInfos()
        }

        // 2. cache avatar
        if (!existsSync(this._foo)) {
            this.downloadImage()
        }
        makeAutoObservable(this)
    }

    // --------------------------------------------------------------------------------
    private _foo = `.cushy/github/${this.username}/avatar.png`
    get localAvatarURL() {
        return `file://${this.st.resolveFromRoot(asRelativePath(this._foo))}`
    }
    get avatarURL() {
        return this.data?.json.avatar_url
    }
    private _downloadImageRequested = false
    downloadImage = async () => {
        if (this._downloadImageRequested) return
        this._downloadImageRequested = true
        const imageURL = this.avatarURL
        if (!imageURL) return
        const response = await fetch(imageURL)
        if (!response.ok) throw new Error('Failed to fetch user data')
        try {
            const buffer = await response.arrayBuffer()
            writeFileSync(this._foo, Buffer.from(buffer))
        } catch (error) {
            console.error(`❌ GithubUser: downloadImage`, error)
        }
    }
    // --------------------------------------------------------------------------------
    downloadInfos = async () => {
        const now = Date.now()
        const response = await fetch(`https://api.github.com/users/${this.username}`)
        if (!response.ok) throw new Error('Failed to fetch user data')
        try {
            const json = await response.json()
            writeFileSync(this.fPath, JSON.stringify({ fetchedAt: now, json }, null, 4))
            this.data = json
        } catch (error) {
            console.error(error)
        }
    }
}
