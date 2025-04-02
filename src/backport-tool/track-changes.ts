import type { DefaultLogFields, SimpleGit } from 'simple-git'

import chalk from 'chalk'
import * as fs from 'fs'
import * as path from 'path'
import simpleGit from 'simple-git'
import slugify from 'slugify'

// Configuration Interfaces
interface CodebaseConfig {
   path: string
   sharedSubfolderPath: string

   // Optional parameters for filtering commits
   startDate?: string // e.g., '2023-01-01'
   startCommit?: string // e.g., 'a1b2c3d4'
}

interface Config {
   loco: CodebaseConfig
   cushy: CodebaseConfig
}

// Commit Information Interface
interface CommitInfo extends DefaultLogFields {
   files: string[]
}

// Function to get commits that affect the shared folder with optional filtering
async function getCommits(
   git: SimpleGit,
   sharedFolder: string,
   startDate?: string,
   startCommit?: string,
): Promise<CommitInfo[]> {
   // Base log options
   const logOptions: any = {
      file: sharedFolder,
      '--name-only': null,
   }

   // Apply filtering based on startDate or startCommit
   if (startCommit) {
      logOptions.from = startCommit
      // Note: 'from' will include commits after the specified commit up to HEAD
   }
   if (startDate) {
      logOptions['--since'] = startDate
   }

   const log = await git.log(logOptions)
   return log.all.map((commit) => ({
      ...commit,
      files: commit.message ? commit.message.split('\n') : [],
   }))
}

// Function to get diffs for a specific commit and folder
async function getDiffForCommit(
   git: SimpleGit,
   commitSha: string,
   sharedFolder: string,
): Promise<{ file: string; diff: string }[]> {
   // Get the list of files changed in this commit within the shared folder
   const diffSummary = await git.raw([
      'diff-tree',
      '--no-commit-id',
      '--name-only',
      '-r',
      commitSha,
      sharedFolder,
   ])
   const files = diffSummary.split('\n').filter((f) => f.trim() !== '')

   const diffs = await Promise.all(
      files.map(async (file) => {
         const diff = await git.raw(['show', `${commitSha}`, '--', file])
         return { file, diff }
      }),
   )

   return diffs
}

// Function to analyze a single codebase with optional filtering
async function analyzeCodebase(
   git: SimpleGit,
   sharedFolder: string,
   startDate?: string,
   startCommit?: string,
): Promise<{ commitCount: number; commits: CommitInfo[] }> {
   const commits = await getCommits(git, sharedFolder, startDate, startCommit)
   return { commitCount: commits.length, commits }
}

// Utility function to format date and time
function formatDate(dateStr: string): string {
   const date = new Date(dateStr)
   const YYYY = date.getFullYear()
   const MM = String(date.getMonth() + 1).padStart(2, '0')
   const DD = String(date.getDate()).padStart(2, '0')
   const HH = String(date.getHours()).padStart(2, '0')
   const mm = String(date.getMinutes()).padStart(2, '0')
   const ss = String(date.getSeconds()).padStart(2, '0')
   return `${YYYY}${MM}${DD}_${HH}${mm}${ss}`
}

