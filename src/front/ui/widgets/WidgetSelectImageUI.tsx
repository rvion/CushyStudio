import { observer } from 'mobx-react-lite'
import { ImageAnswer } from 'src/controls/InfoAnswer'
import { ImageUI } from '../galleries/ImageUI'
import { useImageDrop } from '../galleries/dnd'
import { useDraft } from '../useDraft'

export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: {
    // infos: ImageInfos[]
    get: () => ImageAnswer | null
    set: (value: ImageAnswer) => void
}) {
    const { get, set } = p
    // const lbs = useMemo(() => new LightBoxState(() => infos), [infos])
    const answer = get()
    const [dropStyle, dropRef] = useImageDrop((i) => {
        set({ type: 'imageID', imageID: i.id })
    })
    const draft = useDraft()
    const node = draft.graph.item.findNodeByType('VAEDecode')
    return (
        <div>
            <div className='flex gap-2 flex-row '>
                <div
                    ref={dropRef}
                    className='flex gap-2'
                    style={{ border: '1px dashed red', width: '3rem', height: '3rem', ...dropStyle }}
                >
                    {/* {infos.map((info) => {
                    const url = info.comfyURL
                    return (
                        <RadioGroup value={checkedURL?.comfyURL} name='radioList'>
                            <div key={url} onClick={() => set(info)} className='hover:bg-gray-500'>
                                <img
                                    onClick={() => (lbs.opened = true)}
                                    style={{
                                        cursor: 'pointer',
                                        objectFit: 'contain',
                                        width: '32px',
                                        height: '32px',
                                    }}
                                    src={url}
                                    alt=''
                                />
                                <Radio value={url} onChange={() => set(info)} />
                            </div>
                        </RadioGroup>
                    )
                })} */}
                    {/* <LightBoxUI lbs={lbs} /> */}
                    {answer?.type === 'imageID' ? ( //
                        <ImageUI img={draft.db.images.getOrThrow(answer.imageID)} />
                    ) : null}
                </div>
                {/* <Button size='sm' onClick={() => set({ type: 'imageSignal', nodeID: node!.uid, fieldName: 'IMAGE' })}>
                    last
                </Button> */}
            </div>
            <span
                style={{
                    // whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                }}
            >
                {/* {JSON.stringify(answer ?? { '❌': '❌' }, null, 3)} */}
                {/* le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le chat le */}
                {/* chat */}
            </span>
        </div>
    )
})
