import { exec } from 'child_process'
import { makeAutoObservable } from 'mobx'
import { STATE } from './state'

// Mock of the ShowPopup function. Replace with the actual imported function.
function ShowPopup(message: string) {
    console.log(`[Popup]: ${message}`)
}

// git fetch: Fetches the latest changes from the remote repository without making any changes to the local repository.
// git rev-parse origin/master: Retrieves the commit hash of the last commit on the master branch of the remote repository.
// git pull origin master: Pulls the latest changes from the master branch of the remote repository and merges them into the current branch.
// git rev-parse HEAD: Retrieves the commit hash of the current HEAD, i.e., the latest commit in the current branch.

export class Updater {
    private lastCommitAvailable: string = ''
    private currentCommit: string = ''
    private commitCountOnHead: number = 0
    private commitCountOnMaster: number = 0

    ready = false

    get currentVersion() {
        return `0.9.${this.commitCountOnHead}`
    }
    get nextVersion() {
        return `0.9.${this.commitCountOnMaster}`
    }
    get updateAvailable() {
        if (!this.ready) return false
        if (!this.lastCommitAvailable) return false
        if (!this.currentCommit) return false
        return this.lastCommitAvailable !== this.currentCommit
    }

    private ensureSingleRunningSetIntervalInstance = (p: NodeJS.Timeout) => {
        const __global__ = globalThis as any
        if (__global__.updaterInterval) clearInterval(__global__.updaterInterval)
        __global__.updaterInterval = p
    }

    constructor(public st: STATE) {
        makeAutoObservable(this)
        // Fetch updates in the background every 5 minutes
        this.checkForUpdates()
        const interval = (st.configFile.value.checkUpdateEveryMinutes ?? 5) * 60 * 1000
        this.ensureSingleRunningSetIntervalInstance(setInterval(() => this.checkForUpdates(), interval))
    }

    private async checkForUpdates() {
        try {
            console.log('[🚀] updater: checking for noew version')
            await this.fetchLastCommitAvailable()
            await this.updateCurrentCommit()
            this.commitCountOnHead = await this.getCommitCountForCurrentBranch()
            console.log('[🚀] updater: current version:', this.currentVersion)
            this.commitCountOnMaster = await this.getCommitCountForMaster()
            console.log('[🚀] updater: next version:', this.nextVersion)
            if (this.lastCommitAvailable !== this.currentCommit)
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

    getCommitCountForBranch = (branch: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            exec(`git rev-list --count ${branch}`, (error, stdout) => {
                if (error) return reject(error)
                const commitCount = parseInt(stdout.trim(), 10)
                resolve(commitCount)
            })
        })
    }

    fetchLastCommitAvailable(): Promise<string> {
        return new Promise((resolve, reject) => {
            exec('git fetch && git rev-parse origin/master', (error, stdout) => {
                if (error) return reject(error)
                this.lastCommitAvailable = stdout.trim()
                console.log('[🚀] updater: last Commit Available is', this.lastCommitAvailable)
                resolve(this.lastCommitAvailable)
            })
        })
    }

    updateToLastCommitAvailable(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('[🚀] updater: UPDATING...')
            exec('git pull origin master', (error) => {
                if (error) return reject(error)
                console.log('[🚀] updater: UPDATED')
                resolve()
            })
        })
    }

    updateCurrentCommit(): Promise<string> {
        return new Promise((resolve, reject) => {
            exec('git rev-parse HEAD', (error, stdout) => {
                if (error) return reject(error)
                this.currentCommit = stdout.trim()
                console.log('[🚀] updater: current Commit is', this.currentCommit)
                resolve(this.currentCommit)
            })
        })
    }
}
