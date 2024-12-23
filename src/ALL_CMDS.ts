// import

import './operators/commands/cmd_copyImage'
import './operators/commands/cmd_favorites'
import './operators/commands/cmd_goTo'

import { allLayoutCommands } from './app/shortcuts/cmd_layout'
import { allLegacyCommands } from './app/shortcuts/cmd_mix'
import { allScreencastCommands } from './app/shortcuts/cmd_screencast'
import { allTreeCommands } from './csuite/tree/TreeCommands'
import {
   cmd_copyImage,
   cmd_copyImage_as_JPG,
   cmd_copyImage_as_PNG,
   cmd_copyImage_as_WEBP,
   cmd_deleteImage,
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
import { cmd_wm_PieMenu } from './operators/commands/cmd_toggleHeader'
import { allCanvasCommands } from './panels/PanelCanvas/commands/canvasCommands'
import {
   cmd_captioning_selectNextImage,
   cmd_captioning_selectPreviousImage,
   cmd_captioningDeleteActiveCaption,
   CommandsCaptions,
} from './panels/PanelCaptioning/ctx_captionning'

export const allCommands = [
   //
   cmd_fav_toggleFavBar,
   // copy image (work in every compatible contexts)
   cmd_copyImage,
   cmd_deleteImage,
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
   ...allTreeCommands,
   ...allScreencastCommands,
   ...CommandsCaptions,
   cmd_wm_PieMenu,
]
