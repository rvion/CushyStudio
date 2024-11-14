import { convetComfySlotNameToCushySlotNameValidInJS } from '../core/normalizeJSIdentifier'

export function pythonModuleToShortestUnambiguousPrefix(pythonModule: string): string {
   if (pythonModule === 'nodes') return ''
   if (pythonModule.startsWith('comfy_extras.')) return '' //''
   if (pythonModule.startsWith('custom_nodes.'))
      return `${pythonModuleToNamespace_(pythonModule.replace('custom_nodes.', ''))}.`
   throw new Error(`unexpected pythonModule: ${pythonModule}`)
}

// export function pythonModuleToNamespace(pythonModule: string): string {
//    return `Comfy.${pythonModuleToNamespace_(pythonModule)}`
// }

function pythonModuleToNamespace_(pythonModule: string): string {
   if (pythonModule === 'nodes') return 'Base'
   return pythonModule
      .split('.')
      .map((i) => {
         let y = i
         if (y === 'comfy_extras') return 'Extra'
         if (y === 'custom_nodes') return 'Custom'

         if (y.startsWith('nodes_')) y = y.replace('nodes_', '')
         if (y.startsWith('ComfyUI-')) y = y.replace('ComfyUI-', '')
         if (y.startsWith('ComfyUI_')) y = y.replace('ComfyUI_', '')
         if (y.startsWith('comfyui_')) y = y.replace('comfyui_', '')
         if (y.startsWith('comfyui-')) y = y.replace('comfyui-', '')

         if (y.endsWith('_node_suite_comfyui')) y = y.replace('_node_suite_comfyui', '')
         if (y.endsWith('-node-suite-comfyui')) y = y.replace('-node-suite-comfyui', '')

         // y = y.replaceAll('-', '_')
         // y = y.replaceAll(' ', '_')
         // y = y.replaceAll('.', '_')
         return y
      })
      .map(convetComfySlotNameToCushySlotNameValidInJS)
      .join('.')
}

export function groupByAsArray<T>(arr: T[], key: (t: T) => string): [string, T[]][] {
   const grouppedDict = groupByAsDict(arr, key)
   return Object.entries(grouppedDict)
}

function groupByAsDict<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
   const res: Record<string, any[]> = {}
   for (const x of arr) {
      const k = key(x)
      if (res[k] == null) res[k] = []
      res[k].push(x)
   }
   return res
}
