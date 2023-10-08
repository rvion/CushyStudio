import type { LiteGraphJSON, LiteGraphLink, LiteGraphLinkID, LiteGraphNode } from './LiteGraph'
import type { ComfyNodeJSON, ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { ComfyNodeSchema, SchemaL } from '../models/Schema'
import { bang } from '../utils/bang'

export const convertLiteGraphToPrompt = (
    //
    schema: SchemaL,
    workflow: LiteGraphJSON,
): ComfyPromptJSON => {
    const prompt: ComfyPromptJSON = {}

    const PRIMITIVE_VALUES: { [key: string]: any } = {}
    for (const node of workflow.nodes) {
        // Don't serialize Note nodes (those are like comments)
        if (node.type === 'PrimitiveNode') {
            console.log(`found primitive ${node.type}#${node.id} with value ${bang(node.widgets_values[0])}`)
            PRIMITIVE_VALUES[node.id] = bang(node.widgets_values[0])
            // debugger
        }
    }
    for (const node of workflow.nodes) {
        console.log(`💎 node ${node.type}#${node.id}`)

        if (node.isVirtualNode) {
            console.log(`    | [🔶 WARN] virtual node ${node.id}(${node.type}) skipped`)
            // Don't serialize frontend only nodes but let them make changes
            // ! if (node.applyToGraph) {
            // !     node.applyToGraph(workflow)
            // ! }
            continue
        }

        // Don't serialize muted nodes
        if (node.mode === 2) {
            console.log(`    | [🔶 WARN] muted node ${node.id}(${node.type}) skipped`)
            continue
        }

        // Don't serialize reroute nodes
        if (node.type === 'Reroute') {
            console.log(`    | [🔶 WARN] "Reroute" node ${node.id} skipped`)
            continue
        }
        // Don't serialize Note nodes (those are like comments)
        if (node.type === 'Note') {
            console.log(`    | [🔶 WARN] "Note" node ${node.id} skipped`)
            continue
        }

        // Don't serialize Note nodes (those are like comments)
        if (node.type === 'PrimitiveNode') {
            console.log(`    | [🔶 WARN] PrimitiveNode#${node.id} => will be inlined by children`)
            continue
        }

        const inputs: ComfyNodeJSON['inputs'] = {}
        // const widgets = node.widgets

        const viaInput = new Set((node?.inputs ?? []).map((i) => i.name))
        const nodeTypeName = node.type
        const nodeSchema: ComfyNodeSchema = schema.nodesByNameInComfy[nodeTypeName]
        if (nodeSchema == null) {
            console.log(`❌ node causing a crash:`, { node })
            console.log(`❌ current prompt Step is:`, { prompt })
            throw new Error(`❌ node ${node.id}(${node.type}) has no schema`)
        }
        const nodeInputs = nodeSchema.inputs
        if (nodeInputs == null) throw new Error(`❌ node ${node.id}(${node.type}) has no input`)

        let offset = 0
        // new logic:
        // 1 insert all values found in the node, regardless of the schema
        // 2. then insert all values or default from the schema

        // const shouldDebug = nodeTypeName === 'Evaluate Strings'
        // if (shouldDebug) debugger

        // 2. By Schema -----------------------------------------------------
        for (const field of nodeSchema.inputs) {
            // if (_done.has(field.nameInComfy)) continue
            if (viaInput.has(field.nameInComfy)) {
                console.log(`    | .${field.nameInComfy} (viaInput)`)
                if (field.isPrimitive) offset++
                continue
            }
            console.log(`    | .${field.nameInComfy} (viaValue: ${node.widgets_values[offset]})`)
            inputs[field.nameInComfy] = node.widgets_values[offset++]
            //
            const isSeed = field.type === 'INT' && (field.nameInComfy === 'seed' || field.nameInComfy === 'noise_seed')
            if (isSeed) offset++
            // for (const val of node.widgets_values)
        }
        // 1. By value -----------------------------------------------------
        // ❓ const _done = new Set<string>()
        // ❓ for (const field of node.inputs ?? []) {
        // ❓     if (viaInput.has(field.name)) {
        // ❓         if (field.widget) {
        // ❓             console.log(`    | .${field.name} (viaInput canceleld) [OFFSET]`)
        // ❓             offset++
        // ❓         } else {
        // ❓             console.log(`    | .${field.name} (viaInput)`)
        // ❓         }
        // ❓         continue
        // ❓     }
        // ❓     _done.add(field.name)
        // ❓     inputs[field.name] = node.widgets_values[offset++]
        // ❓     const isSeed = field.type === 'INT' && (field.name === 'seed' || field.name === 'noise_seed')
        // ❓     if (isSeed) offset++
        // ❓     // for (const val of node.widgets_values)
        // ❓ }

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
            if (link == null) throw new Error(`Node ${node.id}(${node.type}) references a non-existing link (id=${linkId}})`)
            const parentId = link[1]
            const parentNode = workflow.nodes.find((n) => n.id === parentId)
            if (parentNode == null) throw new Error(`link ${linkId} references a non-existent parent node ${parentId}`)
            return { node: parentNode, link }
        }

        INPT: for (const ipt of node?.inputs ?? []) {
            let parent: Maybe<ParentInfo> = null
            let max = 100
            while ((parent == null || parent.node.type === 'Reroute') && max-- > 0) {
                if (parent != null) console.log('    | skipping reroute')
                const linkId = parent?.node.inputs?.[0].link ?? ipt.link
                if (linkId == null) {
                    console.log(`    | [🔶 WARN] node ${node.id}(${node.type}) has an empty input slot`)
                    continue INPT
                }
                parent = getParentNode(linkId)
            }
            if (parent == null) throw new Error(`no parent found for ${node.id}.${ipt.name})`)

            if (parent.node.type === 'PrimitiveNode') {
                console.log('    | inlining primitive', { val: PRIMITIVE_VALUES[parent.node.id] })
                inputs[ipt.name] = PRIMITIVE_VALUES[parent.node.id]
            } else {
                console.log(`    | .${ipt.name}  (via LINK`, String(parent.node.id), parent.link[2], parent.node.type, ')')
                inputs[ipt.name] = [String(parent.node.id), parent.link[2]]
            }

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

        console.log(`    | [🟢 OK] node ${node.id}(${node.type}) => ${JSON.stringify(inputs)}`)

        prompt[String(node.id)] = {
            inputs,
            class_type: node.type,
        }
    }
    console.log('🟢 converted:', { prompt })

    return prompt
}
