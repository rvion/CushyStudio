import { exec } from 'child_process'
import { makeAutoObservable } from 'mobx'
import { STATE } from './state'
import { relative } from 'path'

// Mock of the ShowPopup function. Replace with the actual imported function.
function ShowPopup(message: string) {
    console.log(`[Popup]: ${message}`)
}

// git fetch: Fetches the latest changes from the remote repository without making any changes to the local repository.
// git rev-parse origin/master: Retrieves the commit hash of the last commit on the master branch of the remote repository.
// git pull origin master: Pulls the latest changes from the master branch of the remote repository and merges them into the current branch.
// git rev-parse HEAD: Retrieves the commit hash of the current HEAD, i.e., the latest commit in the current branch.

export class Updater {
    private _lastCommitAvailable: string = ''
    private _currentCommit: string = ''
    private _commitCountOnHead: number = 0
    private _commitCountOnMaster: number = 0

    get lastCommitAvailable() {return this._lastCommitAvailable} // prettier-ignore
    get currentCommit() {return this._currentCommit} // prettier-ignore
    get commitCountOnHead() {return this._commitCountOnHead} // prettier-ignore
    get commitCountOnMaster() {return this._commitCountOnMaster} // prettier-ignore

    ready = false

    private renderVersion = (commitCount: number) => {
        const major = Math.floor(commitCount / 1000)
        const minor = Math.floor((commitCount % 1000) / 100)
        const patch = Math.floor(commitCount % 100)
        return `${major}.${minor}.${patch}`
    }
    get currentVersion() {
        return this.renderVersion(this._commitCountOnHead)
    }
    get nextVersion() {
        return this.renderVersion(this._commitCountOnMaster)
    }
    get updateAvailable() {
        if (!this.ready) return false
        if (!this._lastCommitAvailable) return false
        if (!this._currentCommit) return false
        return this._lastCommitAvailable !== this._currentCommit
    }

    private ensureSingleRunningSetIntervalInstance = (p: NodeJS.Timeout) => {
        const __global__ = globalThis as any
        const cache = (__global__.__UPDATERCACHE__ ??= {})
        if (cache[this.p.cwd]) clearInterval(cache[this.p.cwd])
        cache[this.p.cwd] = p
    }

    relativeFolder: string
    constructor(
        public st: STATE,
        public p: { cwd: string },
    ) {
        // initial udpate
        this.relativeFolder = relative(this.st.rootPath, p.cwd)
        const startDelay = Math.floor(Math.random() * 1000 * 2) // ~10seconds
        setTimeout(() => this.checkForUpdates(), startDelay)

        // Fetch updates in the background every 5 minutes
        const interval = (st.configFile.value.checkUpdateEveryMinutes ?? 5) * 60 * 1000
        this.ensureSingleRunningSetIntervalInstance(setInterval(() => this.checkForUpdates(), interval))

        // mobx stuff
        makeAutoObservable(this)
    }

    log = (...args: any[]) => console.log(`[🚀] updater for (${this.relativeFolder})`, ...args)

    async checkForUpdates() {
        try {
            this.log('checking for new version')
            this._commitCountOnHead = await this.getCommitCountForCurrentBranch()
            this.log('current version:', this.currentVersion)
            await this.fetchLastCommitAvailable()
            await this.updateCurrentCommit()
            this._commitCountOnMaster = await this.getCommitCountForMaster()
            this.log('next version:', this.nextVersion)
            if (this._lastCommitAvailable !== this._currentCommit)
                ShowPopup('A new version is available! Would you like to update?')
            this.ready = true
        } catch (error) {
            console.error(`Error checking for updates: ${(error as any).message}`)
        }
    }

    getCommitCountForCurrentBranch(): Promise<number> {
        return this.getCommitCountForBranch('HEAD')
    }

    getCommitCountForMaster(): Promise<number> {
        return this.getCommitCountForBranch('origin/master')
    }

    commandErrors = new Map<string, any>()
    get hasErrors() {
        return this.commandErrors.size > 0
    }

    getCommitCountForBranch = (branch: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            const command = `git rev-list --count ${branch}`
            this.commandErrors.delete(command)
            this.log(`🦊 executing command`)
            exec(command, { cwd: this.p.cwd }, (error, stdout) => {
                this.log(`🦊 got `, error, stdout)
                if (error) {
                    this.commandErrors.set(command, error)
                    return -1
                }
                const commitCount = parseInt(stdout.trim(), 10)
                resolve(commitCount)
            })
        })
    }

    fetchLastCommitAvailable(): Promise<string> {
        return new Promise((resolve, reject) => {
            const command = 'git fetch && git rev-parse origin/master'
            exec(command, { cwd: this.p.cwd }, (error, stdout) => {
                if (error) return reject(error)
                this._lastCommitAvailable = stdout.trim()
                this.log('last Commit Available is', this._lastCommitAvailable)
                resolve(this._lastCommitAvailable)
            })
        })
    }

    updateToLastCommitAvailable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.log('UPDATING...')
            const command = 'git pull origin master'
            exec(command, { cwd: this.p.cwd }, (error) => {
                if (error) return reject(error)
                exec('npm install', (error) => {
                    if (error) return reject(error)
                    this.log('UPDATED')
                    resolve()
                })
            })
        })
    }

    updateCurrentCommit(): Promise<string> {
        return new Promise((resolve, reject) => {
            exec('git rev-parse HEAD', { cwd: this.p.cwd }, (error, stdout) => {
                if (error) return reject(error)
                this._currentCommit = stdout.trim()
                this.log('current Commit is', this._currentCommit)
                resolve(this._currentCommit)
            })
        })
    }
}
