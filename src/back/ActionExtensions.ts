export const ActionExtensions = ['.ts', '.tsx', '.json']
export const hasValidActionExtension = (path: string): boolean => {
    return ActionExtensions.some((ext) => path.endsWith(ext))
}
