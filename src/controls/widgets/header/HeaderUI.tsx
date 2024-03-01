import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

/** Re-usable Dock-Panel Header, gives a `bg-base-300` bar with a horizontal flex to put widgets in.
 *
 * Example:
 *
 * ```
 * <HeaderUI>
 *      <div tw='btn btn-sm'>Hello World!<div>
 * </HeaderUI>
 * ```
 */
export const HeaderUI = observer(function HeaderUI_(p: { children?: ReactNode }) {
    return (
        <div // Container
            // This may be good to pass in the future? I don't think this really needs to/should be modifiable though.
            // className={p.className}
            tw={['h-10', 'flex select-none w-full', 'items-center p-1', 'bg-base-300']}
        >
            {p.children ?? <></>}
        </div>
    )
})
