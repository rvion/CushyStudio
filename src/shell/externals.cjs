// 🔶 modifications must be kept in sync between :
//     | ./src/shell/build.js
//     | ./vite.config.ts
//     | ./src/shell/externals.cjs

// prettier-ignore
const modulesToCache /*: [name:string, path:string][]*/ = [
    // node --------------------------
    ['assert'           , 'assert'          ],
    ['url'              , 'url'             ],
    ['buffer'           , 'buffer'          ],
    ['child_process'    , 'child_process'   ],
    ['fs'               , 'fs'              ],
    ['os'               , 'os'              ],
    ['path'             , 'path'            ],
    ['process'          , 'process'         ],
    ['stream'           , 'stream'          ],
    ['util'             , 'util'            ],
    ['zlib'             , 'zlib'            ],
    ['events'           , 'events'          ],
    ['cluster'          , 'cluster'         ],
    ['https'            , 'https'           ],
    ['async_hooks'      , 'async_hooks'     ],
    ['crypto'           , 'crypto'          ],

    // misc heavy libs ----------------
    ['three'            , 'three'           ],
    ['mobx'             , 'mobx'            ],
    ['@tensorflow/tfjs' , 'tfjs'            ],
    ['nsfwjs'           , 'nsfwjs'          ],
    ['mime-types'       , 'mime-types'      ],
]

const fs = require('fs')
for (const [pt, x] of modulesToCache) {
    const symbols = Object.keys(require(pt))
    let output = `const _ = window.require('${pt}')\n`
    output += `export default _\n`
    for (const sym of symbols) output += `export const ${sym} = _.${sym}\n`
    fs.writeFileSync(`src/syms/${x}.js`, output)
}
