const fs = require('fs')
const path = require('path')

const iconPathMac = path.resolve('library/CushyStudio/_public/CushyLogo-512.icns')
const iconPathWindows = path.resolve('library/CushyStudio/_public/CushyLogo.ico')
const iconPathLinux = path.resolve('library/CushyStudio/_public/CushyLogo-512.png')

const newAppName = 'CushyStudio'

exports.default = async function patchElectronIconAndName() {
    const OUT = {
        icon: iconPathWindows,
    }

    try {
        const electronPath = path.resolve('node_modules', 'electron', 'dist')
        const platform = process.platform
        console.log(`[ELECTRON] electronPath: ${electronPath}`)

        // 🟢 MAC
        if (platform === 'darwin') {
            // 1. patch icon
            console.log(`[ELECTRON] icon path: ${iconPathMac}`)
            const macOSIconPath = path.join(electronPath, 'Electron.app', 'Contents', 'Resources', 'electron.icns')
            fs.copyFileSync(iconPathMac, macOSIconPath)
            console.log(`[ELECTRON] icon patched`)

            // 2. patch appname
            const plist = require('plist')
            const plistPath = path.join(electronPath, 'Electron.app', 'Contents', 'Info.plist')
            const plistContent = fs.readFileSync(plistPath, 'utf8')
            const plistData = plist.parse(plistContent)
            plistData.CFBundleDisplayName = newAppName
            plistData.CFBundleName = newAppName
            fs.writeFileSync(plistPath, plist.build(plistData))
            console.log(`[ELECTRON] name patched`)
        }

        // 🟢 WINDOWS
        else if (platform === 'win32') {
            // const rcedit = require('rcedit')
            // console.log(`[ELECTRON] icon path: ${iconPathWindows}`)
            // const windowsExePath = path.join(electronPath, 'electron.exe')
            // // patch icon and name at once
            // await rcedit(windowsExePath, {
            //     icon: iconPathWindows,
            //     // 'product-version': newAppName,
            //     // 'file-version': newAppName,
            // })
        }

        // 🟢 LINUX
        else if (platform === 'linux') {
            // 1. patch icon
            console.log(`[ELECTRON] icon path: ${iconPathLinux}`)
            const linuxIconPath = path.join(electronPath, 'icon.png') // This can vary depending on Electron's version and your Linux setup
            fs.copyFileSync(iconPathLinux, linuxIconPath)
            const linuxDesktopFilePath = path.join(electronPath, 'electron.desktop')

            // 2. patch appname
            if (fs.existsSync(linuxDesktopFilePath)) {
                const xml2js = require('xml2js')
                let desktopContent = fs.readFileSync(linuxDesktopFilePath, 'utf8')
                const parser = new xml2js.Parser()
                const builder = new xml2js.Builder()

                const parsedData = await parser.parseStringPromise(desktopContent)
                if (parsedData && parsedData.desktop && parsedData.desktop.entry && Array.isArray(parsedData.desktop.entry)) {
                    for (const entry of parsedData.desktop.entry) {
                        if (entry['$'] && entry['$'].key === 'Name') {
                            entry['_'] = newAppName
                        }
                    }
                }

                desktopContent = builder.buildObject(parsedData)
                fs.writeFileSync(linuxDesktopFilePath, desktopContent)
            }
        }

        // ❌ ERROR
        else {
            console.error(`[ELECTRON] cannot change default electron icon on ${platform} platform`)
        }
    } catch (error) {
        // ❌ CRASH
        console.error(`[ELECTRON] failed to patch icon`, error)
    }

    return OUT
}
