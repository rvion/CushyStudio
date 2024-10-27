/** enum that summarize git folder status */
export enum FolderGitStatus {
   /** folder is managed by git (has a .git) */
   FolderWithGit = 'FolderWithGit',

   /** folder is managed by git but is buggy */
   FolderWithGitButWithProblems = 'FolderWithGitButWithProblems',

   /** folder is not managed by git (no .git folder) */
   FolderWithoutGit = 'FolderWithoutGit',

   /** we don't know yet if the folder is managed by git */
   Unknown = 'Unknown',

   /** Does not exists */
   DoesNotExist = 'DoesNotExist',

   /** is not a directory */
   NotADirectory = 'NotADirectory',
}
