import type { St } from './ComfyScriptUI'
import { observer } from 'mobx-react-lite'
import { Comfy } from '../core/Comfy'
import { comfyColors } from '../core/ComfyColors'

export const MenuUI = observer(function MenuUI_(p: { st: St }) {
    const liveModel = p.st.liveModel
    const NODES = liveModel ? [...liveModel.nodes.values()] : []
    return (
        <div className='col menu gap'>
            <h3>Nodes</h3>
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
            <div>
                Versions
                <div>{liveModel?.VERSIONS.length}</div>
            </div>
            {NODES.map((node) => {
                return (
                    <div key={node.uid} className='node' style={{ backgroundColor: comfyColors[node.$schema.category] }}>
                        <div>{node.constructor.name}</div>
                        <div>
                            {node.$schema.input.map((input) => (
                                <div key={input.name} className='prop row'>
                                    <div className='propName'>
                                        {/* ::{node.$schema.category} */}
                                        {input.name}
                                    </div>
                                    <div className='propValue'>
                                        {JSON.stringify(node.serializeValue(input.name, node.inputs[input.name]))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='row wrap'>
                            {node.allArtifactsImgs.map((url) => (
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
