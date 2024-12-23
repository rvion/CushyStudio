import { pythonModuleToPrefix } from './_pythonModuleToNamespace'

export const convertComfyModuleAndNodeNameToCushyQualifiedNodeKey = (
   pythonModule: string,
   nameInComfy: string,
): string => {
   return `${pythonModuleToPrefix(pythonModule)}${nameInComfy}`
}
