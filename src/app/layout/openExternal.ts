// electron shell utilities
// https://www.electronjs.org/docs/latest/api/shell

import { dirname } from 'pathe'

type ElectronShell = typeof import('electron').shell

export const openExternal = (stuff: string) => getElectronSheel().openExternal(stuff, { activate: true })

export const showItemInFolder_BROKEN = (stuff: string): void => {
    console.log(`opening ${stuff}`)
    return getElectronSheel().showItemInFolder(stuff)
}

export const showItemInFolder = (stuff: string): Promise<void> => {
    console.log(`opening ${stuff} folder: ${dirname(stuff)}`)
    return getElectronSheel().openExternal(`file://${dirname(stuff)}`, { activate: true })
}

export const openFolderInOS = (folderAbsPath: AbsolutePath): Promise<void> => {
    console.log(`opening ${folderAbsPath} folder: ${folderAbsPath}`)
    return getElectronSheel().openExternal(`file://${folderAbsPath}`, { activate: true })
}

export const getElectronSheel = () => window.require('electron').shell as ElectronShell
