import { observer } from 'mobx-react-lite'

export const Panel_Iframe = observer(function Panel_Iframe_(p: {
    //
    onPageChange?: (p: { url: string }) => void
    name?: string
    url: string
}) {
    // return (
    //     <iframe
    //         src='...'
    //         className='w-full h-full'
    //         frameBorder='0'
    //         sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals allow-popups-to-escape-sandbox'
    //         allow='accelerometer; camera; encrypted-media; fullscreen; gyroscope; magnetometer; microphone; midi; payment; vr; xr-spatial-tracking'
    //     ></iframe>
    // )
    return (
        <iframe //
            className='w-full h-full'
            src={p.url}
            // frameBorder='0'
            // ⏸️ onLoad={() => {
            // ⏸️     console.log(`[👙] 🍻 loaded`)
            // ⏸️ }}
        />
    )
})
