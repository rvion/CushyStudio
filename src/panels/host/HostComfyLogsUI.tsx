import type { HostL } from '../../models/Host'

import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'

import { Frame } from '../../csuite/frame/Frame'
import { usePromise } from '../../csuite/utils/usePromise'

export const HostComfyLogsUI = observer(function HostComfyLogsUI_({
   host,
   refreshEvery = 500,
   ...rest
}: {
   host: HostL
   refreshEvery?: number
}) {
   const ref = useRef<HTMLDivElement>(null)
   const x = usePromise(() => host.manager.fetchLogs(), [host], { refreshEvery }).value
   useEffect(() => {
      console.log(`[🤠] scrolling bottom`)
      ref.current?.scrollTo(0, ref.current.scrollHeight)
   }, [x])
   return (
      <Frame
         border
         base={-10}
         ref={ref}
         {...rest}
         tw='flex-1 overflow-auto text-xs [height:300px] [max-width:600px]'
      >
         <pre>{x}</pre>
      </Frame>
   )
})
