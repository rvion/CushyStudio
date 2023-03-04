import { repeatStr } from './CodeBuffer'

export const renderBar = (text: string, prefix: string = '') => {
   const ___bar___ = '============================================================================='
   return (
      `${prefix}|${___bar___}|\n` +
      `${prefix}| ${text} ${repeatStr(___bar___.length - text.length - 4, ' ')}  |\n` +
      `${prefix}|${___bar___}|`
   )
}
