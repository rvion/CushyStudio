import type { ProjectL } from 'src/models/Project'
import type { ComfyNodeSchema } from 'src/models/Schema'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Input, Joined, Addon } from 'src/rsuite/shims'
import { getColorForInputNameInComfy, getColorForOutputNameInCushy } from 'src/core/Colors'
import { useSt } from 'src/state/stateContext'
import { searchMatches } from 'src/utils/misc/searchMatches'
import { hash } from 'ohash'

class ComfyNodeExplorerState {
    // globalSearch = ''
    name = ''
    input = ''
    output = ''
    category = ''
    constructor(public pj: ProjectL) {
        makeAutoObservable(this)
    }
    get nodeEntries(): [string, ComfyNodeSchema][] {
        return Object.entries(this.pj.schema.nodesByNameInComfy)
    }
    get matches(): [string, ComfyNodeSchema][] {
        const OUT: [string, ComfyNodeSchema][] = []
        for (const [_nameInCushy, nodeSchema] of this.nodeEntries) {
            const nameInCushy = _nameInCushy.toLowerCase()
            const nameInComfy = nodeSchema.nameInComfy.toLowerCase()
            if (this.name && !(nameInCushy.includes(this.name) || nameInComfy.includes(this.name))) continue
            if (this.input) {
                const matches = nodeSchema.inputs.some((x) => searchMatches(x.nameInComfy, this.input))
                if (!matches) continue
            }
            if (this.output && !nodeSchema.outputs.some((x) => searchMatches(x.nameInComfy, this.output))) continue
            if (this.category && !nodeSchema.category.includes(this.category)) continue
            OUT.push([nameInCushy, nodeSchema])
        }
        return OUT
    }
}

export const Panel_ComfyNodeExplorer = observer(function ComfyNodeExplorerUI_(p: {}) {
    const st = useSt()
    const pj = st.getProject()
    const search = useMemo(() => new ComfyNodeExplorerState(pj), [])
    const repo = st.managerRepository
    return (
        <div className='flex flex-col _MD'>
            <table
                //
                cellPadding={0}
                cellSpacing={0}
                className='table table-zebra-zebra table-zebra table-sm'
            >
                <thead tw='sticky top-0 z-40'>
                    <tr>
                        <th>
                            <div>name</div>
                            <Input value={search.name} onChange={(ev) => (search.name = ev.target.value)} />
                        </th>
                        <th>Found in...</th>
                        <th>
                            <div>input</div>
                            <Input value={search.input} onChange={(ev) => (search.input = ev.target.value)} />
                        </th>
                        <th>
                            <div>output</div>
                            <Input value={search.output} onChange={(ev) => (search.output = ev.target.value)} />
                        </th>
                        <th>
                            <div>category</div>
                            <Input value={search.category} onChange={(ev) => (search.category = ev.target.value)} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {search.matches.map(([name, node]) => {
                        return (
                            <tr key={name + hash(node)}>
                                <td tw='whitespace-pre-wrap'>
                                    {node.nameInComfy}
                                    {/* {name} */}
                                </td>
                                <td>
                                    {repo.plugins_byNodeNameInComfy
                                        .get(node.nameInComfy)
                                        ?.map((x) => x.title)
                                        .join(', ')}
                                </td>
                                <td tw='whitespace-pre-wrap'>
                                    <div tw='flex flex-wrap gap-0.5'>
                                        {node.inputs.map((i) => (
                                            <span
                                                style={{ background: getColorForInputNameInComfy(i.nameInComfy) }}
                                                tw='rounded bg-gray-700 p-0.5'
                                            >
                                                {i.nameInComfy}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <div tw='flex flex-wrap gap-0.5'>
                                        {node.outputs.map((o) => (
                                            <span
                                                style={{ background: getColorForOutputNameInCushy(o.nameInCushy) }}
                                                tw='rounded bg-gray-700 p-0.5'
                                            >
                                                {o.nameInCushy}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td>{node.category}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
})
