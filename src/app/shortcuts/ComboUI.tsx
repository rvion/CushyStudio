import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { CushyShortcut, parseShortcutToInputSequence } from 'src/app/shortcuts/ShortcutManager'

export const ComboUI = observer(function ComboUI_(p: { theme?: 'dark' | 'light'; combo: CushyShortcut }) {
    if (p.combo == null) return null
    const iss = parseShortcutToInputSequence(p.combo)
    return (
        <div tw='whitespace-nowrap'>
            {iss.map((token) => {
                const keys = token.split('+')
                return (
                    <Fragment key={token}>
                        {keys.map((keyName, ix) => (
                            <>
                                <span tw='kbd' key={keyName}>
                                    {keyName}
                                </span>
                                {ix !== keys.length - 1 && <span>+</span>}
                            </>
                        ))}
                    </Fragment>
                )
            })}
        </div>
    )
})
