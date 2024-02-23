import type { STATE } from '../state/state'

import { exec } from 'child_process'
import { existsSync, lstatSync, mkdirSync, statSync, utimesSync } from 'fs'
import { makeAutoObservable, runInAction } from 'mobx'
import { join, relative } from 'pathe'
import simpleGit, { SimpleGit } from 'simple-git'

import { FolderGitStatus } from '../cards/FolderGitStatus'
import { deleteDirectoryRecursive } from '../utils/fs/deleteDirectoryRecursive'
import { _formatAsRelativeDateTime } from './_getRelativeTimeString'
import { LogFifo } from './LogFIFO'
import { GithubRepoName } from 'src/cards/githubRepo'
import { GithubUserName } from 'src/cards/GithubUser'
import { asRelativePath } from 'src/utils/fs/pathUtils'

type ManagedFolderConfig = {
    /** current working directory */
    absFolderPath: AbsolutePath

    /** github url */
    gitURLToFetchUpdatesFrom: string

    userName: GithubUserName

    repositoryName: GithubRepoName

    /** if true, will start checking for update right away */
    shouldAutoUpdate: boolean

    /** if true, will perform an `npm install` after succesful update */
    runNpmInstallAfterUpdate: boolean

    /** can be uninstalled */
    canBeUninstalled: boolean
}

export class GitManagedFolder {
    constructor(
        //
        public st: STATE,
        public config: ManagedFolderConfig,
    ) {
        this.relPath = asRelativePath(relative(this.st.rootPath, config.absFolderPath))
        this.absPath = config.absFolderPath

        void this.updateInfos()
        makeAutoObservable(this)
    }

    /** relative path to the git folder */
    relPath: RelativePath

    /** absolute path to the git folder */
    absPath: AbsolutePath

    /** status of the folder */
    status = FolderGitStatus.Unknown

    /** timestamp when lsat fetched the repository */
    lastFetchAt = 0 as Timestamp

    /** timestamp when we should fetch next the repository */
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

    /** to be called when we notice the folder is not here or no longer git-manged */
    private resetAllGitInfos = () => {
        this.mainBranchName = ''
        this.headCommitsCount = 0
        this.originCommitsCount = 0
        this._stopPeriodicUpdateCheck()
    }

    /**
     * Main method
     * - does not fetch anything directly, only look for curent local infos
     * - is called at Updater instanciation and when fetching for updates
     * - if current folder is a valid git-managed folder with a remote,
     *   this function will also start a singleton periodic update check
     */
    private updateInfos = async () => {
        try {
            this.currentAction = 'updateInfos'
            // case 1. folder does not exists
            if (!existsSync(this.config.absFolderPath)) {
                this.status = FolderGitStatus.DoesNotExist
                this.resetAllGitInfos()
                this.log(`❌ folder ${this.config.absFolderPath} could not be found`)
                return
            }

            // case 2. path is not not a directory
            if (!lstatSync(this.config.absFolderPath).isDirectory()) {
                // TODO: Figure out why this constructor is even reciving non-directories
                this.status = FolderGitStatus.NotADirectory
                this.resetAllGitInfos()
                this.log(`❌ folder ${this.config.absFolderPath} is not a directory`)
                return
            }

            // ensure git is instanciated
            let git = this.git
            if (git == null) {
                this.git = simpleGit(this.config.absFolderPath)
                git = this.git
            }

            // case 3. folder is not a git folder
            const isGitFolder = this._isGitFolder()
            if (!isGitFolder) {
                this.status = FolderGitStatus.FolderWithoutGit
                this.resetAllGitInfos()
                this.log('❌ not a git folder')
                return
            }

            // Get the default remote branch name
            const remoteInfo = await git.raw(['symbolic-ref', 'HEAD'])
            // console.log({ remoteInfo })

            // const remoteInfo = await git.remote(['show', 'origin'])
            if (remoteInfo == null) {
                this.status = FolderGitStatus.FolderWithGitButWithProblems
                this.resetAllGitInfos()
                this.log('❌ no remote branch found')
                return
            }

            // get head branch
            const headBranchMatch = remoteInfo.slice(`/refs/heads`.length).trim()
            if (!headBranchMatch) {
                this.status = FolderGitStatus.FolderWithGitButWithProblems
                this.resetAllGitInfos()
                this.log("❌ Couldn't determine the default branch.")
                return
            }

            // update values
            const defaultBranch = headBranchMatch // headBranchMatch[1]
            const headCommitsCount = await _getHeadCommitsCount('HEAD')
            const originCommitsCount = await _getHeadCommitsCount(`origin/${defaultBranch}`)

            try {
                runInAction(() => {
                    this.mainBranchName = defaultBranch
                    this.headCommitsCount = headCommitsCount
                    this.originCommitsCount = originCommitsCount
                    this.status = FolderGitStatus.FolderWithGit
                })
            } catch (error) {
                this.log('❌ updateInfos failed', error)
                runInAction(() => {
                    this.status = FolderGitStatus.FolderWithGitButWithProblems
                })
                this.resetAllGitInfos()
                return
            }

            if (!this._hasPeriodicUpdateCheck()) {
                this._startPeriodicUpdateCheck()
            }

            // helpers
            async function _getHeadCommitsCount(refName: string): Promise<number> {
                if (git == null) return 0
                const logs = await git.log([refName])
                return logs.all.length
            }
        } catch (e) {
            this.log('❌ updateInfos failed', e)
        } finally {
            runInAction(() => {
                this.currentAction = null
            })
        }
    }

