import { observer } from 'mobx-react-lite'
import { useSt } from '../core-front/stContext'
import { MessageFromExtensionToWebview } from '../core-types/MessageFromExtensionToWebview'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Panel } from 'rsuite'

export const MsgShowHTMLUI = observer(function MsgShowHTMLUI_(p: { msg: MessageFromExtensionToWebview }) {
    const st = useSt()
    const msg = p.msg
    if (msg.type !== 'show-html') return <>error</>
    return (
        <Panel bordered shaded>
            <TransformWrapper>
                <TransformComponent>
                    <div
                        // style={{ width: '100%' }}
                        style={{ width: '100%', flexGrow: 1 }}
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                        ref={(e) => {
                            if (e == null) return
                            console.log(msg.content)
                            ;(window as any).mermaid.run({ querySelector: 'pre.mermaid' })
                            setTimeout(() => {
                                // 🔴 this is just bad code, only works for mermaid / with single svg
                                // have to fix this later
                                try {
                                    const x = e.querySelectorAll('svg')
                                    const svg = x.item(0)
                                    if (svg == null) return console.log('no svg')
                                    // get maxWidth and maxHeight of svg
                                    const maxWidth = svg.style.getPropertyValue('max-width')
                                    // const viewBox = svg.getAttribute('viewBox')
                                    if (maxWidth == null) return console.log(svg, 'no maxWidth')
                                    e.style.width = maxWidth
                                } catch (error) {
                                    console.log(error)
                                }
                            }, 100)
                            // const maxHeight = svg.getAttribute('height')
                            // console.log({ maxWidth, maxHeight })
                        }}
                    />
                </TransformComponent>
            </TransformWrapper>
        </Panel>
    )
})
