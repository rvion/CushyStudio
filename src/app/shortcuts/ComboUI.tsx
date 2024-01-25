import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { CushyShortcut, parseShortcutToInputSequence } from 'src/app/shortcuts/ShortcutManager'

export const ComboUI = observer(function ComboUI_(p: {
    //
    size?: 'sm' | 'xs'
    theme?: 'dark' | 'light'
    combo: CushyShortcut
}) {
    if (p.combo == null) return null
    const iss = parseShortcutToInputSequence(p.combo)
    return (
        <div tw='whitespace-nowrap flex gap-1'>
            {iss.map((token) => {
                const keys = token.split('+')
                return (
                    <div key={token}>
                        {keys.map((keyName, ix) => (
                            <Fragment key={ix}>
                                <span tw={['kbd', p.size === 'xs' ? 'kbd-xs' : 'kbd-sm']} key={keyName}>
                                    {keyName}
                                </span>
                                {ix !== keys.length - 1 && <span>+</span>}
                            </Fragment>
                        ))}
                    </div>
                )
            })}
        </div>
    )
})
