import { observer } from 'mobx-react-lite'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'

export const MenuNSFWCheckerUI = observer(function MenuNSFWCheckerUI_(p: {}) {
    const st = useSt()
    const pj = st.project
    const val = pj.filterNSFW
    return (
        <RevealUI trigger='hover' showDelay={0}>
            <label tw='swap swap-flip text-2xl'>
                <input
                    type='checkbox'
                    checked={val}
                    onChange={(ev) => {
                        console.log(`[👙] was`, val)
                        console.log(`[👙] willbe`, val ? SQLITE_false : SQLITE_true)
                        pj.filterNSFW = !val
                    }}
                />
                <div tw='swap-on'>😇</div>
                <div tw='swap-off'>😈</div>
            </label>
            <div>
                NSFW filter is currently
                {val ? ' ON' : ' OFF'}
            </div>
        </RevealUI>
    )
})
