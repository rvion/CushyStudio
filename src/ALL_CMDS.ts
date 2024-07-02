// import

import './operators/commands/cmd_copyImage'
import './operators/commands/cmd_favorites'
import './operators/commands/cmd_goTo'

import { allLayoutCommands } from './app/shortcuts/cmd_layout'
import { allLegacyCommands } from './app/shortcuts/cmd_mix'
import {
    cmd_copyImage,
    cmd_copyImage_as_JPG,
    cmd_copyImage_as_PNG,
    cmd_copyImage_as_WEBP,
    cmd_open_copyImageAs_menu,
} from './operators/commands/cmd_copyImage'
import { cmd_fav_toggleFavBar } from './operators/commands/cmd_favorites'
import {
    cmd_nav_openCivitaiPanel,
    cmd_nav_openGallery1,
    cmd_nav_openGallery2,
    cmd_nav_openGallery3,
    cmd_nav_openIcons,
} from './operators/commands/cmd_goTo'
import { allCanvasCommands } from './panels/Panel_Canvas/commands/canvasCommands'

export const allCommands = [
    //
    cmd_fav_toggleFavBar,
    // copy image (work in every compatible contexts)
    cmd_copyImage,
    cmd_copyImage_as_PNG,
    cmd_copyImage_as_WEBP,
    cmd_copyImage_as_JPG,
    cmd_open_copyImageAs_menu,
    //
    cmd_nav_openCivitaiPanel,
    cmd_nav_openIcons,
    cmd_nav_openGallery1,
    cmd_nav_openGallery2,
    cmd_nav_openGallery3,
    ...allCanvasCommands,
    ...allLayoutCommands,
    ...allLegacyCommands,
]
