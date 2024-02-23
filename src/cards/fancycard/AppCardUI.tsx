import { observer } from 'mobx-react-lite'

import { AppFavoriteBtnUI } from '../../panels/libraryUI/CardPicker2UI'
import { LibraryFile } from '../LibraryFile'
import { AppIllustrationUI } from './AppIllustrationUI'
import { CushyAppL } from 'src/models/CushyApp'
import { Tag } from 'src/rsuite/shims'
// import { Package } from '../Pkg'
import { useSt } from 'src/state/stateContext'

export const AppCardUI = observer(function FancyCardUI_(p: {
    //
    // deck: Package
    app: CushyAppL
    active?: boolean
}) {
    const app = p.app
    const file = app.file
    const st = useSt()
    // const importedFrom
    // prettier-ignore
    const color = (() => {
        const tw='px-1 py-0.5 overflow-hidden text-ellipsis block whitespace-nowrap self-stretch'
        const maxWidth = st.library.imageSize
        if (file.absPath.endsWith('.ts'))   return <span tw={[tw, 'bg-primary text-primary-content']} style={{maxWidth}}>Cushy App</span>
        if (file.absPath.endsWith('.json')) return <span tw={[tw, 'bg-secondary text-secondary-content']} style={{maxWidth}}>ComfyUI Workflow JSON</span>
        if (file.absPath.endsWith('.png'))  return <span tw={[tw, 'bg-accent text-accent-content']} style={{maxWidth}}>ComfyUI Workflow Image</span>
    })()

    return (
        <div
            style={{ width: st.library.imageSize }}
            onClick={p.app.openLastOrCreateDraft}
            tw={[
                //
                'flex flex-col',
                'p-0.5 bg-base-300 text-base-content shadow-xl border border-neutral border-opacity-25',
                `card STYLE_A`,
                p.active ? 'active' : 'not-active',
                'cursor-pointer',
            ]}
        >
            {/* ROW 1 */}
            <div tw='flex items-start flex-grow' style={{ fontSize: '1rem' }}>
                {/* FAVORITE */}
                {st.library.showFavorites ? <AppFavoriteBtnUI app={app} size={'1.5rem'} /> : null}

                {/* NAME */}
                <div
                    //
                    style={{ width: st.library.imageSize, height: '3rem' }}
                    tw='overflow-hidden overflow-ellipsis pt-1 font-bold'
                >
                    {app.name}
                </div>
            </div>

            {/* ROW 2 */}
            <div tw='flex'>
                {/* ILLUSTRATION */}
                <AppIllustrationUI app={app} size={st.library.imageSize} />

                {/* DESCRIPTION */}
                {st.library.showDescription ? (
                    <div tw='flex-grow flex flex-col ml-1 w-44'>
                        {/* <div>
                            {(file.manifest.categories ?? []).map((i, ix) => (
                                <Tag key={ix}>{i}</Tag>
                            ))}
                        </div> */}
                        {/* <div style={{ height: '5rem' }} tw='m-1 flex-grow text-sm'>
                            {file.description}
                        </div> */}
                    </div>
                ) : null}
            </div>

            {/* ROW 3 */}
            {/* PATH */}
            <div tw='italic text-xs whitespace-nowrap overflow-ellipsis overflow-hidden text-opacity-50'>{file.relPath}</div>

            {/* ROW 4 */}
            {/* KIND */}
            {color}
        </div>
    )
})
