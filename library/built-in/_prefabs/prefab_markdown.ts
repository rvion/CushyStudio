import type { Runtime } from '../../../src/CUSHY'

export const output_demo_summary = (run: Runtime) => {
   run.output_HTML({
      title: 'demo html',
      htmlContent: `
        <h1> Hello </h1>
        <h2> Hello </h2>
    `,
   })
   run.output_Markdown({
      title: 'demo markdown',
      markdownContent: `
# Hello

this is a test

here are the 300 first chars from the readme:


${run.Filesystem.readFileSync('README.md', 'utf-8').slice(0, 300)}


Bye !

this is the last generated image:

![](${run.lastImage?.url})

`,
   })
}
