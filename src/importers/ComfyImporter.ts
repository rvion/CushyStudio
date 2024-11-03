import type { ComfyUIAPIRequest } from '../comfyui/comfyui-prompt-api'
import type { NodeInputExt } from '../comfyui/comfyui-types'
import type { ParsedComfyUIObjectInfoNodeSchema } from '../comfyui/ParsedComfyUIObjectInfoNodeSchema'
import type { TEdge } from '../csuite/utils/toposort'
import type { STATE } from '../state/state'

import { convertComfyNodeNameToCushyNodeNameValidInJS } from '../core/normalizeJSIdentifier'
import { ComfyPrimitiveMapping } from '../core/Primitives'
import { bang } from '../csuite/utils/bang'
import { toposort } from '../csuite/utils/toposort'
import { CodeBuffer } from '../utils/codegen/CodeBuffer'
import { asJSAccessor, escapeJSKey } from '../utils/codegen/escapeJSKey'
import { jsEscapeStr } from '../utils/codegen/jsEscapeStr'
import { Namer } from './Namer'

/** Converts Comfy JSON prompts to ComfyScript code */
type RuleInput = {
   nodeName: string
   inputName: string
   valueStr: string | number | boolean | null | undefined
}

export type PromptToCodeOpts = {
   title?: string
   illustration?: string
   author?: string
   //
   preserveId: boolean
   autoUI: boolean
}

const formVarInUIFn: 'form' = 'form'

export class ComfyImporter {
   constructor(public st: STATE) {}

   // -----------------------------------------------------------------------------
   // ATTRIBUTE TO IGNORE
   UI_ONLY_ATTRIBUTES: string[] = [
      //
      'Random seed after every gen',
      'choose file to upload',
   ]

   // ATTRIBUTE THAT HAD AN OTHER NAME BEFORE
   RULES: ((p: RuleInput) => void)[] = [
      (p: RuleInput): void => {
         if (
            //
            p.nodeName === 'KSampler' &&
            p.inputName === 'sampler_name' &&
            typeof p.valueStr === 'string' &&
            p.valueStr.startsWith('sample_')
         ) {
            p.valueStr = p.valueStr.replace('sample_', '')
         }
      },
   ]

   knownAliaes: { [key: string]: string } = {
      LatentUpscaleBy: 'Latent Upscale by Factor (WAS)',
   }
   // -----------------------------------------------------------------------------

   resetCache = (): void => {
      this.nameDedupeCache = {}
   }
   nameDedupeCache: { [key: string]: number } = {}

   /** handles hygenic naming  */

   mkVarNameForNodeType = (
      //
      nodeType: string,
      nameOfInputsItsPluggedInto: string[],
   ): string => {
      if (nodeType === 'CheckpointLoaderSimple') return this.finalizeName('ckpt')
      if (nodeType === 'InvertMask') return this.finalizeName('mask')
      // remove some ugly prefixes:
      const uglyPrefixes = [`$$5BComfy3D$$5D_`]
      for (const prefix of uglyPrefixes) {
         if (nodeType.startsWith(prefix)) return this.finalizeName(nodeType.slice(prefix.length))
      }
      // nice hack to make code readable; if this node is used to feed a single other node,
      // then we can use the name of the input of the node it feeds
      if (nameOfInputsItsPluggedInto.length === 1) {
         return this.finalizeName(bang(nameOfInputsItsPluggedInto[0]))
      }
      return this.finalizeName(nodeType)
   }

   private finalizeName = (rawName: string): string => {
      const final = this.smartDownCase(this.smartTrim(this.smartDownCase(rawName)))
      if (this.nameDedupeCache[final] == null) {
         this.nameDedupeCache[final] = 1
         return final
      } else {
         return `${final}${this.nameDedupeCache[final]++}`
      }
   }

   private smartDownCase = (x: string): string => {
      const isAllCaps = x === x.toUpperCase()
      if (isAllCaps) return x.toLowerCase()
      return bang(x[0]).toLowerCase() + x.slice(1)
   }

   /** trim useless suffixes, like _name */
   private smartTrim = (x: string): string => {
      if (x !== 'Loader' && x.endsWith('Loader')) return x.slice(0, -6)
      if (x.startsWith('load_')) return x.slice(5)
      if (x.startsWith('load') && x[4] && /[A-Z]/.test(x[4])) return x.slice(4)
      // if (x !== 'Image' && x.endsWith('Image')) return x.slice(0, -5)
      return x
   }

