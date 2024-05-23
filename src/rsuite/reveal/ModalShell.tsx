import { observer } from 'mobx-react-lite'

import { Box } from '../../theme/colorEngine/Box'
import { Button } from '../button/Button'

export const ModalShellUI = observer(function ModalShellUI_(p: {
    title?: React.ReactNode
    className?: string
    children?: React.ReactNode
    footer?: React.ReactNode | undefined
    close: () => void
}) {
    return (
        <Box border className={p.className} tw={['animate-in fade-in', 'p-4 shadow-xl']} onClick={(ev) => ev.stopPropagation()}>
            {/* HEADER */}
            <div tw='flex'>
                <div tw='text-xl'>{p.title}</div>
                <div tw='flex-1'></div>
                <Button
                    appearance='subtle'
                    square
                    icon='mdiClose'
                    onClick={(ev) => {
                        ev.stopPropagation()
                        ev.preventDefault()
                        p.close()
                    }}
                ></Button>
            </div>
            <div className='divider my-0'></div>
            {/* BODY */}
            <div tw='_ModalBody'>{p.children}</div>
            {/* DOOTER */}
            <div tw='_ModalFooter'>{p.footer}</div>
        </Box>
    )
})
