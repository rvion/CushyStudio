export const ActionExtensions: string[] = ['.ts', '.tsx', '.json', '.png', '.webp']
export const hasValidActionExtension = (path: string): boolean => {
   return ActionExtensions.some((ext) => path.endsWith(ext))
}