   convertPromptToCode = (flow: ComfyUIAPIRequest, opts: PromptToCodeOpts): string => {
      this.resetCache()
      const flowNodes = Object.entries(flow)
      const ids = Object.keys(flow)
      const edges: TEdge[] = []
      for (const [id, node] of flowNodes) {
         // const cls: ComfyNodeSchema = schema.nodesByName[node.class_type]
         const inputs = Object.entries(node.inputs)
         for (const [_name, input] of inputs) {
            if (Array.isArray(input)) {
               const from = input[0]
               const to = id
               // console.log(from, to)
               edges.push([from, to] as TEdge)
            }
         }
      }
      console.log(`1. toposrt (${edges.map((e) => e.join('->')).join(',')})`)
      const sortedNodes = toposort(ids, edges)
      const b = new CodeBuffer()
      const bRun = new CodeBuffer()
      const bUI = new CodeBuffer()
      const { w: p, append: pi } = b
      const { w: pRun, append: piRun } = bRun
      const { w: pUI, append: piUI } = bUI
      type UIVal = {
         typeofValue: string
         schema: NodeInputExt | undefined
         name: string
         nameEscaped: string
         default: string | number | boolean | null | undefined
      }

      p   (`app({ `) // prettier-ignore
      p   (`    metadata:{`) // prettier-ignore
      if (opts.author      ) p(`        author: ${JSON.stringify(opts.author)},`) // prettier-ignore
      if (opts.title       ) p(`        name: ${JSON.stringify(opts.title)},`) // prettier-ignore
      if (opts.illustration) p(`        illustration: ${JSON.stringify(opts.illustration)},`) // prettier-ignore
      p   (`    },`) // prettier-ignore
      pRun(`    run: async (run, ui) => {`)
      pRun(`        const graph = run.nodes`)
      pUI (`    ui: (${formVarInUIFn}) => ({`) // prettier-ignore
      // p(`import { Comfy } from '../core/dsl'\n`)
      // p(`export const demo = new Comfy()`)

      // const nodeCounter: { [nodeType: string]: number } = {}
      const generatedName = new Map<string, string>()
      const availableSignals = new Map<string, string>()
      const pNamer = new Namer()

      for (const nodeID of sortedNodes) {
         // @ts-ignore
         const node = flow[nodeID]!
         const classType = convertComfyNodeNameToCushyNodeNameValidInJS(node.class_type)
         const varName = this.mkVarNameForNodeType(classType, []) //`${classType}_${nodeID}`

         generatedName.set(nodeID, varName)
         const schema: Maybe<ParsedComfyUIObjectInfoNodeSchema> =
            this.st.schema.nodesByNameInCushy[classType] ?? //
            this.st.schema.nodesByNameInCushy[this.knownAliaes[classType]!]
         if (schema == null) {
            const msg = `schema not found for ${classType}`
            console.error('🔥', msg)
            console.error('🔥', `known schemas: ${Object.keys(this.st.schema.nodesByNameInCushy).join(', ')}`)
            throw new Error(msg)
         }
         let outoutIx = 0
         for (const o of schema.outputs ?? []) {
            const isValid1234 = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(o.nameInCushy)
            const isSingleOutputOfThisType =
               schema.outputs.filter((t) => t.typeName === o.typeName).length === 1
            const cleanestPossibleLink = isSingleOutputOfThisType //
               ? varName
               : isValid1234 //
                 ? `${varName}.outputs.${o.nameInCushy}`
                 : `${varName}.outputs["${o.nameInCushy}"]`

            availableSignals.set(`${nodeID}-${outoutIx++}`, cleanestPossibleLink)
         }

         if (node == null) throw new Error('node not found')
         piRun(`        const ${varName} = graph.${classType}({ `)

         // name of the group of fields where primitive input for this node
         // will be added to the form
         const inputGroupName = pNamer.name(`${node.class_type}`)
         // const inputGroupName = pNamer.name(`${node.class_type}_${nodeID}`)

         const nodeInputs = Object.entries(node.inputs) ?? []
         const uiStuff: string[] = []
         for (const [name, value] of nodeInputs) {
            const isValidJSIdentifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)
            if (this.UI_ONLY_ATTRIBUTES.includes(name)) continue

            const valueStr = Array.isArray(value) //
               ? availableSignals.get(value.join('-'))
               : value

            // apply rules
            const draft: RuleInput = {
               inputName: name,
               nodeName: classType,
               valueStr,
            }
            for (const rule of this.RULES) rule(draft)

            // escape name if needed
            const name2 = isValidJSIdentifier ? name : `'${name}'`

            if (Array.isArray(value)) {
               // const signal = availableSignals.get(value.join('-'))
               piRun(`${name2}: ${draft.valueStr}, `)
            } else {
               if (opts.autoUI) {
                  const inputSchema = schema.inputs.find((x) => x.nameInComfy === name)
                  // if (inputSchema == null) debugger
                  const inputName = pNamer.name(name)
                  const uiVal: UIVal = {
                     typeofValue: valueStr == null ? typeof valueStr : 'strOpt',
                     name: inputName,
                     schema: inputSchema,
                     nameEscaped: escapeJSKey(inputName),
                     default: valueStr,
                  }
                  uiStuff.push(`${uiVal.nameEscaped}: ${renderUIForInput(uiVal)},`)
                  // uiStuff.push(`${uiVal.nameEscaped}: ${renderUIForInput(uiVal)} /* ${uiVal.schema?.type} */,`)
                  piRun(`${name2}: ${renderAdapterForInput(uiVal, inputGroupName)}, `)
               } else {
                  piRun(`${name2}: ${jsEscapeStr(draft.valueStr)}, `)
               }
            }
         }

         if (uiStuff.length === 1) {
            piUI(`        ${inputGroupName}: ${formVarInUIFn}.group({`)
            piUI(` items:() => ({ ${uiStuff[0]} })`)
            piUI(`}),\n`)
         } else if (uiStuff.length > 0) {
            pUI(`        ${inputGroupName}: ${formVarInUIFn}.group({`)
            pUI(`           items:() => ({`)
            for (const x of uiStuff) {
               pUI(`                ` + x)
            }
            pUI(`            }),`)
            pUI(`        }),`)
         }

         if (opts.preserveId) pRun(`}, {id: '${nodeID}'})`)
         else pRun(`})`)
      }

