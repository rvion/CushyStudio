import type { STATE } from './state'
import type { AbsolutePath, RelativePath } from 'src/utils/fs/BrandedPaths'

import { exec } from 'child_process'
import { makeAutoObservable } from 'mobx'
import { join, relative } from 'pathe'
import simpleGit, { SimpleGit } from 'simple-git'
import { existsSync, statSync } from 'fs'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { GithubUserName } from 'src/library/GithubUser'

export enum FolderKind {
    /** folder is managed by git (has a .git)*/
    Git = 1,
    /** folder is not managed by git (no .git folder) */
    NotGit,
    /** we don't know yet if the folder is managed by git */
    Unknown,
}

export class GitManagedFolder {
    /** relative path to the git folder */
    relPath: RelativePath
    /** absolute path to the git folder */
    absPath: AbsolutePath
    /** status of the folder */
    status = FolderKind.Unknown
    // git infos
    lastFetchAt = 0 as Timestamp
    nextFetchAt = 0 as Timestamp
    /** Number of commits in origin/<main branch> */
    originCommitsCount = 0
    /** Number of commits in HEAD */
    headCommitsCount = 0
    /** main branch name; usually master (previous git default) or main (new git default) */
    mainBranchName = ''

    git: SimpleGit

    constructor(
        public st: STATE,
        public p: {
            /** current working directory */
            cwd: AbsolutePath
            /** if true, will start checking for update right away */
            autoStart: boolean
            /** if true, will perform an `npm install` after succesful update */
            runNpmInstall: boolean
        },
    ) {
        this.git = simpleGit(this.p.cwd)
        this.relPath = asRelativePath(relative(this.st.rootPath, p.cwd))
        this.absPath = p.cwd

        // 1. check if is git folder
        const isGitFolder = this._isGitFolder()
        if (isGitFolder) {
            this.updateGitInfo()
            this.periodicallyFetch()
        } else {
            this.status = FolderKind.NotGit
            this.log('❌ not a git folder')
        }

        makeAutoObservable(this)
    }

    // GIT INFOS -------------------------------------------------------------------------

    updateGitInfo = async (): Promise<void> => {
        // Get the default remote branch name
        const remoteInfo = await this.git.remote(['show', 'origin'])
        if (remoteInfo == null) return

        // get head branch
        const headBranchMatch = remoteInfo.match(/HEAD branch: (\S+)/)
        if (!headBranchMatch) {
            console.error("Couldn't determine the default branch.")
            return
        }
        // update values
        const defaultBranch = headBranchMatch[1]
        this.mainBranchName = defaultBranch
        this.headCommitsCount = await this._getHeadCommitsCount('HEAD')
        this.originCommitsCount = await this._getHeadCommitsCount(`origin/${defaultBranch}`)
        // console.log(
        //     //
        //     `🔴`,
        //     this.mainBranchName,
        //     this.headCommitsCount,
        //     this.originCommitsCount,
        // )

        // ⏸️ // Hash of commit in HEAD
        // ⏸️ const headCommitHash = await this.git.revparse(['HEAD'])

        // ⏸️ // Hash of commit in origin/<main branch>
        // ⏸️ const originCommitHash = await this.git.revparse([`origin/${defaultBranch}`])
    }

    private _getHeadCommitsCount = async (refName: string) => {
        const logs = await this.git.log([refName])
        return logs.all.length
    }

    // VERSIONNING -------------------------------------------------------------------------

    /** version installed */
    get currentVersion() {
        return this._renderVersion(this.headCommitsCount)
    }

    /** version available on origin */
    get nextVersion() {
        return this._renderVersion(this.originCommitsCount)
    }

    /** format the version using some naive algo */
    private _renderVersion = (commitCount: number) => {
        const major = Math.floor(commitCount / 1000)
        const minor = Math.floor((commitCount % 1000) / 100)
        const patch = Math.floor(commitCount % 100)
        return `${major}.${minor}.${patch}`
    }

    // UPDATE --------------------------------------------------------------------------------

    /** information regarding how the last pull went */
    lastPullAttempt: Maybe<UpdateTrace> = null

    /** true when more commit on origin */
    get updateAvailable() {
        if (this.originCommitsCount <= this.headCommitsCount) return false
        return true
    }

    /** attempt a git pull, and record as much informations as possible if it fails */
    updateToLastCommitAvailable(): Promise<void> {
        const attemptedAt = Date.now() as Timestamp
        return new Promise((resolve, reject) => {
            this.log('UPDATING...')
            const command = `git pull origin ${this.mainBranchName}`
            // phase 1: git pull
            exec(command, { cwd: this.p.cwd }, (error, gitPullStdout, gitPullStrderr) => {
                if (error) {
                    this.lastPullAttempt = { attemptedAt, status: 'failure', gitPullTrace: error.message, gitPullStdout, gitPullStrderr, } // prettier-ignore
                    return reject(error)
                }
                const lastAttempt: UpdateTrace = { attemptedAt, status: 'success', gitPullTrace: 'success', gitPullStdout, gitPullStrderr, } // prettier-ignore
                this.lastPullAttempt = lastAttempt
                if (!this.p.runNpmInstall) {
                    this.log('UPDATED')
                    return resolve()
                }

                // phase 2: npm install
                exec('npm install', (error, npmInstallStdout, npmInstallStrderr) => {
                    lastAttempt.npmInstallStdout = npmInstallStdout
                    lastAttempt.npmInstallStrderr = npmInstallStrderr
                    if (error) {
                        lastAttempt.status = 'failure'
                        lastAttempt.npmInstallTrace = error.message
                        return reject(error)
                    } else {
                        lastAttempt.status = 'success'
                        lastAttempt.npmInstallTrace = 'success'
                        this.log('UPDATED')
                        return resolve()
                    }
                })
            })
        })
    }

