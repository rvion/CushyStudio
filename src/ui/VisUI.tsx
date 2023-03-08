import { observer } from 'mobx-react-lite'
import * as visData from 'vis-data'
import * as visNetwork from 'vis-network'
import type { Edge, Node, Options } from 'vis-network/declarations/network/Network'
import { useLayoutEffect } from 'react'
import { useSt } from './EditorState'

export const VisUI = observer(function VisUI_(p: {}) {
    const st = useSt()
    const x = useLayoutEffect(() => {
        const foo = st.project.visData
        var nodes = new visData.DataSet(foo.nodes)
        var edges = new visData.DataSet(foo.edges)
        var container = document.getElementById('mynetwork')!
        if (container == null) return console.log('container is null')
        var data = {
            nodes: nodes,
            edges: edges,
        }
        var options: VisOptions = {
            layout: {
                improvedLayout: true,
                hierarchical: {
                    sortMethod: 'directed',
                    direction: 'LR',
                    shakeTowards: 'roots',
                },
            },
        }
        var network = new visNetwork.Network(container, data, options)
        return
    }, [])
    return (
        <div style={{ height: '100%' }} id='mynetwork'>
            OKOK
        </div>
    )
})

export type VisNodes = Node // { id: string; label: string; color?: string; font?: { color: string } }
export type VisEdges = Edge // { id: string; from: string; to: string }
export type VisOptions = Options
