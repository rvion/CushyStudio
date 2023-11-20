export type RsuiteRenderMenuProps = Pick<React.HTMLAttributes<HTMLElement>, 'id' | 'onMouseEnter' | 'onMouseLeave'> & {
    onClose: (delay?: number) => NodeJS.Timeout | void
}
