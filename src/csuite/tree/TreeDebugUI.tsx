import { observer } from 'mobx-react-lite'

import { useTreeView } from './TreeCtx'

export const TreeDebugUI = observer(function TreeDebugUI_(p: {}) {
    const tree = useTreeView()
    if (tree.cursorInfos == null) return null
    return (
        <table>
            <tbody>
                {Object.entries(tree.cursorInfos).map(([k, v]) => (
                    <tr key={k}>
                        <td style={{ textAlign: 'right' }}>{k}:</td>
                        <td>{JSON.stringify(v)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
})

// ▲ △
// ▼ ▽
// ◀ ◁
// ▶ ▷
