import type { ProjectL } from 'src/models/Project'
import type { ComfyNodeSchema } from 'src/models/Schema'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Input, InputGroup, Tag } from 'rsuite'
import { useProject } from '../../../front/ProjectCtx'
import { getColorForInputNameInComfy, getColorForOutputNameInCushy } from 'src/core/Colors'

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
            if (this.name && !nameInCushy.includes(this.name)) continue
            if (this.input && !nodeSchema.inputs.some((x) => nameInCushy.includes(this.input))) continue
            if (this.output && !nodeSchema.outputs.some((x) => x.nameInCushy.includes(this.output))) continue
            if (this.category && !nodeSchema.category.includes(this.category)) continue
            OUT.push([nameInCushy, nodeSchema])
        }
        return OUT
    }
}

export const ComfyNodeExplorerUI = observer(function ComfyNodeExplorerUI_(p: {}) {
    const pj = useProject()
    const search = useMemo(() => new ComfyNodeExplorerState(pj), [])

    return (
        <div className='_MD flex flex-col'>
            {/* <InputGroup size='xs'>
                <InputGroup.Addon>
                    <span className='material-symbols-outlined'>search</span>
                </InputGroup.Addon>
                <Input value={search.name} onChange={(n) => (search.name = n)} />
            </InputGroup> */}
            <table cellPadding={0} cellSpacing={0}>
                <thead tw='sticky top-0 bg-gray-600 z-40'>
                    <tr>
                        <th>name</th>
                        <th>input</th>
                        <th>output</th>
                        <th>category</th>
                    </tr>
                    <tr>
                        <th>
                            <InputGroup size='xs'>
                                <InputGroup.Addon>
                                    <span className='material-symbols-outlined'>search</span>
                                </InputGroup.Addon>
                                <Input value={search.name} onChange={(n) => (search.name = n)} />
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size='xs'>
                                <InputGroup.Addon>
                                    <span className='material-symbols-outlined'>search</span>
                                </InputGroup.Addon>
                                <Input value={search.input} onChange={(n) => (search.input = n)} />
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size='xs'>
                                <InputGroup.Addon>
                                    <span className='material-symbols-outlined'>search</span>
                                </InputGroup.Addon>
                                <Input value={search.output} onChange={(n) => (search.output = n)} />
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup size='xs'>
                                <InputGroup.Addon>
                                    <span className='material-symbols-outlined'>search</span>
                                </InputGroup.Addon>
                                <Input value={search.category} onChange={(n) => (search.category = n)} />
                            </InputGroup>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {search.matches.map(([name, node]) => {
                        return (
                            <tr key={name}>
                                <td tw='[max-width:10rem]'>{name}</td>
                                <td tw='[max-width:10rem]'>
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
                        // <div key={name}>{name}</div>
                    })}
                </tbody>
            </table>
        </div>
    )
})
