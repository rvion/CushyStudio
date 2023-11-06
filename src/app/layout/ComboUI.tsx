import { observer } from 'mobx-react-lite'
import { Combo, parseInputSequence } from 'src/shortcuts/ShortcutManager'

export const ComboUI = observer(function ComboUI_(p: { theme?: 'dark' | 'light'; combo?: Combo }) {
    if (p.combo == null) return null
    const foo = parseInputSequence(p.combo)
    return (
        <div tw='whitespace-nowrap'>
            {foo.map((i) => (
                <span
                    style={{
                        // fontSize: '0.6rem',
                        display: 'inline-block',
                        // lineHeight: '.9rem',
                        minWidth: '.9rem',
                        // height: '1rem',
                        textAlign: 'center',
                        padding: '.2rem',
                        color: '#d4d4d4',
                        margin: '1px',
                        borderRadius: '.1rem',
                        border: '1px solid #626262',
                        borderBottom: '3px solid #626262',
                        backgroundColor: '#464646',
                        textTransform: 'capitalize',
                    }}
                >
                    {i}
                </span>
            ))}
        </div>
    )
})
