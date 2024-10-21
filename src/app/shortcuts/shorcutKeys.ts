import { TreeKeys } from '../../csuite/tree/TreeKeys'

// TODO: find a way to mix those with tree shortcuts:
// in /Users/loco/dev/CushyStudio/src/panels/libraryUI/tree/xxx/TreeShortcuts.ts

// prettier-ignore
export const KEYS = {
    search: 'mod+f',
    // misc
    closeCurrentTab: 'mod+w',
    closeDialogOrPopupsOrFullScreenPanel: 'escape',

    // tree navigation -------------------------------------------------------------------------------
    // navigation -------------------------------------------------------------------------------------
    openFull_Library:   'mod+p',
    openPage_Config:    'mod+,',
    openPage_Hosts:     'mod+shift+,',
    openPage_Shortcuts: 'mod+k mod+s',
    //
    openPage_Civitai:     'mod+k mod+1',
    openPage_Squoosh:     'mod+k mod+2',
    openPage_Posemy:      'mod+k mod+3',
    openPage_Paint:       'mod+k mod+4',
    openPage_Unsplash:    'mod+k mod+5',
    openPage_ComfyUI:     'mod+k mod+6',
    openPage_Gallery:     'mod+k mod+7',
    openPage_Models:      'mod+k mod+8',
    openPage_Marketplace: 'mod+k mod+9',

    // draft actions
    duplicateCurrentDraft: 'mod+shift+d',
    resizeWindowForVideoCapture: 'mod+u mod+2',
    resizeWindowForLaptop: 'mod+u mod+3',
    resetLayout: 'mod+u mod+1',

    // tree actions
    // global
    focusAppAndDraftTree: ['mod+1', 'mod+shift+e', 'mod+b'],
    focusFileExplorerTree: 'mod+2',

    // in-tree stuff
    ...TreeKeys,
}
