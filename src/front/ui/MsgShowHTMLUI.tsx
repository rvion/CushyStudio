import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useRef } from 'react'

export const MsgShowHTMLUI = observer(function MsgShowHTMLUI_(p: { html: Maybe<string> }) {
    if (p.html == null) return null
    const ref = useRef<HTMLDivElement>(null)
    // const zoomed = useLocalObservable(() => ({ zoom: false }))

    useLayoutEffect(() => {
        if (ref.current == null) return
        ;(window as any).mermaid.run({ querySelector: 'pre.mermaid', theme: 'dark' })
        // copy pasta temp hack workaround
        const e = ref.current
        if (e == null) return
        const x = e.querySelectorAll('svg')
        const svg = x.item(0)
        if (svg == null) return console.log('no svg')
        svg.style.setProperty('max-height', '200px')
    }, [ref, p.html])

    return (
        <div
            dangerouslySetInnerHTML={{ __html: p.html }}
            ref={ref}
            onClick={() => {
                if (1 - 1 === 0) return /* 🔴 */

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
    )
})
