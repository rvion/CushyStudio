import type { ComfyNodeJSON, ComfyProjectJSON } from '../core/ComfyNodeJSON'
import type { EditorState } from './EditorState'

import { Comfy, schemas } from '../core/Comfy'
import { observer } from 'mobx-react-lite'
import { comfyColors } from '../core/ComfyColors'
import { ComfyNodeUID } from '../core/ComfyNodeUID'
import { ComfyNodeSchema } from '../core/ComfyNodeSchema'

export const MenuUI = observer(function MenuUI_(p: { st: EditorState }) {
    const st = p.st
    const project: Comfy | null = p.st.liveModel
    // const NODES = liveModel ? [...liveModel.nodes.values()] : []
    const VERSIONS: ComfyProjectJSON[] = project?.VERSIONS ?? []
    const NODES: [uid: ComfyNodeUID, json: ComfyNodeJSON][] =
        st.focus in VERSIONS //
            ? Object.entries(VERSIONS[st.focus])
            : []
    return (
        <div className='col menu gap'>
            {/* <h3>Nodes</h3> */}
            <button
                onClick={async () => {
                    //
                    const code = p.st.file?.getValue()
                    if (code == null) return console.log('❌')
                    console.log(code)
                    const fn = new Function('C', `return (async () => { ${code} })()`)
                    await fn(new Comfy())
                }}
            >
                TEST
            </button>
            {VERSIONS && (
                <div className='row gap'>
                    Version
                    <div className='row'>
                        <input
                            min={0}
                            max={VERSIONS.length - 1}
                            type='number'
                            value={st.focus}
                            onChange={(ev) => (st.focus = parseInt(ev.target.value, 10))}
                        />{' '}
                        / {VERSIONS.length}
                    </div>
                </div>
            )}

            {NODES.map(([uid, node]) => {
                const name = node.class_type
                const schema: ComfyNodeSchema = schemas[name]
                const curr = project?.nodes.get(uid)
                return (
                    <div key={uid} className='node' style={{ backgroundColor: comfyColors[schema.category] }}>
                        <div>{name}</div>
                        <div>
                            {schema.input.map((input) => (
                                <div key={input.name} className='prop row'>
                                    <div className='propName'>
                                        {/* ::{node.$schema.category} */}
                                        {input.name}
                                    </div>
                                    <div className='propValue'>
                                        {node.inputs[input.name]}
                                        {/* {JSON.stringify(node.serializeValue(input.name, node.inputs[input.name]))} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='row wrap'>
                            {curr?.allArtifactsImgs.map((url) => (
                                <div key={url}>
                                    <img
                                        style={{
                                            width: '5rem',
                                            height: '5rem',
                                        }}
                                        key={url}
                                        src={url}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
