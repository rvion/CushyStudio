import type { ProjectL } from 'src/models/Project'
import type { ComfyNodeSchema } from 'src/models/Schema'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Input, InputGroup, Tag } from 'rsuite'
import { useProject } from '../../../front/ProjectCtx'

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
            <table>
                <thead>
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
                                <td tw='[max-width:10rem]'>{name}</td>
                                <td>
                                    {node.outputs.map((o) => (
                                        <Tag size='sm'>{o.nameInCushy}</Tag>
                                    ))}
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
