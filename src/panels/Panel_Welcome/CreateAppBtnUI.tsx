import { existsSync, writeFileSync } from 'fs'
import { observer, useLocalObservable } from 'mobx-react-lite'

import { MessageErrorUI, MessageInfoUI } from '../MessageUI'
import { convertToValidCrossPlatformFileName } from './convertToValidCrossPlatformFileName'
import { openExternal } from 'src/app/layout/openExternal'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { toastError } from 'src/utils/misc/toasts'
import { TypescriptHighlightedCodeUI } from 'src/widgets/misc/TypescriptHighlightedCodeUI'

export const CreateAppBtnUI = observer(function CreateAppBtnUI_(p: {}) {
    const st = useSt()
    const uist = useLocalObservable(() => ({
        appName: 'my-app',
        description: 'my app description',
        get fileName() {
            return convertToValidCrossPlatformFileName(uist.appName)
        },
        get relPath(): RelativePath {
            return `library/local/${convertToValidCrossPlatformFileName(uist.appName)}.ts` as RelativePath
        },
        get absPath(): AbsolutePath {
            return `${st.rootPath}/${uist.relPath}` as AbsolutePath
        },
        get hasConflict() {
            return existsSync(uist.absPath)
        },
    }))
    return (
        <RevealUI placement='popup-lg' title='Create an app'>
            <div tw='btn btn-sm btn-accent'>
                create My app
                <span className='material-symbols-outlined'>open_in_new</span>
            </div>
            <div tw='flex flex-col gap-2'>
                <div tw='flex gap-1'>
                    <div tw='flex flex-col gap-2'>
                        <div>
                            <div tw='font-bold'>App name</div>
                            <input
                                autoFocus
                                value={uist.appName}
                                onChange={(ev) => (uist.appName = ev.target.value)}
                                type='text'
                                tw={['input input-bordered', uist.hasConflict && 'rsx-field-error']}
                            />
                            {uist.hasConflict && <MessageErrorUI markdown='File alreay exist' />}
                        </div>
                        <div>
                            <div tw='font-bold'>Description</div>
                            <input
                                value={uist.description}
                                onChange={(ev) => (uist.description = ev.target.value)}
                                type='text'
                                tw='input input-bordered'
                            />
                        </div>
                    </div>
                    <div tw='virtualBorder p-2'>
                        <MessageInfoUI markdown={` This file will be created as  \`${uist.relPath}\``} />
                        <TypescriptHighlightedCodeUI
                            tabIndex={-1}
                            code={mkAppTemplate({
                                description: uist.description,
                                name: uist.appName,
                            })}
                        />
                    </div>
                </div>
                <div tw='flex'>
                    <button
                        tw={['btn btn-primary ml-auto', uist.hasConflict && 'btn-disabled rsx-field-error']}
                        onClick={async () => {
                            if (uist.hasConflict) return toastError('file already exist, change app name')
                            //
                            const fname = convertToValidCrossPlatformFileName(uist.appName)
                            const relPath = `library/local/${fname}.ts` as RelativePath
                            const path = `${st.rootPath}/${relPath}`
                            writeFileSync(path, mkAppTemplate({ name: uist.appName, description: uist.description }), 'utf-8')
                            const file = st.library.getFile(relPath)
                            const res = await file.extractScriptFromFile()
                            if (res.type === 'failed') return toastError('failed to extract script')
                            const script = res.script
                            await script.evaluateAndUpdateApps()
                            const apps = script._apps_viaScript
                            if (apps == null) return toastError('no app found (apps is null)')
                            if (apps.length === 0) return toastError('no app found (apps.length === 0)')
                            const firstApp = apps[0]!
                            firstApp.openLastOrCreateDraft()
                        }}
                    >
                        Create
                    </button>
                </div>
                <IntroTxt />
            </div>
        </RevealUI>
    )
})

const mkAppTemplate = (p: {
    //
    name: string
    description: string
}) => {
    return `\
app({
    metadata: {
        name: ${JSON.stringify(p.name)},
        description: ${JSON.stringify(p.description)},
    },
    ui: (form) => ({
        model: form.enum.Enum_CheckpointLoaderSimple_ckpt_name({}),
        positive: form.string({ default: 'masterpiece, tree' }),
        seed: form.seed({}),
    }),
    run: async (run, ui) => {
        const workflow = run.workflow
        const graph = workflow.builder

        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: ui.model })
        const latent = graph.EmptyLatentImage({})
        const image = graph.VAEDecode({
            samples: graph.KSampler({
                seed: ui.seed,
                latent_image: latent,
                model: ckpt,
                sampler_name: 'ddim',
                scheduler: 'karras',
                positive: graph.CLIPTextEncode({ clip: ckpt, text: ui.positive }),
                negative: graph.CLIPTextEncode({ clip: ckpt, text: '' }),
            }),
            vae: ckpt,
        })

        graph.PreviewImage({ images: image })
        await workflow.sendPromptAndWaitUntilDone()
    },
})
`
}

const IntroTxt = () => {
    const st = useSt()
    return (
        <MessageInfoUI title='Memo'>
            <div>
                <div>Cushy apps are "just" typescript file (with a few tweaks)</div>
                You <b>don't</b> need this popup to create a Cushy App; you can simply create a file in the{' '}
                <div tw='inline-flex items-center'>
                    <b tw='underline' onClick={() => openExternal(`file://${st.libraryFolderPathAbs}/local`)}>
                        library/local
                    </b>
                    <span className='material-symbols-outlined !text-sm'>open_in_new</span>
                </div>
                folder
            </div>
        </MessageInfoUI>
    )
}
