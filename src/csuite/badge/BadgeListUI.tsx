import { observer } from 'mobx-react-lite'

import { RevealUI } from '../reveal/RevealUI'
import { BadgeContainerUI } from './BadgeContainerUI'
import { BadgeUI } from './BadgeUI'

export const BadgeListUI = observer(function BadgeListUI_(p: {
    //
    autoHue?: boolean
    badges?: string[]
}) {
    const items = p.badges
    if (items == null) return null
    if (items.length === 0) return null
    return (
        <BadgeContainerUI>
            {items.slice(0, 10).map((tag) => (
                <BadgeUI autoHue={p.autoHue} key={tag}>
                    {tag}
                </BadgeUI>
            ))}
            {items.length > 10 ? (
                <RevealUI
                    trigger='hover'
                    content={() => (
                        <div>
                            {items.slice(10).map((tag) => (
                                <BadgeUI autoHue={p.autoHue} key={tag}>
                                    {tag}
                                </BadgeUI>
                            ))}
                        </div>
                    )}
                >
                    <BadgeUI tw='font-bold'>+{items.length - 10} more</BadgeUI>
                </RevealUI>
            ) : null}
        </BadgeContainerUI>
    )
})
