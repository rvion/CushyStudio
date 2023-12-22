// electron shell utilities
// https://www.electronjs.org/docs/latest/api/shell

import { dirname } from 'pathe'

type ElectronShell = typeof import('electron').shell

export const openExternal = (stuff: string) => getElectronSheel().openExternal(stuff, { activate: true })

export const showItemInFolder_BROKEN = (stuff: string) => {
    console.log(`opening ${stuff}`)
    getElectronSheel().showItemInFolder(stuff)
}

export const showItemInFolder = (stuff: string) => {
    console.log(`opening ${stuff} folder: ${dirname(stuff)}`)
    getElectronSheel().openExternal(`file://${dirname(stuff)}`, { activate: true })
}
export const getElectronSheel = () => window.require('electron').shell as ElectronShell
