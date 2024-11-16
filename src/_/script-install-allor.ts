import type { KnownComfyPluginTitle } from '../manager/generated/KnownComfyPluginTitle'

import chalk from 'chalk'

import { ComfyManager } from '../manager/ComfyManager'
import { ComfyManagerRepository } from '../manager/ComfyManagerRepository'

// #region objective
const HOST = process.argv[2] ?? 'http://192.168.1.19:8188'
const PLUGINS_TO_INSTALL: KnownComfyPluginTitle[] = [
   // some good background removal
   'TEMP_ComfyUI-BRIA_AI-RMBG',
   'Allor Plugin',
]

// #region state
const manager = new ComfyManager({ getServerHostHTTP(): string { return HOST } }) // prettier-ignore
const managerRepo = new ComfyManagerRepository({ check: false, genTypes: false })

// #region download plugins list
const pluginsBefore = await manager.fetchPluginList()
console.log(`[ℹ] ${pluginsBefore.custom_nodes.length} plugins found`)
console.log(`[ℹ]   - ${pluginsBefore.custom_nodes.filter((i) => i.installed === 'False').length} not installed`) // prettier-ignore
console.log(`[ℹ]   - ${pluginsBefore.custom_nodes.filter((i) => i.installed === 'True').length} installed`) // prettier-ignore
console.log(`[ℹ]   - ${pluginsBefore.custom_nodes.filter((i) => i.installed === 'Update').length} Requires Update`) // prettier-ignore

let effectiveInstallCount = 0

for (const PLUGIN_TO_INSTALL of PLUGINS_TO_INSTALL) {
   // #region find plugin
   console.log(`finding plugin "${PLUGIN_TO_INSTALL}"...`)
   const plugin = managerRepo.plugins_byTitle.get(PLUGIN_TO_INSTALL)
   if (plugin == null) {
      console.error(`  - ❌ no plugin found with title "${PLUGIN_TO_INSTALL}"`)
      continue
   }

   console.log(`finding found: `)
   console.log(plugin)

   // #region check if plugin is already installed
   console.log(`checking if plugin is already installed...`)
   const isAlreadyInstalled = pluginsBefore.custom_nodes.some(
      (p) => p.title === PLUGIN_TO_INSTALL && p.installed === 'True',
   )

   if (isAlreadyInstalled) {
      console.log(`  - ✔️ plugin is already installed!`)
      continue
   }

   // #region install it
   console.log(`  -  plugin is not installed yet!`)
   console.log(`installing plugin...`)
   const res2 = await manager.installPlugin(plugin)
   console.log(res2)
   effectiveInstallCount++
}

// #region Finalize Installation
if (effectiveInstallCount) {
   // #region restart comfy
   console.log(`Rebooting ComfyUI...`)
   try {
      await manager.rebootComfyUI()
   } catch (error) {
      console.error(`❌ error while rebooting ComfyUI:`, error)
   }
   // #region wait for host to be back online
   console.log(`Waiting for ComfyUI to be back online...`)
   await manager.waitForHostToBeBackOnline(10)

   // #region show new state after install, with the new plugins
   console.log(`Check that the newly installed plugin is properly installed...`)
   const pluginsNow = await manager.fetchPluginList()
   console.log(`\n${chalk.blueBright.bold('Plugins:')}`)
   for (const p of pluginsNow.custom_nodes) {
      if (p.installed !== 'True') continue
      const suffix = PLUGINS_TO_INSTALL.includes(p.title as KnownComfyPluginTitle) ? '🎉🎉🎉🎉🎉🎉🎉🎉' : ''
      console.log(`  - 🟢 ${p.title} ${suffix}`)
   }
} else {
   console.log(`No plugin was installed.`)
   console.log(`Exiting.`)
   process.exit(0)
}
