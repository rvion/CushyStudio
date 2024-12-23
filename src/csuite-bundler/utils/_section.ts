import chalk from 'chalk'

import { wrapBox } from '../../manager/_utils/_wrapBox'

export function sectionTool(x: string): void {
   console.log(`tool: ${chalk.yellowBright(x)}`)
}

export function sectionObjective(x: string): void {
   console.log(chalk.gray.italic(`objective: ${x}`))
}

export function section(x: string): void {
   console.log('\n' + wrapBox(x, 1, chalk.bold.cyan))
}

// async function buildTailwind() {
//     // console.log(`[BUILD] 2. build css `)
//     try {
//         // Define file paths
//         const inputFilePath = path.join('@cushy/forms', 'main.css')
//         const outputFilePath = path.join('@cushy/forms', 'output.css')
//         // Read the CSS file
//         const css = readFileSync(inputFilePath, 'utf8')
//         // Process the CSS with Tailwind
//         const postcss = require('postcss')
//         const tailwindcss = require('tailwindcss')
//         const result = await postcss([tailwindcss]) //
//             .process(css, { from: inputFilePath, to: outputFilePath })
//         // Write the processed CSS to a file
//         writeFileSync(outputFilePath, result.css, 'utf-8')
//         if (result.map) writeFileSync(outputFilePath + '.map', result.map, 'utf-8')
//         console.log('Tailwind CSS build complete.')
//     } catch (error) {
//         console.error('Error occurred building css:', error)
//     }
// }
export function CRASH(): never {
   throw new Error('❌')
}
