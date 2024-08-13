import type { IconName } from '../../csuite/icons/icons'

import { makeAutoObservable } from 'mobx'

import { getAllIcons } from '../../csuite/icons/getAllIcons'
import { iconAliases } from '../../csuite/icons/iconAliases'
import { toastError, toastInfo } from '../../csuite/utils/toasts'

export class IconPanelStableState {
    constructor() {
        makeAutoObservable(this)
    }

    get allIcons_unfiltered(): IconName[] {
        return getAllIcons()
    }

    aliasesFor(iconName: IconName): Maybe<string[]> {
        return iconAliases[iconName]
    }

    get allIcons(): IconName[] {
        if (!this.filter) return this.allIcons_unfiltered
        if (!this.query) return this.allIcons_unfiltered
        return this.allIcons_unfiltered.filter((x) => {
            return (
                // primary name matches
                x.toLowerCase().includes(this.query) ||
                // alias matches
                iconAliases[x]?.some((y) => y.includes(this.query))
            )
        })
    }

    /** Whether or not to use the filter when displaying icons */
    filter: boolean = true
    /** List of recently copied icons */
    recent: IconName[] = []
    /** Used to filter down the icons to match the query. Only used when filter is enabled. */
    query: string = ''

    copy = async (icon: IconName): Promise<void> => {
        const found = this.recent.indexOf(icon)
        if (found > -1) {
            this.recent.splice(found, 1)
        }
        this.recent.unshift(icon)

        try {
            // Probably should check if it errored, but lazy.
            await navigator.clipboard.writeText(icon)
            toastInfo(`'${icon}' copied to clipboard`)
        } catch (e) {
            toastError(`Error copying to clipboard: ${e}`)
        }
    }
}
