import type { AbsolutePath, RelativePath } from 'src/utils/fs/BrandedPaths'
import type { STATE } from './state'

import { exec } from 'child_process'
import { existsSync, lstatSync, mkdirSync, statSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { join, relative } from 'pathe'
import simpleGit, { SimpleGit } from 'simple-git'
import { GithubUserName } from 'src/cards/GithubUser'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { deleteDirectoryRecursive } from './deleteDirectoryRecursive'
import { GithubRepoName } from 'src/cards/githubRepo'

export enum FolderKind {
    /** folder is managed by git (has a .git)*/
    FolderWithGit = 1,
    /** folder is not managed by git (no .git folder) */
    FolderWithoutGit,
    /** we don't know yet if the folder is managed by git */
    Unknown,
    /** Does not exists */
    DoesNotExist,
    /** is not a directory */
    NotADirectory,
}

type ManagedFolderConfig = {
    /** current working directory */
    absFolderPath: AbsolutePath
    /** github url */
    githubURL: string
    userName: GithubUserName
    repositoryName: GithubRepoName
    /** if true, will start checking for update right away */
    shouldAutoUpdate: boolean
    /** if true, will perform an `npm install` after succesful update */
    runNpmInstallAfterUpdate: boolean
    /** can be uninstalled */
    canBeUninstalled: boolean
    /**
     * allow you to specify the name of the beta branch if you have one
     * so early adopters can opt-out for early features
     * */
    betaBranch?: string
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
    /** the simple git  */
    git: Maybe<SimpleGit> = null
    /** so we can lock the interface during {fetch/install/uninstall/etc.} */
    currentAction: Maybe<string> = null
    /** debug logs go there */
    logs: string[] = []

    constructor(
        //
        public st: STATE,
        public config: ManagedFolderConfig,
    ) {
        this.relPath = asRelativePath(relative(this.st.rootPath, config.absFolderPath))
        this.absPath = config.absFolderPath

        this.updateInfos()
        makeAutoObservable(this)
    }

    updateInfos = () => {
        // case 1. folder does not exists
        if (!existsSync(this.config.absFolderPath)) {
            // I've noticed this happens when A user has a marketplace addon they have not installed
            this.status = FolderKind.DoesNotExist
            this.log(`❌ folder ${this.config.absFolderPath} could not be found`)
        }

        // case 2. folder is not a directory
        else if (!lstatSync(this.config.absFolderPath).isDirectory()) {
            // TODO: Figure out why this constructor is even reciving non-directories
            this.status = FolderKind.NotADirectory
            this.log(`❌ folder ${this.config.absFolderPath} is not a directory`)
            return
        }

        // case 3. folder is a directory
        else {
            if (this.git == null) this.git = simpleGit(this.config.absFolderPath)

            // 1. check if is git folder
            const isGitFolder = this._isGitFolder()
            if (isGitFolder) {
                this.updateGitInfo()
                this.periodicallyFetch()
            } else {
                this.status = FolderKind.FolderWithoutGit
                this.log('❌ not a git folder')
            }
        }
    }

    install = async (): Promise<void> => {
        if (this.git != null) throw new Error(`install: git is not null`)
        if (existsSync(this.config.absFolderPath)) throw new Error(`install: folder already exists`)
        if (this.currentAction != null) throw new Error(`install: already installing`)
        if (!this.config.canBeUninstalled) throw new Error(`install: cannot be installed`)

        this.currentAction = 'installing'
        // 1. make root folder
        const parentFolder = join(this.absPath, '..')
        mkdirSync(parentFolder, { recursive: true })

        // 2. clone
        const cmd = `git clone ${this.config.githubURL}`
        console.log('[💝] actionpack: installing with cmd:', cmd)
        const success = await new Promise<boolean>((resolve, reject) => {
            // this.installK.isRunning = true
            exec(cmd, { cwd: parentFolder }, (error, stdout) => {
                console.log(stdout)
                // this.installK.addLog(stdout)
                if (error) {
                    this.logs.push(error.message)
                    console.log(`[💝] actionpack install failure`, error)
                    return reject(error)
                } else {
                    console.log(`[💝] actionpack installed`)
                    resolve(true)
                }
            })
        })
        this.currentAction = null
        this.updateInfos()
        return
    }

    /** ask confirmation, then remove the whole folder */
    uninstall = () => {
        // 1. check if the folder exists
        if (!existsSync(this.config.absFolderPath)) {
            // I've noticed this happens when A user has a marketplace addon they have not installed
            this.status = FolderKind.DoesNotExist
            this.log(`❌ folder ${this.config.absFolderPath} could not be found`)
            return
        }
        // 2. check if the folder is a directory
        if (!this.config.canBeUninstalled) {
            this.log('❌ folder cannot be uninstalled')
            return
        }
        const confirm = window.confirm(`Are you sure you want to delete ${this.relPath}?`)
        if (confirm) {
            deleteDirectoryRecursive(this.absPath)
            this.git = null
            this.status = FolderKind.DoesNotExist
        }
        this.updateInfos()
    }

    // GIT INFOS -------------------------------------------------------------------------

    updateGitInfo = async (): Promise<void> => {
        // Get the default remote branch name
        if (this.git == null) return
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

    private _getHeadCommitsCount = async (refName: string): Promise<number> => {
        if (this.git == null) return 0
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
            exec(command, { cwd: this.config.absFolderPath }, (error, gitPullStdout, gitPullStrderr) => {
                if (error) {
                    this.lastPullAttempt = { attemptedAt, status: 'failure', gitPullTrace: error.message, gitPullStdout, gitPullStrderr, } // prettier-ignore
                    return reject(error)
                }
                const lastAttempt: UpdateTrace = { attemptedAt, status: 'success', gitPullTrace: 'success', gitPullStdout, gitPullStrderr, } // prettier-ignore
                this.lastPullAttempt = lastAttempt
                if (!this.config.runNpmInstallAfterUpdate) {
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
        if (cache[this.config.absFolderPath]) clearInterval(cache[this.config.absFolderPath])
        cache[this.config.absFolderPath] = p
    }

    periodicallyFetch = async (): Promise<void> => {
        const git = this.git
        if (git == null) return

        const MINUTE = 60 * 1000
        const now = Date.now() as Timestamp
        this.ensureSingleRunningSetIntervalInstance()

        // 1. check if is git folder
        const isGitFolder = this._isGitFolder()
        if (!isGitFolder) return

        const FETCH_HEAD_path = this.config.absFolderPath + '/.git/FETCH_HEAD'
        const FETCH_HEAD_path_exists = existsSync(FETCH_HEAD_path)

        // 2. get last fetch datetime
        let lastFetchAt: Timestamp
        if (FETCH_HEAD_path_exists) {
            const stats = statSync(FETCH_HEAD_path)
            lastFetchAt = stats.mtime.getTime() as Timestamp
            this.log('Last fetch was on:', stats.mtime)
        } else {
            lastFetchAt = 0 as Timestamp
        }
        this.lastFetchAt = lastFetchAt

        // 3. check desired update interval
        const minutesBetweenChecks = this.st.configFile.value.checkUpdateEveryMinutes ?? 5
        this.log(`checking for updates every ${minutesBetweenChecks} minutes`)
        const interval = minutesBetweenChecks * MINUTE

        // 4. wait until we should start the interval timer (based on past check)
        this.log(`last check was ${(now - lastFetchAt) / 1000}s ago`)
        const shouldUpdateNow = now - lastFetchAt > minutesBetweenChecks * MINUTE
        const delayBeforeFirstUpdate = shouldUpdateNow
            ? Math.floor(Math.random() * 1000 * 1)
            : minutesBetweenChecks * MINUTE - (now - lastFetchAt)
        this.nextFetchAt = now + delayBeforeFirstUpdate
        this.log(`udpate checking will start in ${Math.round(delayBeforeFirstUpdate / 1000)} seconds`)
        await new Promise((resolve) => setTimeout(resolve, delayBeforeFirstUpdate))

        // 5. start the update interval
        const periodicCheck = setInterval(async () => {
            this.nextFetchAt = Date.now() + interval
            await git.fetch()
            this.checkForUpdates()
        }, interval)
        this.ensureSingleRunningSetIntervalInstance(periodicCheck)
    }

    log = (...args: any[]) => console.log(`[🚀] (${this.relPath || 'root'})`, ...args)
    error = (...args: any[]) => console.error(`[🚀] (${this.relPath || 'root'})`, ...args)

    _gitInit = async (): Promise<void> => {
        if (this.currentAction != null) throw new Error(`updater is already already running`)
        try {
            this.currentAction = 'git init'
            const githubUserName: Maybe<GithubUserName> = this.st.githubUsername
            if (githubUserName == null) return console.log('❌ github username not set when runnign git init')
            const git: SimpleGit = simpleGit(this.config.absFolderPath)
            await git.init()
            await git.addRemote('origin', `https://github.com/${this.config.userName}/${this.config.repositoryName}`)
            await git.addRemote('github', `git@github.com:${this.config.userName}/${this.config.repositoryName}.git`)
            this.status = FolderKind.FolderWithGit
        } finally {
            this.currentAction = null
        }
    }

    private _isGitFolder = (): boolean => {
        const gitFolder = join(this.config.absFolderPath, '.git')
        const isGitFolder = existsSync(gitFolder)
        if (!isGitFolder) {
            this.status = FolderKind.FolderWithoutGit
        } else {
            this.status = FolderKind.FolderWithGit
        }
        return isGitFolder
    }

    checkForUpdates = async (): Promise<void> => {
        if (this.git == null) return
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
