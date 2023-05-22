import type { ComfyNodeJSON, ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { LiteGraphJSON, LiteGraphLink, LiteGraphLinkID, LiteGraphNode, LiteGraphNodeInput } from './LiteGraph'
import type { Maybe } from 'src/utils/types'
import type { SchemaL } from '../models/Schema'
import type { ComfyNodeSchema } from '../models/Schema'

export const convertLiteGraphToPrompt = (
    //
    schema: SchemaL,
    workflow: LiteGraphJSON,
): ComfyPromptJSON => {
    const prompt: ComfyPromptJSON = {}

    for (const node of workflow.nodes) {
        const n = workflow.nodes.find((n) => n.id === node.id)

        if (node.isVirtualNode) {
            console.log('virtual node', node.id, 'skipped')
            // Don't serialize frontend only nodes but let them make changes
            // ! if (node.applyToGraph) {
            // !     node.applyToGraph(workflow)
            // ! }
            continue
        }

        // Don't serialize muted nodes
        if (node.mode === 2) {
            console.log('muted node', node.id, 'skipped')
            continue
        }

        // Don't serialize reroute nodes
        if (node.type === 'Reroute') {
            continue
        }

        const inputs: ComfyNodeJSON['inputs'] = {}
        // const widgets = node.widgets

        const viaInput = new Set((node?.inputs ?? []).map((i) => i.name))
        const nodeTypeName = node.type
        const nodeSchema: ComfyNodeSchema = schema.nodesByNameInComfy[nodeTypeName]
        let offset = 0
        for (const field of nodeSchema.inputs) {
            if (viaInput.has(field.name)) {
                console.log(`${field.name}: viaInput`)
                continue
            }
            inputs[field.name] = node.widgets_values[offset++]
            //
            const isSeed = field.type === 'INT' && (field.name === 'seed' || field.name === 'noise_seed')
            if (isSeed) offset++
            // for (const val of node.widgets_values)
        }
        // Store all widget values
        // ! if (widgets) {
        // !     for (const i in widgets) {
        // !         const widget = widgets[i]
        // !         if (!widget.options || widget.options.serialize !== false) {
        // !             inputs[widget.name] = widget.serializeValue ? await widget.serializeValue(n, i) : widget.value
        // !         }
        // !     }
        // ! }

        // console.log(node)
        // Store all node links

        type ParentInfo = { node: LiteGraphNode; link: LiteGraphLink }
        const getParentNode = (linkId: LiteGraphLinkID): ParentInfo => {
            const link = workflow.links.find((link) => link[0] === linkId)
            if (link == null) throw new Error(`Node ${node.id} references a non-existing link (id=${linkId}})`)
            const parentId = link[1]
            const parentNode = workflow.nodes.find((n) => n.id === parentId)
            if (parentNode == null) throw new Error(`link ${linkId} references a non-existent parent node ${parentId}`)
            return { node: parentNode, link }
        }

        for (const ipt of node?.inputs ?? []) {
            let parent: Maybe<ParentInfo> = null
            let max = 100
            while ((parent == null || parent.node.type === 'Reroute') && max-- > 0) {
                if (parent != null) console.log('skipping reroute')
                parent = getParentNode(parent?.node.inputs?.[0].link ?? ipt.link)
            }
            if (parent == null) throw new Error(`no parent found for ${node.id}.${ipt.name})`)
            console.log('  -', String(parent.node.id), parent.link[2], parent.node.type)
            inputs[ipt.name] = [String(parent.node.id), parent.link[2]]

            // console.log('link', ipt.link, 'to', parentId, 'slot', link?.[2])
            // let parent = link?.[1] // node.getInputNode(i)
            // !if (parent) {
            // !    let link = node.getInputLink(ipt)
            // !    while (parent && parent.isVirtualNode) {
            // !        link = parent.getInputLink(link.origin_slot)
            // !        if (link) {
            // !            parent = parent.getInputNode(link.origin_slot)
            // !        } else {
            // !            parent = null
            // !        }
            // !    }
            // !
            // !     if (link) {
            // !         inputs[node.inputs[ipt].name] = [String(link.origin_id), parseInt(link.origin_slot)]
            // !     }
            // ! }
        }

        prompt[String(node.id)] = {
            inputs,
            class_type: node.type,
        }
    }

    return prompt
}
