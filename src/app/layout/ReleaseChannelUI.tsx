import type { ReleaseChannels } from 'src/config/ConfigFile'

import { observer } from 'mobx-react-lite'

import { useSt } from 'src/state/stateContext'

export const ReleaseChannelUI = observer(function ReleaseChannelUI_(p: {
    //
    onChange: (val: ReleaseChannels) => void
}) {
    const st = useSt()
    const config = st.configFile
    const value = config.value.releaseChannel ?? 'stable'
    return (
        <div role='tablist' className='tabs tabs-boxed'>
            <a tw={[{ 'tab-active': value === 'stable' }]} role='tab' className='tab'>
                Stable Version
            </a>
            <a tw={[{ 'tab-active': value === 'dev' }]} role='tab' className='tab'>
                Beta Version
            </a>
        </div>
    )
    // return (
    //     <Joined defaultValue={value} aria-label='Visibility Level'>
    //         <RadioTile icon={<span className='material-symbols-outlined'>looks</span>} label='Stable Version' value='stable'>
    //             For cool people.
    //         </RadioTile>
    //         <RadioTile icon={<span className='material-symbols-outlined'>bug_report</span>} label='Beta Version' value='dev'>
    //             <div>For cool people too.</div>
    //             <div>(but Possibly broken)</div>
    //         </RadioTile>
    //     </Joined>
    // )
})
