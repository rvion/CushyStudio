import type { St } from './ComfyScriptUI'
import { observer } from 'mobx-react-lite'
import { C } from '../compiler/entry'
import { Comfy } from '../core/dsl'

export const MenuUI = observer(function MenuUI_(p: { st: St }) {
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
            {[...C.nodes.values()].map((node) => {
                return (
                    <div key={node.uid} className='node'>
                        <div>{node.constructor.name}</div>
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
