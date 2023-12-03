import { LibraryFile } from './CardFile'

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import JSON5 from 'json5'
import { makeAutoObservable } from 'mobx'
import path, { join, relative } from 'pathe'
import { hasValidActionExtension } from 'src/back/ActionExtensions'
import { Library } from 'src/cards/Library'
import { GithubRepoName, asGithubRepoName } from 'src/cards/githubRepo'
import { GitManagedFolder } from 'src/updater/updater'
import { assets } from 'src/utils/assets/assets'
import { asAbsolutePath, asRelativePath } from 'src/utils/fs/pathUtils'
import { ManualPromise } from 'src/utils/misc/ManualPromise'
import { generateAvatar } from './AvatarGenerator'
import { ActionTagMethodList } from './Card'
import { asAppPath } from './CardPath'
import { ManifestError, PackageManifest, parseDeckManifest } from './DeckManifest'
import { GithubUser, GithubUserName, asGithubUserName } from './GithubUser'
import { shouldSkip } from './shouldSkip'
import { compilePackage } from 'src/back/transpiler'
import { BuildContext } from 'esbuild'

/** e.g. library/rvion/foo */
export type PackageRelPath = Branded<string, { ActionPackFolder: true; RelativePath: true }>

/** e.g. library/rvion */
export type AuthorFolder = Branded<string, { ActionAuthorFolder: true; RelativePath: true }>

/**
 * Wrapper around a package
 * can be used to manipulated both installed and uninstalled packages
 */
export class Package {
    // "library/rvion/example-deck"
    folderAbs: AbsolutePath
    folderRel: PackageRelPath

    // "library/rvion/example-deck"
    authorFolderAbs: AbsolutePath
    authorFolderRel: AuthorFolder

    /** github user name. e.g. "rvion" */
    githubUserName: GithubUserName

    /** github user proxy */
    githubUser: GithubUser

    /** github repository name without "user/" prefix */
    githubRepositoryName: GithubRepoName // "example-deck"

    /** proxy to the github repository */
    // githubRepository: GithubRepo

    /** ui state */
    folded: boolean

    /** and upda */
    updater: GitManagedFolder

    /** promise you can await if you need to ensure this package is installed first */
    installK: ManualPromise<true>

    /** sorting socre */
    get score() {
        if (this.isBuiltIn) return 1000
        // if (this.BUILT_IN && this.githubRepositoryName === 'default') return 1000
        if (this.st.githubUsername === this.githubUserName) return 100
        return 1 + this.stars / 1000
    }

    /** proxy to the application state */
    get st() { return this.library.st } // prettier-ignore

    /** package name */
    name: string

    /** package github shortname. e.g. "rvion/CushyStudio" */
    github: string

    /** special flag to manage built-in packages */
    isBuiltIn: boolean

    //
    manifestError: Maybe<ManifestError> = null
    manifestPath: AbsolutePath
    manifest!: PackageManifest

    apps_listedInManifest: LibraryFile[] = []
    apps_unlistedButFoundInFolder: LibraryFile[] = []
    /** list of all apps present in the package */
    get apps(): LibraryFile[] {
        return [
            //
            ...this.apps_listedInManifest,
            ...this.apps_unlistedButFoundInFolder,
        ]
    }

    get appsSorted(): LibraryFile[] {
        return this.apps.slice().sort((a, b) => {
            const diff = b.priority - a.priority
            if (diff) return diff
            return a.displayName.localeCompare(b.displayName)
        })
    }

    get logo() {
        if (this.isBuiltIn) return assets.public_CushyLogo_512_png
        return this.githubUser.localAvatarURL
        return generateAvatar(this.name)
    }

    get stars() {
        const cache = (this.st.configFile.value.stars ??= {})
        const hasStarsCached = this.github in cache
        if (hasStarsCached) {
            // TODO: check timestamps
            return cache[this.github].stars
        }
        return 0
    }

    get esbuildEntrypoints(): AbsolutePath[] {
        return this.apps.map((x) => x.absPath)
    }

    get githubURL() {
        return `https://github.com/${this.github}`
    }
    /** package description */
    get description() {
        return this.manifest.description ?? ''
    }

    constructor(
        /** singleton libraray */
        public library: Library,
        /** e.g. "library/rvion/foo" */
        public folder: PackageRelPath,
    ) {
        const parts2 = folder.split('/')
        if (parts2.length !== 3) throw new Error(`❌ Invalid github url: ${this.folder}`)
        this.github = parts2.slice(1).join('/')
        this.name = parts2[2]
        this.isBuiltIn = parts2[1] === 'CushyStudio'
        const parts = parts2.slice(1)

        // author infos
        this.githubUserName = asGithubUserName(parts[0])
        this.githubUser = GithubUser.get(this.st, this.githubUserName, this.isBuiltIn)
        this.authorFolderAbs = asAbsolutePath(join(this.st.actionsFolderPathAbs, parts[0]))
        this.authorFolderRel = asRelativePath(join(this.st.actionsFolderPathRel, parts[0])) as AuthorFolder

        // repo / package infos
        this.githubRepositoryName = asGithubRepoName(parts[1])
        this.folderAbs = asAbsolutePath(join(this.st.actionsFolderPathAbs, this.github))
        this.folderRel = asRelativePath(join(this.st.actionsFolderPathRel, this.github)) as PackageRelPath

        // misc paths
        this.manifestPath = asAbsolutePath(join(this.folderAbs, 'cushy-deck.json'))

        // UI
        this.folded = this.folderRel === 'library/CushyStudio/default' ? false : true
        this.updater = new GitManagedFolder(this.library.st, {
            absFolderPath: this.folderAbs,
            shouldAutoUpdate: false,
            runNpmInstallAfterUpdate: false,
            canBeUninstalled: this.githubUserName == 'CushyStudio' ? false : true,
            gitURLToFetchUpdatesFrom: this.githubURL,
            repositoryName: this.githubRepositoryName,
            userName: this.githubUserName,
        })
        this.installK = new ManualPromise<true>()

        // load everything
        this._loadManifest()
        this._discoverAllApps()
        // compilePackage(this)
        this.esbuildContext = compilePackage(this)
        this.isCompiled = existsSync(join(this.folderAbs, 'dist'))
        makeAutoObservable(this)
    }
    esbuildContext: Promise<BuildContext>

