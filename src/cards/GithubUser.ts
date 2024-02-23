import type { STATE } from 'src/state/state'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'

import { asRelativePath } from 'src/utils/fs/pathUtils'

// --------------------------------------------------------------------------------
export type GithubUserData = {
    fetchedAt: Timestamp
    json: {
        avatar_url: string
    }
}
export type GithubUserName = Branded<string, { GithubUserName: true }>
export const asGithubUserName = (s: string) => s as GithubUserName

export class GithubUser {
    static cache = new Map<string, GithubUser>()

    static get = (st: STATE, username: GithubUserName, isFake: boolean): GithubUser => {
        // ensure cache folder exists
        const cacheFolder = `.cushy/github/${username}/`
        mkdirSync(cacheFolder, { recursive: true })
        // instanciate a Github user
        let user = GithubUser.cache.get(username)
        if (user) return user
        user = new GithubUser(st, username, isFake)
        GithubUser.cache.set(username, user)
        return user
    }

    // fPath: RelativePath
    data: Maybe<GithubUserData> = null

    private constructor(
        //
        public st: STATE,
        public username: GithubUserName,
        public isFake: boolean,
    ) {
        // this.fPath = asRelativePath(`.cushy/github/${username}/.${username}.json`)
        // const prevExists = existsSync(this.fPath)
        // // 1. cache info
        // if (prevExists) {
        //     try {
        //         const raw = readFileSync(this.fPath, 'utf-8')
        //         const json = JSON.parse(raw)
        //         this.data = json
        //     } catch (error) {}
        // } else {
        //     this.downloadInfos()
        // }

        // 2. cache avatar
        if (!existsSync(this.githubUserAvatarRelPath)) {
            this.downloadImage()
        }
        makeAutoObservable(this)
    }

    // --------------------------------------------------------------------------------
    private githubUserAvatarRelPath = `.cushy/github/${this.username}/avatar.png`
    get localAvatarURL() {
        return `file://${this.st.resolveFromRoot(asRelativePath(this.githubUserAvatarRelPath))}`
    }
    get avatarURL() {
        return this.data?.json.avatar_url
    }

    private _downloadImageRequested = false
    downloadImage = async () => {
        if (this.isFake) return
        if (this._downloadImageRequested) return
        this._downloadImageRequested = true
        const imageURL = this.avatarURL
        if (!imageURL) return
        const response = await fetch(imageURL)
        if (!response.ok) throw new Error('Failed to fetch user data')
        try {
            const buffer = await response.arrayBuffer()
            writeFileSync(this.githubUserAvatarRelPath, Buffer.from(buffer))
        } catch (error) {
            console.error(`❌ GithubUser: downloadImage`, error)
        }
    }

    // --------------------------------------------------------------------------------
    // downloadInfos = async () => {
    //     const now = Date.now()
    //     if (this.isFake)
    //         return {
    //             fetchedAt: 0 as Timestamp,
    //             json: { avatar_url: assets.CushyLogo_512_png },
    //         }
    //     const response = await fetch(`https://api.github.com/users/${this.username}`)
    //     if (!response.ok) throw new Error('Failed to fetch user data')
    //     try {
    //         const json = await response.json()
    //         writeFileSync(this.fPath, JSON.stringify({ fetchedAt: now, json }, null, 4))
    //         this.data = json
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
}