      pRun('        await run.PROMPT()')
      pRun('    },')

      function renderAdapterForInput(x: UIVal, inputGroupName?: string): string {
         const s = x.schema
         const inputName = x.name
         const prefix = inputGroupName ? `ui.${inputGroupName}` : 'ui'
         if (s == null) return `null`
         if (s.type === 'Enum_LoadImage_image')
            return `await run.loadImageAnswerAsEnum(${prefix}${asJSAccessor(inputName)})`
         return `${prefix}${asJSAccessor(inputName)}`
      }

      function renderUIForInput(x: UIVal): string | undefined {
         const s = x.schema
         // no schema, let's try to infer the type from the value
         if (s == null) return `${formVarInUIFn}.${x.typeofValue}({default: ${jsEscapeStr(x.default)}})`

         if (x.name === 'seed' && s.type === 'INT')
            return `${formVarInUIFn}.seed({default: ${jsEscapeStr(x.default)}})`
         if (s.type === 'Enum_LoadImage_image')
            return `${formVarInUIFn}.image({default: ${jsEscapeStr(x.default)}})`
         if (s.type.startsWith('Enum_'))
            return `${formVarInUIFn}.enum.${s.type}({default: ${jsEscapeStr(x.default)} })`

         if (s.type in ComfyPrimitiveMapping) {
            let builderFnName = ((): string => {
               const typeLower = s.type.toLowerCase()
               if (typeLower === 'boolean') return 'boolean'
               if (typeLower === 'float') return 'float'
               if (typeLower === 'int') return 'int'
               if (typeLower === 'integer') return 'int'
               if (typeLower === 'string') return 'string'
               return ComfyPrimitiveMapping[s.type] ?? 'str'
            })()

            if (!s.required && builderFnName != 'boolean') builderFnName += 'Opt'
            const opts = typeof s.opts === 'object' ? s.opts : {}
            const minP = opts.min != null ? `, min: ${opts.min}` : ''
            const maxP = opts.max != null ? `, max: ${opts.max}` : ''
            const stepP = opts.step != null ? `, step: ${opts.step}` : ''
            const extraOpts = `${minP}${maxP}${stepP}`
            return `${formVarInUIFn}.${builderFnName}({default: ${jsEscapeStr(x.default)}${extraOpts}})`
         }
      }

      pUI(`    }),`)
      p(bUI.content)
      p(bRun.content)
      p('})')
      // b.writeTS('./src/compiler/entry.ts')
      return b.content
   }
}
