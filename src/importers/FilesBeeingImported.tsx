import type { ComfyUIAPIRequest } from '../comfyui/comfyui-prompt-api'
import type { LiteGraphJSON } from '../comfyui/litegraph/LiteGraphJSON'
import type { KnownComfyCustomNodeName } from '../manager/generated/KnownComfyCustomNodeName'
import type { ExifData } from '../utils/png/_parseExifData'
import type { PromptToCodeOpts } from './ComfyImporter'

import { writeFileSync } from 'fs'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useState } from 'react'

import { convertComfyModuleAndNodeNameToCushyQualifiedNodeKey } from '../comfyui/codegen/_convertComfyModuleAndNodeNameToCushyQualifiedNodeKey'
import { convertLiteGraphToPrompt } from '../comfyui/litegraphToApiRequestPayload'
import { UnknownCustomNode } from '../core/UnknownCustomNode'
import { MessageErrorUI } from '../csuite'
import { Button } from '../csuite/button/Button'
import { extractErrorMessage } from '../csuite/formatters/extractErrorMessage'
import { Frame } from '../csuite/frame/Frame'
import { Surface } from '../csuite/inputs/shims'
import { MessageInfoUI } from '../csuite/messages/MessageInfoUI'
import { toastError } from '../csuite/utils/toasts'
import { Panel_InstallRequirementsUI } from '../manager/REQUIREMENTS/Panel_InstallRequirementsUI'
import { createMediaImage_fromFileObject } from '../models/createMediaImage_fromWebFile'
import { useSt } from '../state/stateContext'
import { getPngMetadataFromFile, type TextChunks } from '../utils/png/_getPngMetadata'
import { getWebpMetadata } from '../utils/png/_getWebpMetadata'
import { TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'
import { usePromise } from './usePromise'

export interface FileListProps {
   files: File[]
}

export const ImportAsImageUI = observer(function ImportAsImageUI_(p: { className?: string; file: File }) {
   const file = p.file
   const url = URL.createObjectURL(p.file)
   const uiSt = useLocalObservable(() => ({ validImage: false }))
   return (
      <div tw='flex gap-1'>
         <img
            onLoad={() => {
               uiSt.validImage = true
               // URL.revokeObjectURL(url)
            }}
            style={{ width: '5rem', height: '5rem' }}
            src={url}
         />
         <Button
            look='primary'
            size='sm'
            disabled={!uiSt.validImage}
            onClick={async () => {
               if (!uiSt.validImage) return
               await createMediaImage_fromFileObject(file)
            }}
            children='Import as image'
         />
      </div>
   )
})

type TTT = Promise<ExifData> | Promise<{ workflow: string }> | 'NO'
function foobar(file: File): TTT {
   if (file.name.endsWith('.png')) return getPngMetadataFromFile(file)
   if (file.name.endsWith('.webp')) return getWebpMetadata(file)
   if (file.name.endsWith('.json')) return file.text().then((x) => ({ workflow: x }))
   return 'NO'
}
export const ImportedFileUI = observer(function ImportedFileUI_(p: {
   //
   className?: string
   file: File
}) {
   const file = p.file
   const [code, setCode] = useState<string | null>(null)
   const [relPath, setRelPath] = useState<string | null>(`library/local/${file.name}-${Date.now()}.ts`)
   const st = useSt()

   type T = Promise<ExifData> | string | { workflow: string }
   type T2 = Promise<ExifData> | Promise<TextChunks> | 'NO' | Promise<{ workflow: string }>
   const promise = usePromise<TTT>(() => foobar(file), [])
   const metadata = promise.value

   if (metadata == null) return <>loading...</>
   if (metadata === 'NO') return <>❌0. no metadata</>

   const workflowStr = (metadata as { [key: string]: any }).workflow

   if (workflowStr == null) return <>❌1. no workflow in metadata (keys: {JSON.stringify(metadata)})</>
   let workflowJSON: LiteGraphJSON
   try {
      workflowJSON = JSON.parse(workflowStr)
   } catch (error) {
      return <>❌2. workflow is not valid json</>
   }

   let promptJSON: ComfyUIAPIRequest
   try {
      promptJSON = convertLiteGraphToPrompt(st.schema, workflowJSON)
   } catch (error) {
      console.log(error)
      if (error instanceof UnknownCustomNode) {
         return (
            <Frame border>
               <MessageErrorUI title={`${error.node.type} ❓`}>
                  Unknown Node
                  <Panel_InstallRequirementsUI
                     requirements={[
                        //
                        {
                           type: 'customNodesByNameInCushy',
                           nodeName: convertComfyModuleAndNodeNameToCushyQualifiedNodeKey(
                              'unknown',
                              error.node.type,
                           ) as KnownComfyCustomNodeName,
                        },
                     ]}
                  />
               </MessageErrorUI>
            </Frame>
         )
      }
      return <>❌3. cannot convert LiteGraph To Prompt {extractErrorMessage(error)}</>
   }

   // const json = rawJson?.value ? JSON.parse(rawJson.value) : null
   // const hasWorkflow = json?.workflow
   const partialImportConfs: {
      title: string
      conf: Partial<PromptToCodeOpts>
   }[] = [
      //
      { title: 'base', conf: { preserveId: false, autoUI: false } },
      { title: 'autoui', conf: { preserveId: false, autoUI: true } },
      { title: 'base+id', conf: { preserveId: true, autoUI: false } },
      { title: 'autoui+id', conf: { preserveId: true, autoUI: true } },
   ]
   return (
      <Surface className={p.className} tw='virtua overflow-auto'>
         <LegacyFieldUI k='name' v={file.name} />
         <LegacyFieldUI k='size' v={file.size} />
         <LegacyFieldUI k='name' v={file.type} />
         {/* ${file.name}' of size '${file.size}' and type '${file.type}'<div>metadata:</div> */}
         <LegacyFieldUI k='metadata' v={metadata} />
         <LegacyFieldUI k='workflowJSON' v={workflowJSON} />
         {/* <div>workfow:</div> */}
         {/* <pre>{JSON.stringify(workflowJSON)}</pre> */}

         <div tw='join'>
            {partialImportConfs.map((conf) => (
               <Button
                  size='sm'
                  tw='join-item'
                  key={conf.title}
                  onClick={async () => {
                     //
                     const x = st.importer.convertPromptToCode(promptJSON, {
                        title: file.name,
                        author: 'unknown',
                        preserveId: conf.conf.preserveId ?? false,
                        autoUI: conf.conf.autoUI ?? true,
                     })
                     setCode(x)
                  }}
               >
                  {conf.title}
               </Button>
            ))}
         </div>

         {code && (
            <div tw='bd1 m-2'>
               <Button
                  look='primary'
                  size='sm'
                  onClick={async () => {
                     // if (uist.hasConflict) return toastError('file already exist, change app name')
                     const path = `${st.rootPath}/${relPath}`
                     writeFileSync(path, code, 'utf-8')
                     const file = st.library.getFile(relPath as RelativePath)
                     const res = await file.extractScriptFromFile()
                     if (res.type === 'failed') return toastError('failed to extract script')
                     const script = res.script
                     script.evaluateAndUpdateAppsAndViews()
                     const apps = script._apps_viaScript
                     if (apps == null) return toastError('no app found (apps is null)')
                     if (apps.length === 0) return toastError('no app found (apps.length === 0)')
                     const firstApp = apps[0]!
                     firstApp.openLastOrCreateDraft()
                  }}
               >
                  create file
               </Button>
               <MessageInfoUI markdown={` This file will be created as  \`${relPath}\``} />
               <TypescriptHighlightedCodeUI code={code} />
            </div>
         )}
         {/* {json ? <pre>{JSON.stringify(json.value, null, 4)}</pre> : null} */}
         {/* {Boolean(hasWorkflow) ? '🟢 has workflow' : `🔴 no workflow`} */}
      </Surface>
   )
})

const LegacyFieldUI = observer(function LegacyFieldUI_(p: { k: string; v: string | number | object }) {
   return (
      <div className='flex items-start gap-1'>
         <div className='text-neutral-content italic'>{p.k}:</div>
         <div>{typeof p.v === 'object' ? <pre>{JSON.stringify(p.v)}</pre> : p.v}</div>
      </div>
   )
})
