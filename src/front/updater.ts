import simpleGit, { SimpleGit } from 'simple-git'
import { exec } from 'child_process'
import { makeAutoObservable } from 'mobx'
import { STATE } from './state'
import { relative } from 'path'

// git fetch: Fetches the latest changes from the remote repository without making any changes to the local repository.
// git rev-parse origin/master: Retrieves the commit hash of the last commit on the master branch of the remote repository.
// git pull origin master: Pulls the latest changes from the master branch of the remote repository and merges them into the current branch.
// git rev-parse HEAD: Retrieves the commit hash of the current HEAD, i.e., the latest commit in the current branch.

export class Updater {
    ready = false

    private renderVersion = (commitCount: number) => {
        const major = Math.floor(commitCount / 1000)
        const minor = Math.floor((commitCount % 1000) / 100)
        const patch = Math.floor(commitCount % 100)
        return `${major}.${minor}.${patch}`
    }
    get currentVersion() {
        return this.renderVersion(this.infos.headCommitsCount)
    }
    get nextVersion() {
        return this.renderVersion(this.infos.originCommitsCount)
    }
    get updateAvailable() {
        if (!this.ready) return false
        if (!this.infos.originCommitHash) return false
        if (!this.infos.headCommitHash) return false
        return this.infos.originCommitHash !== this.infos.headCommitHash
    }

    updateToLastCommitAvailable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.log('UPDATING...')
            const command = `git pull origin ${this.infos.mainBranchName}`
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
        this.commandErrors.clear()
        try {
            this.log('checking for new version')
            const infos = await getGitInfo(this.p.cwd)
            if (infos == null) {
                this.commandErrors.set('git', '❌ failure')
                return
            }
            this.infos = infos
            this.ready = true
        } catch (error) {
            console.error(`Error checking for updates: ${(error as any).message}`)
        }
    }
    infos: GitRepoInfos = {
        headCommitHash: '',
        originCommitHash: '',
        headCommitsCount: 0,
        originCommitsCount: 1,
        mainBranchName: '',
    }

    commandErrors = new Map<string, any>()
    get hasErrors() {
        return this.commandErrors.size > 0
    }
}

export type GitRepoInfos = {
    mainBranchName: string
    headCommitsCount: number
    originCommitsCount: number
    headCommitHash: string
    originCommitHash: string
}

async function getGitInfo(cwd: string): Promise<Maybe<GitRepoInfos>> {
    const git: SimpleGit = simpleGit(cwd)

    // Fetch latest from remote
    await git.fetch()

    async function getHeadCommitsCount(refName: string) {
        const logs = await git.log([refName])
        return logs.all.length
    }

    // Get the default remote branch name
    const remoteInfo = await git.remote(['show', 'origin'])
    if (remoteInfo == null) return

    const headBranchMatch = remoteInfo.match(/HEAD branch: (\S+)/)
    if (!headBranchMatch) {
        console.error("Couldn't determine the default branch.")
        return
    }

    const defaultBranch = headBranchMatch[1]

    // Number of commits in HEAD
    const headCommitsCount = await getHeadCommitsCount('HEAD')

    // Number of commits in origin/<main branch>
    const originCommitsCount = await getHeadCommitsCount(`origin/${defaultBranch}`)

    // Hash of commit in HEAD
    const headCommitHash = await git.revparse(['HEAD'])

    // Hash of commit in origin/<main branch>
    const originCommitHash = await git.revparse([`origin/${defaultBranch}`])

    return {
        mainBranchName: defaultBranch,
        headCommitsCount: headCommitsCount,
        originCommitsCount: originCommitsCount,
        headCommitHash: headCommitHash,
        originCommitHash: originCommitHash,
    }
}
