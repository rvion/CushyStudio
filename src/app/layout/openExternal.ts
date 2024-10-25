// electron shell utilities
// https://www.electronjs.org/docs/latest/api/shell

import { dirname } from 'pathe'

import { FPath } from '../../models/FPath'

type ElectronShell = typeof import('electron').shell

export const openExternal = (stuff: string): Promise<void> =>
   getElectronShell().openExternal(stuff, { activate: true })

export const showItemInFolder_BROKEN = (stuff: string): void => {
   console.log(`opening ${stuff}`)
   return getElectronShell().showItemInFolder(stuff)
}

export const showItemInFolder = (stuff: string): Promise<void> => {
   console.log(`opening ${stuff} folder: ${dirname(stuff)}`)
   return getElectronShell().openExternal(`file://${dirname(stuff)}`, { activate: true })
}

export const openFolderInOS = (folderRawPath: string): Promise<void> => {
   const path = new FPath(folderRawPath)
   const absPath = path.absPath
   console.log(`opening ${absPath} folder: ${absPath}`)
   return getElectronShell().openExternal(`file://${absPath}`, { activate: true })
}

export const getElectronShell = (): ElectronShell => window.require('electron').shell as ElectronShell
