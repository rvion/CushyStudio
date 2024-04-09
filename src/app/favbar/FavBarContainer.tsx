import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

// Could give this an option be collapsible in the future?
/** Re-usable container to keep a consistent style around groups of buttons */

export const FavBarContainer = observer(function FavBarContainer_(p: { children?: ReactNode; icon?: string }) {
    return (
        <div // Favorite app container
            tw={[' flex rounded', 'gap-0 bg-base-100 p-1 text-center justify-center items-center', 'text-shadow']}
        >
            {/* {p.icon && (
                <span tw='select-none' className='material-symbols-outlined'>
                    {p.icon}
                </span>
            )} */}
            {p.children}
        </div>
    )
})
