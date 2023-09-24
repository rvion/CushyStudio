import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Input, InputGroup } from 'rsuite'
import { useProject } from '../../../front/ProjectCtx'

export const ComfyNodeExplorerUI = observer(function ComfyNodeExplorerUI_(p: {}) {
    const pj = useProject()
    return (
        <div className='flex flex-col'>
            <InputGroup>
                <InputGroup.Addon>
                    <I.Search />
                </InputGroup.Addon>
                <Input />
            </InputGroup>
            {Object.entries(pj.schema.nodesByNameInComfy).map(([name, node]) => {
                return <div key={name}>{name}</div>
            })}
        </div>
    )
})
