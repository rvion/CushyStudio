/*---------------------------------------------------------
bun --watch ./src/_/script-show-comfy-state.ts

Host: http://192.168.1.19:8188

Models:
  - 🟢 TAEF1 Decoder
  - 🟢 TAESD3 Decoder
  - 🟢 TAESDXL Decoder
  - ...

Plugins:
  - 🟢 ComfyUI-Manager
  - 🟢 ComfyUI Impact Pack
  - 🟢 ComfyUI's ControlNet Auxiliary Preprocessors
  - ...
---------------------------------------------------------*/

import chalk from 'chalk'

import { ComfyManager } from '../manager/ComfyManager'

const HOST = process.argv[2] ?? 'http://192.168.1.19:8188'

console.log(`\n${chalk.blueBright.bold('Host:')} ${chalk.yellowBright(HOST)}`)
const manager = new ComfyManager({
   getServerHostHTTP(): string {
      return HOST
   },
})

// #region models
console.log(`\n${chalk.blueBright.bold('Models:')}`)
const res1 = await manager.fetchModelList()
for (const m of res1.models) {
   if (m.installed !== 'True') continue
   console.log(`  - 🟢 ${m.name}`)
}

// #region region plugins
console.log(`\n${chalk.blueBright.bold('Plugins:')}`)
const res2 = await manager.fetchPluginList()
for (const p of res2.custom_nodes) {
   if (p.installed !== 'True') continue
   console.log(`  - 🟢 ${p.title}`)
}

console.log()
