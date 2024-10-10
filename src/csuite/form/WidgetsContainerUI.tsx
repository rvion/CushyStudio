import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame, type FrameProps } from '../frame/Frame'

export const ListOfFieldsContainerUI = observer(function ListOfFieldsContainerUI_({
    // own props
    layout,

    // modified,
    base,
    border,

    // rest
    ...rest
}: {
    layout?: 'H' | 'V'
} & FrameProps) {
    const isHorizontal = layout === 'H'
    const theme = useCSuite()
    return (
        <Frame
            base={theme.fieldGroups.contrast ?? base}
            border={theme.fieldGroups.border ?? border}
            tw={[
                //
                isHorizontal ? `flex flex-wrap` : `flex flex-col`,
                'w-full',
                // 'gap-1',
            ]}
            {...rest}
        />
    )
})
