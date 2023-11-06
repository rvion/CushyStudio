import type { PositionChildProps } from 'rsuite/esm/Picker'

export type RsuiteRenderMenuProps = PositionChildProps &
    Pick<React.HTMLAttributes<HTMLElement>, 'id' | 'onMouseEnter' | 'onMouseLeave'> & {
        onClose: (delay?: number) => NodeJS.Timeout | void
    }
