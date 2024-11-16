export function pythonModuleToShortestUnambiguousPrefix(pythonModule: string): string {
   if (pythonModule === 'nodes') return ''
   if (pythonModule.startsWith('comfy_extras.')) return '' //''
   if (pythonModule.startsWith('custom_nodes.')) {
      // return `${pythonModuleToNamespace_(pythonModule.replace('custom_nodes.', ''))}.`
      return (
         pythonModule //
            // remove always present "custom_nodes." prefix
            .replace(/^custom_nodes\./i, '')
            // remove common ~comfyui prefixes and suffixes
            .replace(/^comfyui[-_]/i, '')
            .replace(/[-_]comfyui$/i, '')
            // remove common ~nodes prefixes and suffixes
            .replace(/^nodes[-_]/i, '')
            .replace(/[-_]node[-_]suite$/i, '') + '.'
      )
   }
   throw new Error(`unexpected pythonModule: ${pythonModule}`)
}
