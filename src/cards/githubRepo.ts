// import type { RelativePath } from '../utils/fs/BrandedPaths'
// import type { STATE } from '../state/state'

// import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
// import { makeAutoObservable } from 'mobx'
// import { asRelativePath } from '../utils/fs/pathUtils'
// import { GithubUser } from './GithubUser'
// --------------------------------------------------------------------------------
// export type GithubRepoData = {
//     fetchedAt: Timestamp
//     json: {
//         stargazers_count: number
//     }
// }

export type GithubRepoName = Branded<string, { GithubRepoName: true }>
export const asGithubRepoName = (s: string) => s as GithubRepoName

// export class GithubRepo {
//     // --------------------------------------------------------------------------------
//     static cache = new Map<GithubRepoName, GithubRepo>()
//     static get = (
//         //
//         st: STATE,
//         user: GithubUser,
//         repoName: GithubRepoName,
//         isFake: boolean,
//     ) => {
//         // ensure cache folder exists
//         const cacheFolder = `.cushy/github/${user.username}/`
//         mkdirSync(cacheFolder, { recursive: true })

//         let repo = GithubRepo.cache.get(repoName)
//         if (repo) return repo
//         repo = new GithubRepo(st, user, repoName, isFake)
//         GithubRepo.cache.set(repoName, repo)
//         return repo
//     }

//     // --------------------------------------------------------------------------------
//     fPath: RelativePath
//     data: Maybe<GithubRepoData> = null
//     constructor(
//         //
//         public st: STATE,
//         public user: GithubUser,
//         public repoName: GithubRepoName,
//         public isFake: boolean,
//     ) {
//         this.fPath = asRelativePath(`.cushy/github/${user.username}/${repoName}.json`)
//         const prevExists = existsSync(this.fPath)
//         if (prevExists) {
//             try {
//                 const raw = readFileSync(this.fPath, 'utf-8')
//                 const json = JSON.parse(raw)
//                 this.data = json
//             } catch (error) {}
//             const cacheTime = this.data?.fetchedAt
//             if (typeof cacheTime === 'number') {
//                 const now = Date.now()
//                 const lastFetchWas = now - cacheTime
//                 const hour = 1000 * 60 * 60
//                 const maxDelay = hour * 4
//                 if (lastFetchWas > maxDelay) {
//                     this.downloadInfos()
//                 }
//             }
//         } else {
//             this.data = {
//                 fetchedAt: 0 as Timestamp,
//                 json: { stargazers_count: 0 },
//             }
//             this.downloadInfos()
//         }
//         makeAutoObservable(this)
//     }

//     downloadInfos = async () => {
//         if (this.isFake) return
//         const now = Date.now()
//         const response = await fetch(`https://api.github.com/repos/${this.user.username}/${this.repoName}`)
//         if (!response.ok) throw new Error('Failed to fetch repo data')
//         try {
//             const json = await response.json()
//             writeFileSync(this.fPath, JSON.stringify({ fetchedAt: now, json }, null, 4))
//             this.data = json
//         } catch (error) {
//             console.error(error)
//         }
//     }
// }
