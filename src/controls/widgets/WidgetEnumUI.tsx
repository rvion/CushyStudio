import { observer } from 'mobx-react-lite'
import { Widget_enum, Widget_enumOpt } from 'src/controls/Widget'
import { SelectUI } from 'src/rsuite/SelectUI'
import { Popover, Whisper } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { CleanedEnumResult } from 'src/types/EnumUtils'
import type { EnumName, EnumValue } from '../../models/Schema'
import { extractDownloadCandidates } from '../EnumDefault'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'

type T = {
    label: EnumValue
    value: EnumValue | null
}[]

export const EnumDownloaderUI = observer(function EnumDownloaderUI_<K extends KnownEnumNames>(p: {
    widget: Widget_enum<K> | Widget_enumOpt<K>
}) {
    const st = useSt()
    const models = extractDownloadCandidates(p.widget.input.default as any)
    if (models == null) return null
    return (
        <RevealUI>
            <div tw='btn btn-square btn-ghost btn-sm'>
                <span className='material-symbols-outlined'>cloud_download</span>
            </div>
            <div tw='flex flex-col flex-wrap gap-1'>
                {/* {models.length} */}
                {/* <pre>{JSON.stringify(p.widget.input.default)}</pre> */}
                {models.map((m) => {
                    const isInstalled = p.widget.possibleValues.find((x) => x === m.filename)
                    const host = st.mainHost
                    const rootComfyUIFolder = host.absolutPathToDownloadModelsTo
                    const dlPath = `${rootComfyUIFolder}/${m.type}/${m.filename}`
                    return (
                        <div>
                            <div
                                onClick={async () => {
                                    // 🔴 TODO
                                    // https://github.com/ltdrdata/ComfyUI-Manager/blob/main/js/model-downloader.js#L11
                                    // copy Data-it implementation

                                    // download file
                                    const res = await host.getComfyUIManager()?.installModel(m)
                                    if (!res) return

                                    // const res = await host.downloadFileIfMissing(m.url, dlPath)

                                    // retrieve the enum info
                                    // add the new value (BRITTLE)
                                    const enumInfo = st.schema.knownEnumsByName //
                                        .get(p.widget.input.enumName)
                                    enumInfo?.values.push(m.filename)
                                }}
                                tw='btn btn-sm btn-outline'
                                key={m.name}
                            >
                                {isInstalled ? '🟢' : null}
                                <span className='material-symbols-outlined'>cloud_download</span>
                                <span>{m.name}</span>
                            </div>
                            {/* <RevealUI> */}
                            <div>infos</div>
                            <div>
                                <div tw='text-xx italic'>{m.url}</div>
                                <div tw='text-xx italic'>{dlPath}</div>
                            </div>
                            {/* </RevealUI> */}
                        </div>
                    )
                })}
            </div>
        </RevealUI>
    )
})
export const WidgetEnumUI = observer(function WidgetEnumUI_<K extends KnownEnumNames>(p: {
    widget: Widget_enum<K> | Widget_enumOpt<K>
}) {
    const widget = p.widget
    const enumName = widget.input.enumName
    const isOptional = widget instanceof Widget_enumOpt
    return (
        <>
            <EnumSelectorUI
                value={() => widget.status}
                disabled={!widget.state.active}
                isOptional={isOptional}
                enumName={enumName}
                // substituteValue={req.status}
                onChange={(e) => {
                    if (e == null) {
                        if (isOptional) widget.state.active = false
                        return
                    }
                    widget.state.val = e as any // 🔴
                }}
            />

            <EnumDownloaderUI widget={widget} />
        </>
    )
})

export const EnumSelectorUI = observer(function EnumSelectorUI_(p: {
    isOptional: boolean
    value: () => CleanedEnumResult<any>
    displayValue?: boolean
    // substituteValue?: EnumValue | null
    onChange: (v: EnumValue | null) => void
    disabled?: boolean
    enumName: EnumName
}) {
    const project = useSt().project
    const schema = project.schema
    const options: EnumValue[] = schema.knownEnumsByName.get(p.enumName)?.values ?? [] // schema.getEnumOptionsForSelectPicker(p.enumName)
    // const valueIsValid = (p.value != null || p.isOptional) && options.some((x) => x.value === p.value)
    const value = p.value()
    const hasError = Boolean(value.isSubstitute || value.ENUM_HAS_NO_VALUES)
    return (
        <div tw='flex-1'>
            <SelectUI //
                tw={[{ ['rsx-field-error']: hasError }]}
                size='sm'
                disabled={p.disabled}
                cleanable={p.isOptional}
                options={() => options}
                getLabelText={(v) => v.toString()}
                value={() => p.value().candidateValue}
                hideValue={p.displayValue}
                onChange={(option) => {
                    if (option == null) return
                    p.onChange(option)
                }}
            />
            <div tw='flex flex-wrap gap-2'>
                {value.isSubstitute ? ( //
                    <Whisper
                        enterable
                        placement='bottom'
                        speaker={
                            <Popover>
                                <span>
                                    <span tw='bord'>{value.candidateValue}</span> is not in your ComfyUI install folder
                                </span>
                                <div>
                                    <span tw='bord'>{value.finalValue}</span> used instead
                                </div>
                            </Popover>
                        }
                    >
                        <div className='text-orange-500 flex items-center'>
                            <span className='material-symbols-outlined'>info</span>
                            <span>{value.finalValue}</span>
                        </div>
                    </Whisper>
                ) : null}
                {value.ENUM_HAS_NO_VALUES ? <div tw='text-red-500'>ENUM HAS NO VALUE</div> : null}
            </div>
        </div>
    )
})
