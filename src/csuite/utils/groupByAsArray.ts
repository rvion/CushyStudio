import { groupByAsDict } from './groupByAsDict'

export function groupByAsArray<T>(arr: T[], key: (t: T) => string): [string, T[]][] {
   const grouppedDict = groupByAsDict(arr, key)
   return Object.entries(grouppedDict)
}
