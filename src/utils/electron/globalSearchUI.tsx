import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

export const GlobalSearchUI = observer(function GlobalSearchUI_(p: {}) {
    if (!cushy.search.active) return null
    const aa = nanoid()
    return (
        <div>
            <div
                //
                style={{ zIndex: 999 }}
                tw='absolute top-10
                10 right-10 bg-gray-500'
            >
                <input
                    tw='input input-sm'
                    autoFocus
                    type='text'
                    value={cushy.search.query.value}
                    onFocus={(ev) => {
                        // console.log(`[🤠] onFocus`)
                        // select the whole text
                        if (
                            (ev.target.selectionStart == null || ev.target.selectionStart == 0) &&
                            (ev.target.selectionEnd == null || ev.target.selectionEnd == 0)
                        )
                            ev.target.select()
                    }}
                    onChange={(ev) => {
                        let next = ev.target.value
                        // ⏸️ if (next[1] && next[1] !== '$') {
                        // ⏸️     next = Array.from(next)
                        // ⏸️         .filter((c) => c !== '$')
                        // ⏸️         .join('')
                        // ⏸️     next = next[0] + '$' + next.slice(1)
                        // ⏸️ }
                        cushy.search.query.value = next
                    }}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Escape') {
                            cushy.search.deactivate()
                        }
                        if (ev.key === 'Enter') {
                            const forward = ev.shiftKey ? false : true
                            cushy.search.searchQuery(cushy.search.query.value, forward)
                        }
                    }}
                    // onBlur={() => {
                    //     cushy.search.deactivate()
                    // }}
                />
                {cushy.search.query.value.length}
                <JsonViewUI value={cushy.search.results} />
            </div>
        </div>
    )
})
