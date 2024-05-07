import type { ComfyNodeSchema, ComfySchemaL, NodeInputExt } from '../models/ComfySchema'
import type { ComfyNodeJSON, ComfyPromptJSON } from '../types/ComfyPrompt'
import type { LiteGraphJSON, LiteGraphLink, LiteGraphLinkID, LiteGraphNode, LiteGraphNodeInput } from './LiteGraph'

import { ComfyDefaultNodeWhenUnknown_Name } from '../models/ComfyDefaultNodeWhenUnknown'
import { bang } from '../utils/misc/bang'
import { howManyWidgetValuesForThisInputType, howManyWidgetValuesForThisSchemaType } from './Primitives'

export const convertLiteGraphToPrompt = (
    //
    schema: ComfySchemaL,
    workflow: LiteGraphJSON,
): ComfyPromptJSON => {
    const prompt: ComfyPromptJSON = {}
    const LOG = (...args: any[]) => console.log  ('[🔥] converter ℹ️ :', ...args) // prettier-ignore
    const ERR = (...args: any[]) => console.error('[🔥] converter 🔴 :', ...args) // prettier-ignore
    console.groupCollapsed('[🔥] converter')
    try {
        const PRIMITIVE_VALUES: { [key: string]: any } = {}
        for (const node of workflow.nodes) {
            // Don't serialize Note nodes (those are like comments)
            if (node.type === 'PrimitiveNode') {
                const widgetValues = node.widgets_values
                if (widgetValues == null) {
                    ERR(`PrimitiveNode#${node.id} has no widget values`)
                    LOG(`skipping PrimitiveNode#${node.id} because it has no widget values`, node)
                    // debugger // 🔴
                    continue
                }
                LOG(`found primitive ${node.type}#${node.id} with value ${bang(node.widgets_values[0])}`)
                PRIMITIVE_VALUES[node.id] = bang(node.widgets_values[0])
                // debugger
            }
        }
        for (const node of workflow.nodes) {
            const NODE_HEADER = `💎 node ${node.type}#${node.id}`
            const FIELD_PREFIX = `${NODE_HEADER} | `
            LOG(`${NODE_HEADER} 🟰 ---------------------------------------------`)

            if (node.isVirtualNode) {
                LOG(`    | [🔶 WARN] virtual node ${node.id}(${node.type}) skipped`)
                // Don't serialize frontend only nodes but let them make changes
                // ! if (node.applyToGraph) {
                // !     node.applyToGraph(workflow)
                // ! }
                continue
            }

            // Don't serialize muted nodes
            if (node.mode === 2) {
                LOG(`    | [🔶 WARN] muted node ${node.id}(${node.type}) skipped`)
                continue
            }

            // Don't serialize reroute nodes
            if (node.type === 'Reroute') {
                LOG(`    | [🔶 WARN] "Reroute" node ${node.id} skipped`)
                continue
            }
            // Don't serialize Note nodes (those are like comments)
            if (node.type === 'Note') {
                LOG(`    | [🔶 WARN] "Note" node ${node.id} skipped`)
                continue
            }

            // Don't serialize Note nodes (those are like comments)
            if (node.type === 'PrimitiveNode') {
                LOG(`    | [🔶 WARN] PrimitiveNode#${node.id} => will be inlined by children`)
                continue
            }

            const inputs: ComfyNodeJSON['inputs'] = {}
            // const widgets = node.widgets

            const fieldNamesWithLinks = new Set((node?.inputs ?? []).map((i) => i.name))
            const nodeTypeName = node.type
            const nodeSchema_ = schema.nodesByNameInComfy[nodeTypeName]
            // ?? schema.nodesByNameInComfy[ComfyDefaultNodeWhenUnknown_Name]

            if (nodeSchema_ == null) {
                LOG(`❌ missing schema for: ${nodeTypeName}`)
                LOG(`❌ node causing a crash:`, { node })
                LOG(`❌ current prompt Step is:`, { prompt })
                throw new Error(`❌ node ${node.type}) has no known schema; you probably need to install some custom node`)
            }
            const nodeSchema: ComfyNodeSchema = nodeSchema_
            const inputsInNodeSchema: NodeInputExt[] = nodeSchema.inputs
            if (inputsInNodeSchema == null) throw new Error(`❌ node ${node.id}(${node.type}) has no input`)

            let offset = 0
            // new logic:
            // 1. insert all values found in the node, regardless of the schema
            // 2. then insert all values or default from the schema

            // 2. By Schema -----------------------------------------------------
            const inputsInNodeJSON: LiteGraphNodeInput[] = node?.inputs ?? []
            for (const field of inputsInNodeSchema) {
                const input = inputsInNodeJSON.find((i) => i.name === field.nameInComfy)
                const MUST_CONSUME = input?.type //
                    ? howManyWidgetValuesForThisInputType(input.type, field.nameInComfy)
                    : howManyWidgetValuesForThisSchemaType(field)

                // don't handle the non-primitive links
                if (MUST_CONSUME) {
                    const _value = node.widgets_values[offset]
                    LOG(`${FIELD_PREFIX} 🟰 ${field.nameInComfy} = ${_value} [VALUE] (consume ${MUST_CONSUME} fields)`)
                    inputs[field.nameInComfy] = _value
                    offset += MUST_CONSUME
                } else {
                    if (!fieldNamesWithLinks.has(field.nameInComfy))
                        throw new Error(`🔴, ${field.type}, ${field.nameInComfy}, ${MUST_CONSUME}`)
                    LOG(`${FIELD_PREFIX} 👻 ${field.nameInComfy} [LINK] ${field.type}`)
                }
            }

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
                const isPrimitive = howManyWidgetValuesForThisInputType(ipt.type, ipt.name) > 0
                // console.log(node.id, ipt.name, isPrimitive)
                if (isPrimitive) continue

                // not a primitive => we assume it's a link
                if (ipt.link == null) {
                    console.log(
                        `[❌] WARNING: no parent found for ${node.type}.${ipt.name} this could be an error if the input is not optional`,
                    ) //throw new Error(`no link found for ${node.id}.${ipt.name}`)
                    continue
                }
                // retrieve the parent
                let parent: Maybe<ParentInfo> = getParentNode(ipt.link)

                // unwrap reroute nodes
                let max = 100
                while (parent != null && parent.node.type === 'Reroute' && max-- > 0) {
                    LOG(`${FIELD_PREFIX} 🔥 ${ipt.name}... skipping reroute`)
                    const firstParentInput = parent?.node.inputs?.[0]
                    if (firstParentInput == null) {
                        //
                        console.log(`[❌] ERROR: no parent found for ${node.type}.${ipt.name}`)
                        console.log(`[❌]  | parent:`, parent)
                        console.log(`[❌]  | parent.node:`, parent?.node)
                        // throw new Error(`no parent found for ${node.type}.${ipt.name}`)
                        break
                    }
                    const linkId = firstParentInput.link ?? ipt.link
                    if (linkId == null) {
                        LOG(`${FIELD_PREFIX} [🔶 WARN] node ${node.id}(${node.type}) has an empty input slot`)
                        continue INPT
                    }
                    parent = getParentNode(linkId)
                }

                // throw if missing parent
                if (parent == null) {
                    const link = workflow.links.find((l) => l[0] === ipt.link)
                    throw new (class extends Error {
                        extraJSON = { ipt, link, nodeFrom: getParentNode(ipt.link!) }
                        constructor() {
                            super(`no parent found for ${node.id}.${ipt.name}`)
                        }
                    })()
                }

                LOG(`${FIELD_PREFIX} 🟰 ${ipt.name} = [${String(parent.node.id)}, ${parent.link[2]}] [LINK ${parent.node.type}]`)
                inputs[ipt.name] = [String(parent.node.id), parent.link[2]]
            }

            LOG(`    | [🟢 OK] node ${node.id}(${node.type}) => ${JSON.stringify(inputs)}`)

            prompt[String(node.id)] = {
                inputs,
                class_type: node.type,
            }
        }
        LOG('🟢 converted:', { prompt })

        return prompt
    } finally {
        console.groupEnd()
    }
}

/** alias cause I keep forgetting about this */
export const convertWorkflowToPrompt = convertLiteGraphToPrompt