    // ===================================================================================================
    checkForUpdatesNow = async (): Promise<void> => {
        if (this.git == null) return
        this.commandErrors.clear()
        try {
            // first update just so we know the current folder is still okay
            await this.updateInfos()
            if (this.status !== FolderGitStatus.FolderWithGit) return
            await this.git.fetch()
            this._bumpLastFetchAt()
            await this.updateInfos()
        } catch (error) {
            this.error(`updates check failed: ${(error as any).message}`)
        }
    }

    private _bumpLastFetchAt = () => {
        const FETCH_HEAD_path = this.config.absFolderPath + '/.git/FETCH_HEAD'
        const FETCH_HEAD_path_exists = existsSync(FETCH_HEAD_path)
        if (FETCH_HEAD_path_exists) {
            const newTime = new Date()
            utimesSync(FETCH_HEAD_path, newTime, newTime)
        }
    }

    // ===================================================================================================
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
        const cmd = `git clone ${this.config.gitURLToFetchUpdatesFrom} --depth 1`
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
        this._stopPeriodicUpdateCheck()

        // 1. check if the folder exists
        if (!existsSync(this.config.absFolderPath)) {
            // I've noticed this happens when A user has a marketplace addon they have not installed
            this.status = FolderGitStatus.DoesNotExist
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
            this.status = FolderGitStatus.DoesNotExist
        }
        this.updateInfos()
    }

    // GIT INFOS -------------------------------------------------------------------------

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
        return `v${commitCount.toString()}`
        // const major = Math.floor(commitCount / 1000)
        // const minor = Math.floor((commitCount % 1000) / 100)
        // const patch = Math.floor(commitCount % 100)
        // return `${major}.${minor}.${patch}`
    }

    // UPDATE --------------------------------------------------------------------------------

    /** information regarding how the last pull went */
    lastPullAttempt: Maybe<UpdateTrace> = null

    /** true when more commit are present on origin */
    get hasUpdateAvailable() {
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

    // ======================================================================================================
    private _hasPeriodicUpdateCheck = (): boolean => {
        const __global__ = globalThis as any
        const cache = (__global__.__UPDATERCACHE__ ??= {})
        return cache[this.config.absFolderPath] != null
    }

    private _stopPeriodicUpdateCheck = () => {
        const __global__ = globalThis as any
        const cache = (__global__.__UPDATERCACHE__ ??= {})
        if (cache[this.config.absFolderPath]) clearInterval(cache[this.config.absFolderPath])
        cache[this.config.absFolderPath] = null
    }

    private _registerPeriodicUpdateCheck = (p: NodeJS.Timeout) => {
        const __global__ = globalThis as any
        const cache = (__global__.__UPDATERCACHE__ ??= {})
        if (cache[this.config.absFolderPath]) clearInterval(cache[this.config.absFolderPath])
        cache[this.config.absFolderPath] = p
    }

    private _startPeriodicUpdateCheck = async (): Promise<void> => {
        const git = this.git
        if (git == null) return

        const MINUTE = 60 * 1000
        const now = Date.now() as Timestamp

        this._stopPeriodicUpdateCheck()

        // // 1. check if is git folder
        // const isGitFolder = this._isGitFolder()
        // if (!isGitFolder) return

        // -----------------------------------------------------------------------------------
        // get lst update time
        const FETCH_HEAD_path = this.config.absFolderPath + '/.git/FETCH_HEAD'
        const FETCH_HEAD_path_exists = existsSync(FETCH_HEAD_path)
        // 2. get last fetch datetime
        let lastFetchAt: Timestamp
        if (FETCH_HEAD_path_exists) {
            const stats = statSync(FETCH_HEAD_path)
            lastFetchAt = stats.mtime.getTime() as Timestamp
            this.log('Last fetch was on:', _formatAsRelativeDateTime(stats.mtime))
        } else {
            lastFetchAt = 0 as Timestamp
        }
        this.lastFetchAt = lastFetchAt

        // -----------------------------------------------------------------------------------
        // 3. check desired update interval
        const minutesBetweenChecks = this.st.configFile.value.checkUpdateEveryMinutes ?? 5
        this.log(`checking for updates every ${minutesBetweenChecks} minutes`)
        const interval = minutesBetweenChecks * MINUTE

        // 4. wait until we should start the interval timer (based on past check)
        // this.log(`last check was ${(now - lastFetchAt) / 1000}s ago`)
        const shouldUpdateNow = now - lastFetchAt > minutesBetweenChecks * MINUTE
        const delayBeforeFirstUpdate = shouldUpdateNow
            ? Math.floor(Math.random() * 1000 * 1)
            : minutesBetweenChecks * MINUTE - (now - lastFetchAt)
        this.nextFetchAt = now + delayBeforeFirstUpdate
        this.log(`update checking will start in ${Math.round(delayBeforeFirstUpdate / 1000)} seconds`)
        await new Promise((resolve) => setTimeout(resolve, delayBeforeFirstUpdate))

        // 5. start the update interval
        const periodicCheck = setInterval(async () => {
            this.nextFetchAt = Date.now() + interval
            await git.fetch()
            this.checkForUpdatesNow()
        }, interval)
        this._registerPeriodicUpdateCheck(periodicCheck)
    }

    lastLogs = new LogFifo(100)
    log = (...args: any[]) => {
        this.lastLogs.add(args.join(' '))
        // console.log(`[🚀] (${this.relPath || 'root'})`, ...args)
    }
    error = (...args: any[]) => {
        console.error(`[🚀] (${this.relPath || 'root'})`, ...args)
    }

    // ===================================================================================================
    _gitInit = async (): Promise<void> => {
        if (this.currentAction != null) throw new Error(`updater is already already running`)
        try {
            this.log('starting git init')
            this.currentAction = 'git init'
            const githubUserName: Maybe<GithubUserName> = this.st.githubUsername

            // ensure we have a github username
            if (githubUserName == null) {
                this.log('❌ github username not set when runnign git init')
                return
            }
            const git: SimpleGit = simpleGit(this.config.absFolderPath)
            await git.init()
            // await git.addRemote('origin', `https://github.com/${this.config.userName}/${this.config.repositoryName}`)
            // await git.addRemote('github', `git@github.com:${this.config.userName}/${this.config.repositoryName}.git`)
            this.status = FolderGitStatus.FolderWithGit
        } catch (error) {
            this.log('❌ git init failed', error)
        } finally {
            this.currentAction = null
        }
    }

    // ===================================================================================================
    private _isGitFolder = (): boolean => {
        const gitFolder = join(this.config.absFolderPath, '.git')
        const isGitFolder = existsSync(gitFolder)
        return isGitFolder
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
