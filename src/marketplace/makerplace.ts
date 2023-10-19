import { makeAutoObservable } from 'mobx'
import { STATE } from 'src/front/state'
import { ActionPack, ActionPackData } from './ActionPack'

export class Marketplace {
    plugins: ActionPack[]
    private _knownPluginsData: ActionPackData[] = [
        //
        {
            name: 'cushy-example-actions',
            github: 'rvion/cushy-example-actions',
            description: 'some example action pack with a bunch of everything to get started',
        },
        {
            name: 'Vinsi Action Pack',
            github: 'VinsiGit/Cushy_Action',
            description: 'Gradients. Reinvented 🐠',
        },
        {
            name: 'Avatar Maker',
            github: 'noellealarie/CushyStudio',
            description: 'You can create your own avatar with this action pack',
        },
    ]

    constructor(public st: STATE) {
        makeAutoObservable(this)
        this.plugins = this._knownPluginsData.map((d) => new ActionPack(this, d))
    }
}
