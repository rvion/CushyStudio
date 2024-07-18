// console.log(`[🤠] files:`, allFiles.slice(0, 10), '...')
// UTILS ------------------------------------------
// function walk(dir: string) {
//     const entries = readdirSync(dir)
//     for (const e of entries) {
//         const path = `${dir}/${e}`
//         const isFile = statSync(path).isFile()
//         if (isFile) {
//             allFiles.push(path)
//         } else {
//             walk(path)
//         }
//     }
// }

/** maps:
 * '/lib/utils/example.ts' => 'src/utils/example'
 */
export function mapPathToModule(k: string) {
    return k
        .replace(/^\/lib\//, 'src/') //
        .replace(/\.d?\.?tsx?$/, '')
        .replace(/\.js$/, '')
}
