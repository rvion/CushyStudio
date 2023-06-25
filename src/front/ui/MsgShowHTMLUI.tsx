import { observer, useLocalObservable } from 'mobx-react-lite'
import { useSt } from '../FrontStateCtx'
import { Panel } from 'rsuite'
import { useLayoutEffect, useRef } from 'react'
import { MessageFromExtensionToWebview_ } from 'src/types/MessageFromExtensionToWebview'

export const MsgShowHTMLUI = observer(function MsgShowHTMLUI_(p: { msg: MessageFromExtensionToWebview_ }) {
    const st = useSt()
    const msg = p.msg
    if (msg.type !== 'show-html') return <>error</>
    const ref = useRef<HTMLDivElement>(null)
    const zoomed = useLocalObservable(() => ({ zoom: false }))

    useLayoutEffect(() => {
        if (ref.current == null) return
        ;(window as any).mermaid.run({ querySelector: 'pre.mermaid', theme: 'dark' })
        // copy pasta temp hack workaround
        const e = ref.current
        if (e == null) return
        const x = e.querySelectorAll('svg')
        const svg = x.item(0)
        if (svg == null) return console.log('no svg')
        svg.style.setProperty('max-height', '100px')
    }, [ref])

    return (
        <div className='float-right abso'>
            <Panel collapsible defaultExpanded shaded header='Graph'>
                {/* <TransformWrapper> */}
                {/* <TransformComponent> */}
                <div
                    // style={{ maxHeight: '10rem', overflow: 'auto' }}
                    // style={{ flexGrow: 1 }}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                    ref={ref}
                    onClick={() => {
                        const e = ref.current
                        if (e == null) return
                        const x = e.querySelectorAll('svg')
                        const svg = x.item(0)
                        if (svg == null) return console.log('no svg')
                        // get maxWidth and maxHeight of svg
                        svg.style.setProperty('max-height', 'none')
                        const maxWidth = svg.style.getPropertyValue('max-width')
                        // const viewBox = svg.getAttribute('viewBox')
                        if (maxWidth == null) return console.log(svg, 'no maxWidth')
                        e.style.width = maxWidth
                    }}
                />
                {/* </TransformComponent> */}
                {/* </TransformWrapper> */}
            </Panel>
        </div>
    )
})
