import type { ReleaseChannels } from '../../config/ConfigFile'

import { observer } from 'mobx-react-lite'

export const ReleaseChannelUI = observer(function ReleaseChannelUI_(p: {
   //
   onChange: (val: ReleaseChannels) => void
}) {
   const config = cushy.configFile
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
})
