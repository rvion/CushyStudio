import { observer } from 'mobx-react-lite'

export const Panel_Squoosh = observer(function Panel_Squoosh_(p: {}) {
    return (
        <iframe //
            className='w-full h-full'
            src={'https://squoosh.app/'}
            frameBorder='0'
        />
    )
})
