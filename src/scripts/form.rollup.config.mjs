import { cwd } from 'process'
import { dts } from 'rollup-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

const root = cwd()
const config = [
    {
        // input: 'lib/controls/FormBuilder.loco.d.ts',
        input: root + '/lib/controls/FormBuilder.loco.d.ts',
        output: [{ file: root + '/release-forms/main.d.ts', format: 'es' }],
        plugins: [dts(), visualizer({ template: 'raw-data' })],
    },
]

export default config
