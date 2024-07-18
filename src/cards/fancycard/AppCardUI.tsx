import { observer } from 'mobx-react-lite'

import { InputBoolCheckboxUI } from '../../csuite/checkbox/InputBoolCheckboxUI'
import { Frame } from '../../csuite/frame/Frame'
import { CushyAppL } from '../../models/CushyApp'
import { useSt } from '../../state/stateContext'
import { AppIllustrationUI } from './AppIllustrationUI'

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
        if (file.absPath.endsWith('.ts'))   return <Frame base={{hueShift:  60, chroma: .1 }} tw={[tw]} style={{maxWidth}}>Cushy App</Frame>
        if (file.absPath.endsWith('.json')) return <Frame base={{hueShift: 120, chroma: .1 }} tw={[tw]} style={{maxWidth}}>ComfyUI Workflow JSON</Frame>
        if (file.absPath.endsWith('.png'))  return <Frame base={{hueShift: 180, chroma: .1 }} tw={[tw]} style={{maxWidth}}>ComfyUI Workflow Image</Frame>
    })()

    return (
        <Frame
            base={8}
            hover
            style={{ width: st.library.imageSize }}
            onClick={p.app.openLastOrCreateDraft}
            tw={[
                //
                'flex flex-col',
                'shadow-xl border border-neutral border-opacity-25',
                `STYLE_A`,
                p.active ? 'active' : 'not-active',
                'cursor-pointer',
            ]}
        >
            {/* ROW 1 */}
            <div tw='flex items-start flex-grow' style={{ fontSize: '1rem' }}>
                {/* FAVORITE */}
                {st.library.showFavorites ? (
                    <InputBoolCheckboxUI
                        box={{ border: 0 }}
                        value={app.isFavorite}
                        onValueChange={(v) => app.setFavorite(v)}
                        icon='mdiStar'
                        // box={{ base: { hue: knownOKLCHHues.yellowTaxi } }}
                        // border={0}
                        // base={0}
                        // size='sm'
                        // square
                        // onClick={}
                        // text={
                        //     p.app.isFavorite //
                        //         ? { hue: knownOKLCHHues.yellowTaxi, chroma: 0.2, contrast: 0.2 }
                        //         : undefined
                        // }
                    />
                ) : null}

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
        </Frame>
    )
})
