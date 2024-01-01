import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../state/stateContext'
import { LibraryHeaderUI } from './libraryUI/LibraryHeaderUI'
import { Tree } from './libraryUI/tree/xxx/Tree'
import { TreeUI } from './libraryUI/tree/xxx/TreeUI'

export const Panel_AppList = observer(function Panel_AppList_(p: {}) {
    const st = useSt()
    const tree = useMemo(() => {
        return new Tree(st, [
            //
            '#favorites',
            '#apps',
            'path#library/built-in',
            'path#library/local',
            'path#library/sdk-examples',
        ])
    }, [])

    return (
        <div tw='flex flex-grow flex-col overflow-auto h-full'>
            <LibraryHeaderUI />
            <TreeUI tree={tree} />
        </div>
    )
})
