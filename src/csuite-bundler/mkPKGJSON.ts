export function mkPKGJSON(name: string) {
   return `\
{
    "name": "${name}",
    "version": "0.0.${Date.now()}",
    "author": {
        "name": "rvion",
        "url": "https://github.com/rvion/CushyStudio",
        "email": "vion.remi@gmail.com"
    },
    "icon": "../public/CushyLogo.png",
    "publisher": "rvion",
    "repository": {
        "type": "git",
        "url": "https://github.com/rvion/CushyStudio"
    },
    "description": "TODO",
    "license": "AGPL-3.0",
    "categories": [
        "Other"
    ],
    "main": "./main.js",
    "types": "./main.d.ts",
    "scripts": {},
    "devDependencies": {
        "rollup": "^4.13.0",
        "rollup-plugin-dts": "^6.1.0",
        "rollup-plugin-visualizer": "^5.12.0"
    }
}
`
}
