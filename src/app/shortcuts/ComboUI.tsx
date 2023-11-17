import { observer } from 'mobx-react-lite'
import { Combo, parseInputSequence } from 'src/app/shortcuts/ShortcutManager'

export const ComboUI = observer(function ComboUI_(p: { theme?: 'dark' | 'light'; combo?: Combo }) {
    if (p.combo == null) return null
    const foo = parseInputSequence(p.combo)
    return (
        <div tw='whitespace-nowrap'>
            {foo.map((i) => (
                <span tw='kbd'>{i}</span>
            ))}
        </div>
    )
})
