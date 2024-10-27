/** return true if the file or folder */

export const shouldSkip = (baseName: string): boolean => {
   // legacy name of cushy.json
   if (baseName === 'cushy-deck.json') return true
   if (baseName === 'cushy.json') return true
   if (baseName.startsWith('.')) return true
   if (baseName.startsWith('_')) return true
   if (baseName.startsWith('node_modules')) return true
   if (baseName.startsWith('dist')) return true
   return false
}

export const shouldSkip_duringWatch = (baseName: string): boolean => {
   if (baseName.startsWith('node_modules')) return true
   if (baseName.startsWith('.git')) return true
   if (baseName.startsWith('dist')) return true
   return false
}
