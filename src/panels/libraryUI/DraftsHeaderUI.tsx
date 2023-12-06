import { observer } from 'mobx-react-lite'
import { useSt } from '../../state/stateContext'
import { PkgHeaderStyle } from 'src/panels/libraryUI/AppListStyles'

export const DraftsHeaderUI = observer(function DraftsHeaderUI_(p: {}) {
    const st = useSt()
    return (
        <div
            tw={[
                //
                PkgHeaderStyle,
                'cursor-pointer items-center gap-1 flex justify-between',
            ]}
            onClick={() => (st.draftsFolded = !st.draftsFolded)}
        >
            <div>
                <span
                    //
                    style={{ fontSize: '2rem' }}
                    tw='text-primary'
                    className='material-symbols-outlined'
                >
                    dynamic_form
                </span>
            </div>
            <div tw='flex-1 text-base-content'>Drafts</div>
            {/* FOLD INDICATOR */}
            <label className='swap swap-rotate opacity-30'>
                <input
                    type='checkbox'
                    checked={st.draftsFolded}
                    onChange={(ev) => {
                        st.draftsFolded = !ev.target.checked
                    }}
                />
                <span className='material-symbols-outlined swap-on'>keyboard_arrow_right</span>
                <span className='material-symbols-outlined swap-off'>keyboard_arrow_down</span>
            </label>
        </div>
    )
})
