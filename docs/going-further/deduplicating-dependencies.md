# De-duplicating dependencies

## tools

- `find-duplicate-dependencies`
  - https://www.npmjs.com/package/find-duplicate-dependencies
  - https://stackoverflow.com/questions/35144327/how-to-find-npm-duplicate-packages

- `npm ls --parseable | xargs -L1 sh -c 'basename $1' dummy | sort | uniq -c | grep -v "^ *1 " | sort -rn`
  - https://stackoverflow.com/questions/35144327/how-to-find-npm-duplicate-packages
    - as of 2024-08-16:
        ```
        3 react
        2 three
        2 spark-md5
        2 react-window
        2 react-dom
        2 mime-types
        2 marked
        2 better-sqlite3
        ```
      ❌ THIS IS BUGGY

- `npm ls --parseable | awk -F/ '{if ($(NF-1) ~ /^@/) print $(NF-1)"/"$NF; else print $NF}' | sort | uniq -c | grep -v "^ *1 " | sort -rn`



## misc good habits to keep deps sane


- periodically run `ncu`
  - https://www.npmjs.com/package/npm-check-updates
  - apply changes to package.json with `ncu -u`
    - misc variants like `ncu -u -x electron` when some packages are to remain to some older vesions
- periodically run `npm audit`
  - and `npm audit fix`
- periodically run `npm update`
  - bump all package dependencies to their lateste version allowed by package.json;
- periodically run `npm dedupe`
    ```
    $ npm dedupe

    added 3 packages, removed 19 packages, changed 8 packages, and audited 985 packages in 5s

    147 packages are looking for funding
    run `npm fund` for details

    found 0 vulnerabilities
    ```