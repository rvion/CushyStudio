import type { ReleaseChannels } from 'src/core/ConfigFile'

import { observer } from 'mobx-react-lite'
import { RadioTile, RadioTileGroup } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'

export const ReleaseChannelUI = observer(function ReleaseChannelUI_(p: {
    //
    onChange: (val: ReleaseChannels) => void
}) {
    const st = useSt()
    const config = st.configFile
    const value = config.value.checkUpdateEveryMinutes ?? 'stable'
    return (
        <RadioTileGroup defaultValue={value} aria-label='Visibility Level'>
            <RadioTile icon={<span className='material-symbols-outlined'>looks</span>} label='Stable Channel' value='stable'>
                For cool people.
            </RadioTile>
            <RadioTile icon={<span className='material-symbols-outlined'>bug_report</span>} label='Dev Channel' value='dev'>
                <div>For cool people too.</div>
                <div>(but Possibly broken)</div>
            </RadioTile>
        </RadioTileGroup>
    )
})
