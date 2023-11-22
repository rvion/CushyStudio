import { observer } from 'mobx-react-lite'

export const Panel_Squoosh = observer(function Panel_Squoosh_(p: {}) {
    // return (
    //     <iframe
    //         src='https://squoosh.app/'
    //         className='w-full h-full'
    //         frameBorder='0'
    //         sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals allow-popups-to-escape-sandbox'
    //         allow='accelerometer; camera; encrypted-media; fullscreen; gyroscope; magnetometer; microphone; midi; payment; vr; xr-spatial-tracking'
    //     ></iframe>
    // )
    return (
        <iframe //
            className='w-full h-full'
            src={'https://squoosh.app/'}
            frameBorder='0'
        />
    )
})
