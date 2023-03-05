import { observer } from 'mobx-react-lite'
import { C } from '../compiler/entry'

export const MenuUI = observer(function MenuUI_(p: {}) {
    return (
        <div className='col menu gap'>
            <h3>Nodes</h3>
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
