import type { STATE } from 'src/front/state'

import { makeAutoObservable } from 'mobx'
import { ActionPack, ActionPackData } from './ActionPack'

export class Marketplace {
    plugins: ActionPack[]
    private _knownPluginsData: ActionPackData[] = [
        //
        {
            name: 'Vinsi Action Pack',
            github: 'VinsiGit/Cushy_Action',
            description: 'Gradients. Reinvented 🐠',
            recommanded: true,
        },
        {
            name: 'Avatar Maker',
            github: 'noellealarie/cushy-avatar-maker',
            description: 'You can create your own avatar with this action pack',
            recommanded: true,
        },
        {
            name: 'cushy-example-actions',
            github: 'rvion/cushy-example-actions',
            description: 'some example action pack with a bunch of everything to get started',
            recommanded: true,
        },
        {
            name: 'Base Action pack',
            BUILT_IN: true,
            github: 'rvion/CushyStudio',
            description: 'Built-in actions for cushy studio',
        },
        {
            name: 'My Custom Actions',
            BUILT_IN: true,
            github: 'rvion/CushyStudio',
            description: 'your private local actions',
        },
    ]

    constructor(public st: STATE) {
        makeAutoObservable(this)
        this.plugins = this._knownPluginsData.map((d) => new ActionPack(this, d))
    }
}
