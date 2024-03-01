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
    openPage_Civitai:     'mod+k 1',
    openPage_Squoosh:     'mod+k 2',
    openPage_Posemy:      'mod+k 3',
    openPage_Paint:       'mod+k 4',
    openPage_Unsplash:    'mod+k 5',
    openPage_ComfyUI:     'mod+4',
    openPage_Gallery:     'mod+5',
    openPage_Models:      'mod+6',
    openPage_Marketplace: 'mod+7',

    // draft actions
    duplicateCurrentDraft: 'mod+shift+d',
    resizeWindowForVideoCapture: 'mod+u mod+2',
    resizeWindowForLaptop: 'mod+u mod+3',
    resetLayout: 'mod+u mod+1',

    // tree actions
    // global
    focusAppAndDraftTree: ['mod+1', 'mod+shift+e', 'mod+b'],
    focusFileExplorerTree: 'mod+2',
    collapseAllTree: 'mod+shift+k',
    // in-tree stuff
    // tree_focusFilter:                 '/',
    tree_moveUp:                      'ArrowUp',
    tree_moveDown:                    'ArrowDown',
    tree_moveRight:                   'ArrowRight',
    tree_moveLeft:                    'ArrowLeft',
    tree_deleteNodeAndFocusNodeAbove: 'Backspace',
    tree_deleteNodeAndFocusNodeBelow: 'Delete',
    tree_onPrimaryAction:             'Enter',
    tree_movePageUp:                  'PageUp',
    tree_movePageDown:                'PageDown',
}

// TODO: find a way to mix those with tree shortcuts:
// in /Users/loco/dev/CushyStudio/src/panels/libraryUI/tree/xxx/TreeShortcuts.ts
