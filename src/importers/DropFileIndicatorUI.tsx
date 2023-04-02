import { Spinner, Subtitle2 } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'

export const DropFileIndicatorUI = observer(function DropFileIndicatorUI_(p: {}) {
    return (
        <>
            <Subtitle2>Drop file(s) here</Subtitle2>
            <Spinner />
        </>
    )
})
