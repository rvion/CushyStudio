// import type { STATE } from 'src/front/state'

// import { makeAutoObservable } from 'mobx'
// import { ActionPack, ActionPackData, ActionPackFolder } from './ActionPack'

// export class Marketplace {
//     plugins: ActionPack[]
//     private _knownPluginsData: ActionPackData[] = [
//         //
//         {
//             name: 'Vinsi Action Pack',
//             github: 'VinsiGit/Cushy_Action',
//             description: 'Gradients. Reinvented 🐠',
//             recommanded: true,
//         },
//         {
//             name: 'Avatar Maker',
//             github: 'noellealarie/cushy-avatar-maker',
//             description: 'You can create your own avatar with this action pack',
//             recommanded: true,
//         },
//         {
//             name: 'Portrait emotion change',
//             github: 'featherice/cushy-actions',
//             description: 'tweak your portrait, change emotions. More soon',
//             recommanded: true,
//         },
//         {
//             name: 'cushy-example-actions',
//             github: 'rvion/cushy-example-actions',
//             description: 's ome example action pack with a bunch of everything to get started',
//             recommanded: true,
//         },
//         {
//             name: 'comfy2cushy-examples',
//             github: 'noellealarie/comfy2cushy-examples',
//             description: 'A port from ComfyUI Examples to CushyStudio',
//             recommanded: true,
//         },
//         {
//             name: 'Base Action pack',
//             BUILT_IN: true,
//             github: 'CushyStudio/default',
//             description: 'Core versatile actions that cover a wide range of use cases',
//         },
//         {
//             name: 'Card / Deck generator actions',
//             BUILT_IN: true,
//             github: 'CushyStudio/cards',
//             description: 'Built-in actions for cushy studio',
//         },
//         {
//             name: 'Widget Examples',
//             BUILT_IN: true,
//             github: 'CushyStudio/tutorial',
//             description: 'action examples you can learn from',
//         },
//     ]

//     get = (apf: ActionPackFolder): Maybe<ActionPack> => {
//         return this.pluginsByPath.get(apf)
//     }

//     private pluginsByPath = new Map<string, ActionPack>()

//     constructor(public st: STATE) {
//         makeAutoObservable(this)
//         this.plugins = this._knownPluginsData.map((d) => new ActionPack(this, d))
//         for (const p of this.plugins) {
//             this.pluginsByPath.set(p.actionPackFolderRel, p)
//         }
//     }
// }
