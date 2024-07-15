import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'

export const ListOfFieldsContainerUI = observer(function ListOfFieldsContainerUI_(p: {
    layout?: 'H' | 'V'
    className?: string
    children?: React.ReactNode
}) {
    const isHorizontal = p.layout === 'H'
    const theme = useCSuite()
    return (
        <Frame
            base={theme.fieldGroups.contrast}
            border={theme.fieldGroups.border}
            className={p.className}
            tw={[isHorizontal ? `flex flex-wrap` : `flex flex-col`, 'w-full', p.className]}
        >
            {p.children}
        </Frame>
    )
})
