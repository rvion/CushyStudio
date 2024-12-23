export function bytesToSize(bytes: number): string {
   if (bytes === 0) return '0 Byte'
   if (bytes < 1024) return bytes + ' Bytes'
   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
   if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
   if (bytes < 1024 * 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
   return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB'
}