    private ensureSingleRunningSetIntervalInstance = (p: Maybe<NodeJS.Timeout> = null) => {
        const __global__ = globalThis as any
        const cache = (__global__.__UPDATERCACHE__ ??= {})
        if (cache[this.p.cwd]) clearInterval(cache[this.p.cwd])
        cache[this.p.cwd] = p
    }

    periodicallyFetch = async () => {
        const MINUTE = 60 * 1000
        const now = Date.now() as Timestamp
        this.ensureSingleRunningSetIntervalInstance()

        // 1. check if is git folder
        const isGitFolder = this._isGitFolder()
        if (!isGitFolder) return

        // 2. get last fetch datetime
        const stats = statSync(this.p.cwd + '/.git/FETCH_HEAD')
        const lastCheckTs = stats.mtime.getTime() as Timestamp
        this.log('Last fetch was on:', stats.mtime)
        this.lastFetchAt = lastCheckTs

        // 3. check desired update interval
        const minutesBetweenChecks = this.st.configFile.value.checkUpdateEveryMinutes ?? 5
        this.log(`checking for updates every ${minutesBetweenChecks} minutes`)
        const interval = minutesBetweenChecks * MINUTE

        // 4. wait until we should start the interval timer (based on past check)
        this.log(`last check was ${(now - lastCheckTs) / 1000}s ago`)
        const shouldUpdateNow = now - lastCheckTs > minutesBetweenChecks * MINUTE
        const delayBeforeFirstUpdate = shouldUpdateNow
            ? Math.floor(Math.random() * 1000 * 1)
            : minutesBetweenChecks * MINUTE - (now - lastCheckTs)
        this.nextFetchAt = now + delayBeforeFirstUpdate
        this.log(`udpate checking will start in ${Math.round(delayBeforeFirstUpdate / 1000)} seconds`)
        await new Promise((resolve) => setTimeout(resolve, delayBeforeFirstUpdate))

        // 5. start the update interval
        const periodicCheck = setInterval(async () => {
            this.nextFetchAt = Date.now() + interval
            await this.git.fetch()
            this.checkForUpdates()
        }, interval)
        this.ensureSingleRunningSetIntervalInstance(periodicCheck)
    }

    log = (...args: any[]) => console.log(`[🚀] (${this.relPath || 'root'})`, ...args)
    error = (...args: any[]) => console.error(`[🚀] (${this.relPath || 'root'})`, ...args)

    private _gitInit = async (cwd: string, githubUserName: GithubUserName): Promise<void> => {
        const git: SimpleGit = simpleGit(cwd)
        await git.init()
        await git.addRemote('origin', `https://github.com/${githubUserName}/CushyStudio`)
        await git.addRemote('origin', `git@github.com:${githubUserName}/CushyStudio.git`)
        this.status = FolderKind.Git
    }

    private _isGitFolder = (): boolean => {
        const gitFolder = join(this.p.cwd, '.git')
        const isGitFolder = existsSync(gitFolder)
        if (!isGitFolder) {
            this.status = FolderKind.NotGit
        } else {
            this.status = FolderKind.Git
        }
        return isGitFolder
    }

    checkForUpdates = async (): Promise<void> => {
        // if (!this._isGitFolder()) return
        this.commandErrors.clear()
        try {
            await this.git.fetch()
            await this.updateGitInfo()
        } catch (error) {
            this.error(`updates check failed: ${(error as any).message}`)
        }
    }

    commandErrors = new Map<string, any>()
    get hasErrors() {
        return this.commandErrors.size > 0
    }
}

export type UpdateTrace = {
    attemptedAt: Timestamp
    status: 'success' | 'failure'
    // pull
    gitPullTrace: string
    gitPullStdout: string
    gitPullStrderr: string
    // install
    npmInstallTrace?: string
    npmInstallStdout?: string
    npmInstallStrderr?: string
}

// git fetch: Fetches the latest changes from the remote repository without making any changes to the local repository.
// git rev-parse origin/master: Retrieves the commit hash of the last commit on the master branch of the remote repository.
// git pull origin master: Pulls the latest changes from the master branch of the remote repository and merges them into the current branch.
// git rev-parse HEAD: Retrieves the commit hash of the current HEAD, i.e., the latest commit in the current branch.

// export type GitRepoInfos = {
//     fetchedAt: Timestamp
//     mainBranchName: string
//     headCommitsCount: number
//     originCommitsCount: number
//     // headCommitHash: string
//     // originCommitHash: string
// }

// this.fet
// const isGitFolder = this._isGitFolder()
// if (!isGitFolder) {
//     this.infos = {
//         isGitRepository: false,
//         fetchedAt: Date.now() as Timestamp,
//         headCommitHash: '-',
//         originCommitHash: '-',
//         headCommitsCount: 0,
//         mainBranchName: '-',
//         originCommitsCount: 0,
//     }
//     return
// }

// this.log('checking for new version')
// // const infos = await this.getGitInfo(this.p.cwd, true)
// if (infos == null) {
//     this.commandErrors.set('git', '❌ failure')
//     return
// }
// this.infos = infos
