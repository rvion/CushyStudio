import { observer } from 'mobx-react-lite'
import type { PanelAssetsState } from './PanelAssets'
import { BasicShelfUI } from '../../csuite/shelf/ShelfUI'
import { Frame } from '../../csuite/frame/Frame'
import { useCSuite } from '../../csuite/ctx/useCSuite'

export const PanelAssetsShelfUI = observer(function PanelAssetsShelfUI_(p: { st: PanelAssetsState }) {
    const activeLora = p.st.props.active > -1 && cushy.schema.getLoras()[p.st.props.active]
    const csuite = useCSuite()
    return (
        <BasicShelfUI //
            base={{ contrast: 0.055 }}
            tw='flex'
            anchor='right'
        >
            <div tw='flex flex-col w-full p-1.5 gap-1.5 select-none'>
                Lora DB info and editable data should be here
                {activeLora ? (
                    <Frame // Kind of useless since the path isn't a full one, but need something here to display for now
                        tw='flex w-full truncate line-clamp-1 whitespace-nowrap p-1 select-none'
                        icon='mdiFileDocument'
                        line
                        tooltip={`Filepath\n${activeLora}`}
                        roundness={csuite.inputRoundness}
                    >
                        {activeLora}
                    </Frame>
                ) : (
                    <Frame line icon='mdiInformationBox'>
                        No active item
                    </Frame>
                )}
            </div>
        </BasicShelfUI>
    )
})
