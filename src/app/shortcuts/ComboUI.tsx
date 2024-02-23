import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { CushyShortcut, parseShortcutToInputSequence } from 'src/app/shortcuts/ShortcutManager'

export const ComboUI = observer(function ComboUI_(p: {
    //
    size?: 'sm' | 'xs'
    primary?: boolean
    combo: CushyShortcut
}) {
    if (p.combo == null) return null
    const iss = parseShortcutToInputSequence(p.combo)
    return (
        <div tw='whitespace-nowrap flex gap-2'>
            {iss.map((token) => {
                const keys = token.split('+')
                return (
                    <div key={token} tw='flex items-center text-xs'>
                        {keys.map((keyName, ix) => (
                            <Fragment key={ix}>
                                <span
                                    tw={
                                        [
                                            //
                                            // 'kbd',
                                            // p.primary && 'kbd-primary',
                                            // p.size === 'xs' ? 'kbd-xs' : 'kbd-sm',
                                        ]
                                    }
                                    key={keyName}
                                >
                                    {formatKeyName(keyName)}
                                </span>
                                {ix !== keys.length - 1 && <div tw='opacity-50'>+</div>}
                            </Fragment>
                        ))}
                    </div>
                )
            })}
        </div>
    )
})
const formatKeyName = (keyName: string): string => {
    // arrows
    if (keyName === 'arrowup') return '↑'
    if (keyName === 'arrowdown') return '↓'
    if (keyName === 'arrowleft') return '←'
    if (keyName === 'arrowright') return '→'
    // mods
    if (keyName === 'alt') return '⌥'
    if (keyName === 'shift') return '⇧'
    if (keyName === 'cmd') return '⌘'
    if (keyName === 'ctrl') return '⌃'
    if (keyName === 'win') return 'win'

    return keyName.toUpperCase()
}