// Main Function
async function main(): Promise<void> {
   // === Configuration ===
   const startDate = '2025-03-01' // Optional: Specify if needed
   const config: Config = {
      loco: {
         path: path.resolve('/Users/loco/dev/monoloco'),
         sharedSubfolderPath: 'src/cushy-forms/src/csuite',
         startDate,
         // startCommit: 'a2f6e2fcdcb3099cd242896da1aa92bd9ed08792',
      },
      cushy: {
         path: path.resolve('/Users/loco/dev/CushyStudio'),
         sharedSubfolderPath: 'src/csuite',
         startDate,
         // startCommit: '078412c7c92191fd7063e51f8ee6998473f02338',
      },
   }

   // Check if paths exist
   ;[config.loco.path, config.cushy.path].forEach((p) => {
      if (!fs.existsSync(p)) {
         console.error(chalk.red(`Repository path does not exist: ${p}`))
         process.exit(1)
      }
   })

   // Initialize simple-git instances
   const gitLoco = simpleGit(config.loco.path)
   const gitCushy = simpleGit(config.cushy.path)

   console.log(chalk.blue('Analyzing Loco...'))
   const analysis1 = await analyzeCodebase(
      gitLoco,
      config.loco.sharedSubfolderPath,
      config.loco.startDate,
      config.loco.startCommit,
   )

   console.log(chalk.blue('Analyzing Cushy...'))
   const analysis2 = await analyzeCodebase(
      gitCushy,
      config.cushy.sharedSubfolderPath,
      config.cushy.startDate,
      config.cushy.startCommit,
   )

   // Determine which codebase has fewer changes
   let targetCodebase: SimpleGit
   let targetAnalysis: { commitCount: number; commits: CommitInfo[] }
   let targetName: string
   let targetSharedSubfolder: string

   // eslint-disable-next-line no-constant-condition
   if (analysis1.commitCount <= analysis2.commitCount || true /* 🔴 */) {
      targetCodebase = gitLoco
      targetAnalysis = analysis1
      targetName = 'monoloco'
      targetSharedSubfolder = config.loco.sharedSubfolderPath
   } else {
      targetCodebase = gitCushy
      targetAnalysis = analysis2
      targetName = 'cushystudio'
      targetSharedSubfolder = config.cushy.sharedSubfolderPath
   }

   console.log(chalk.green(`\n${targetName} did the least amount of changes.`))
   console.log('Generating diff files...\n')

   // Create output directory
   const timestamp = formatDate(new Date().toISOString())
   const outputDir = path.resolve(__dirname, `../commit_diffs_${timestamp}`)
   if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
   }

   // Iterate through each commit and generate diff files
   for (const commit of targetAnalysis.commits) {
      // Check if commit actually touched the shared folder
      const filesChanged: string[] = await targetCodebase
         .raw(['diff-tree', '--no-commit-id', '--name-only', '-r', commit.hash, targetSharedSubfolder])
         .then((output) => output.split('\n').filter((f) => f.trim() !== ''))

      if (filesChanged.length === 0) {
         // Commit did not touch the shared folder; skip
         continue
      }

      // Get diffs for each file in the shared folder
      const diffs = await getDiffForCommit(targetCodebase, commit.hash, targetSharedSubfolder)

      // Format commit date and time
      const commitDate = new Date(commit.date)
      const datePart = formatDate(commitDate.toISOString())

      // Short SHA
      const shortSha = commit.hash.substring(0, 7)

      // Author name (sanitize to remove spaces and special characters)
      const author = slugify(commit.author_name, { lower: true, strict: true })

      // Slugify commit message
      const commitMessageSlug = slugify(commit.message.split('\n')[0]!, { lower: true, strict: true })

      // Construct filename
      const filename = `${datePart}_${author}_${shortSha}_${commitMessageSlug}.diff`
      const filePath = path.join(outputDir, filename)

      // Aggregate diffs
      let fileContent = `# Commit: ${commit.hash}\n`
      fileContent += `**Author:** ${commit.author_name} <${commit.author_email}>\n`
      fileContent += `**Date:** ${commit.date}\n`
      fileContent += `**Message:** ${commit.message}\n\n`

      diffs.forEach((diffInfo) => {
         fileContent += `## File: ${diffInfo.file}\n\n`
         fileContent += '```diff\n'
         fileContent += `${diffInfo.diff}\n`
         fileContent += '```\n\n'
      })

      // Write to file
      fs.writeFileSync(filePath, fileContent, 'utf8')
      console.log(chalk.green(`Created diff file: ${filePath}`))
   }

   console.log(chalk.green(`\nAll relevant diff files have been generated in ${outputDir}`))
}

main().catch((err) => {
   console.error(chalk.red('An error occurred:'), err)
   process.exit(1)
})
