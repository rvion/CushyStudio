import { observer } from 'mobx-react-lite'
import { useSt } from '../../state/stateContext'

export const LibraryHeaderUI = observer(function LibraryHeaderUI_(p: {}) {
    const st = useSt()
    const library = st.library
    return (
        <div tw='flex w-full'>
            <button tw='btn btn-sm btn-active flex-grow' onClick={() => st.toggleFullLibrary()}>
                <span className='material-symbols-outlined'>view_list</span>
                Library
            </button>
            <button tw='btn btn-sm' onClick={() => library.decksSorted.forEach((d) => (d.folded = true))}>
                <span className='material-symbols-outlined'>minimize</span>
            </button>
        </div>
    )
})
