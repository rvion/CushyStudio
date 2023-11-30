import type { Runtime } from 'src'

export const output_demo_summary = (flow: Runtime) => {
    flow.output_Markdown(`
# Hello

this is a test

here are the 300 first chars from the readme:


${flow.fs.readFileSync('README.md', 'utf-8').slice(0, 300)}


Bye !

this is the last generated image:

![](${flow.lastImage?.url})

`)
}