    rebuild = async () => {
        console.log('-- a', { eps: this.esbuildEntrypoints })
        const ctx = await this.esbuildContext
        console.log('-- b')
        await ctx.rebuild()
        console.log('-- c')
    }

    isCompiled = false
    // MANIFEST --------------------------------------------------------------------------------------------------

    /**
     * this functions must set
     *  - manifestError (contains the error type as `manifestError.type`)
     *  - manifest
     * */
    private _loadManifest = () => {
        try {
            // case 1 - missing ----------------------------------------------- ❌
            const manifestIsHere = existsSync(this.manifestPath)
            if (!manifestIsHere) {
                return this._useDefaultManifest({ type: 'no manifest' })
            }

            const manifestStr = readFileSync(this.manifestPath, 'utf8')
            const manifestJSON_ = JSON5.parse(manifestStr)
            const parsedManifest = parseDeckManifest(manifestJSON_)
            // case 2 - valid ------------------------------------------------- 🟢
            if (parsedManifest.success) {
                this.manifestError = null
                this.manifest = parsedManifest.value
                for (const x of this.manifest.cards ?? []) {
                    const cardAbsPath = asAbsolutePath(join(this.folderAbs, x.deckRelativeFilePath))
                    this._registerApp(cardAbsPath, 'manifest')
                }
            } else {
                // case 3 - invalid ------------------------------------------- ❌
                return this._useDefaultManifest({
                    type: 'invalid manifest',
                    errors: parsedManifest.value,
                })
            }
        } catch (error) {
            // case 4 - crash ------------------------------------------------ ❌
            console.log(`❌ failed to read ${this.manifestPath}`, error)
            return this._useDefaultManifest({ type: 'crash', error })
        }
    }
    private _useDefaultManifest = (reason: ManifestError) => {
        this.manifestError = reason
        this.manifest = {
            name: this.githubRepositoryName,
            authorName: this.githubUserName,
            description: '<no description>',
        }
    }

    // APPS --------------------------------------------------------------------------------------------------

    private _discoverAllApps = (): boolean => {
        console.log(`[💜] PKG ${this.name.padEnd(20)}: loading ${this.folderAbs}`)
        if (!existsSync(this.folderAbs)) return true
        this.recursivelyFindAppsInFolder(this.folderAbs)
        return true
    }

    /** @internal */
    private recursivelyFindAppsInFolder = (dir: string): void => {
        const files = readdirSync(dir)
        for (const baseName of files) {
            // TAGS ------------------------------------------------------------
            if (
                baseName === '_actionTags.ts' || //
                baseName === '_actionTags.js'
            ) {
                const name = dir.split('/').at(-1)
                const _this = this
                function load(tags: ActionTagMethodList) {
                    try {
                        tags.forEach((tag) => {
                            tag.key = `${name ? name : ''}/${tag.key}`
                            _this.st.actionTags.push(tag)
                        })
                        console.log(`[🏷️] Loaded action tags for ${dir}`)
                    } catch (error) {
                        console.log(`[🔴] Failed to load action tags for ${dir}/_actionTags.ts\nGot: ${tags}`)
                    }
                }
                try {
                    const loader = new Function('actionTags', readFileSync(asAbsolutePath(join(dir, baseName))).toString())
                    loader(load)
                } catch (error) {
                    console.log(`[🔴] Failed to load action tags for ${dir}/_actionTags.ts`)
                }
            }

            // SKIP ------------------------------------------------------------
            if (shouldSkip(baseName)) continue

            // FOLDERS ---------------------------------------------------------
            const absPath = asAbsolutePath(join(dir, baseName))
            const stat = statSync(absPath)
            if (stat.isDirectory()) {
                this.recursivelyFindAppsInFolder(absPath)
                continue
            }

            // FILES ---------------------------------------------------------
            const relPath = path.relative(this.st.rootPath, absPath)
            if (!hasValidActionExtension(relPath)) continue
            const parts = relPath.split('/').slice(0, 3)
            if (parts.length < 3) {
                console.log(`skipping file ${relPath} cause it's not in a valid action folder`)
                continue
            }
            this._registerApp(absPath, 'autodiscover')
        }
    }

    private _registerApp = (appAbsPath: AbsolutePath, foundIn: 'manifest' | 'autodiscover') => {
        const cardPath: AppPath = asAppPath(relative(this.st.rootPath, appAbsPath))
        const prev = this.library.getFile(cardPath)
        if (prev != null) return
        const card = new LibraryFile(this.library, this, appAbsPath, cardPath)
        this.library.cardsByPath.set(cardPath, card)

        if (foundIn === 'manifest') this.apps_listedInManifest.push(card)
        else this.apps_unlistedButFoundInFolder.push(card)
    }
}
