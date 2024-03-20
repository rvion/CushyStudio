import { cwd } from 'process'
import { dts } from 'rollup-plugin-dts'

const root = cwd()
const config = [
    // …
    {
        // input: 'lib/controls/FormBuilder.loco.d.ts',
        input: `${root}/lib/controls/FormBuilder.loco.d.ts`,
        output: [{ file: `${root}/release-forms/main.d.ts`, format: 'es' }],
        plugins: [dts()],
    },
]

export default config
