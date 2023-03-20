https://jstools.dev/version-bump-prompt/

yarn global add @jsdevtools/version-bump-prompt

```
bump patch -c -t -p
```

```sh
bump --help

@jsdevtools/version-bump-prompt - Automatically (or with prompts) bump your version number, commit changes, tag, and push to Git

Usage: bump [release] [options] [files...]

release:
  The release version or type.  Can be one of the following:
   - A semver version number (ex: 1.23.456)
   - prompt: Prompt for the version number (this is the default)
   - major: Increase major version
   - minor: Increase minor version
   - patch: Increase patch version
   - premajor: Increase major version, pre-release
   - preminor: Increase preminor version, pre-release
   - prepatch: Increase prepatch version, pre-release
   - prerelease: Increase prerelease version

options:
  --preid <name>            The identifier for prerelease versions.
                            Defaults to "beta".

  -c, --commit [message]    Commit changed files to Git.
                            Defaults to "release vX.X.X".

  -t, --tag [tag]           Tag the commit in Git.
                            The Default tag is "vX.X.X"

  -p, --push                Push the Git commit.

  -a, --all                 Commit/tag/push ALL pending files,
                            not just the ones that were bumped.
                            (same as "git commit -a")

  --no-verify               Bypass Git commit hooks
                            (same as "git commit --no-verify")

  -v, --version             Show the version number

  -q, --quiet               Suppress unnecessary output

  -h, --help                Show usage information

  --ignore-scripts          Bypass version scripts

files...
  One or more files and/or globs to bump (ex: README.md *.txt docs/**/*).
  Defaults to package.json and package-lock.json.

Examples:

  bump patch

    Bumps the patch version number in package.json and package-lock.json.
    Nothing is committed to git.

  bump major --commit

    Bumps the major version number in package.json and package-lock.json.
    Commits package.json and package-lock.json to git, but does not tag the commit.

  bump -tpa README.md

    Prompts for the new version number and updates package.json, package-lock.json, and README.md.
    Commits ALL modified files to git, tags the commit, and pushes the commit.

  bump 4.27.9934 --tag "Version " bower.json docs/**/*.md

    Sets the version number to 4.27.9934 in package.json, package-lock.json, bower.json,
    and all markdown files in the "docs" directory.  Commits the updated files to git,
    and tags the commit as "Version 4.27.9934".
```
