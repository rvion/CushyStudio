type Rectangle = { x: number; y: number; w: number; h: number }
type Point = { x: number; y: number }
type MinimapStyles = Record<string, string>
type MinimapProps = Partial<MinimapOptions>
type MinimapOptions = {
    viewport: HTMLElement | null
    styles: MinimapStyles
    back: string
    view: string
    drag: string
    interval?: Maybe<number>
}

export const renderMinimap = (canvas: HTMLCanvasElement, options: MinimapProps) => {
    const WIN = global.window
    const DOC = WIN.document
    const DOC_EL = DOC.documentElement
    const BODY = DOC.querySelector('body')
    if (BODY == null) throw new Error('no body')
    if (canvas == null) return console.log('no canvas yet')
    const CTX = canvas.getContext('2d')
    if (CTX == null) throw new Error('no ctx')

    const black = (pc: number) => `rgba(0,0,0,${pc / 100})`
    const defaultMinimapStyles = {
        'header,footer,section,article': black(8),
        'h1,a': black(10),
        'h2,h3,h4': black(8),
    }
    const defaultMinimapOptions: MinimapOptions = {
        viewport: null,
        styles: defaultMinimapStyles,
        back: black(2),
        view: black(5),
        drag: black(10),
        interval: null,
    }
    const settings: MinimapOptions = Object.assign(defaultMinimapOptions, options)

    const _listener = <K>(el: any, method: K, types: string, fn: any) =>
        types.split(/\s+/).forEach((type) => el[method](type, fn))
    const on = (el: HTMLElement | Window, types: any, fn: any) => _listener(el, 'addEventListener', types, fn)
    const off = (el: HTMLElement | Window, types: any, fn: any) => _listener(el, 'removeEventListener', types, fn)

    const Rect = (x: number, y: number, w: number, h: number): Rectangle => ({ x, y, w, h })
    const rect_rel_to = (rect: Rectangle, pos = { x: 0, y: 0 }): Rectangle => Rect(rect.x - pos.x, rect.y - pos.y, rect.w, rect.h)
    const rect_of_doc = (): Rectangle => Rect(0, 0, DOC_EL.scrollWidth, DOC_EL.scrollHeight)
    const rect_of_win = (): Rectangle => Rect(WIN.pageXOffset, WIN.pageYOffset, DOC_EL.clientWidth, DOC_EL.clientHeight)

    const el_get_offset = (el: HTMLElement): Point => {
        const br = el.getBoundingClientRect()
        return { x: br.left + WIN.pageXOffset, y: br.top + WIN.pageYOffset }
    }

    const rect_of_el = (el: HTMLElement): Rectangle => {
        const { x, y } = el_get_offset(el)
        const w = el.offsetWidth ?? (el as any).width?.baseVal?.value
        const h = el.offsetHeight ?? (el as any).height?.baseVal?.value
        if (typeof w !== 'number') {
            // console.log(w, el)
            // debugger
        }
        return Rect(x, y, w, h)
    }

    const rect_of_viewport = (el: HTMLElement): Rectangle => {
        const { x, y } = el_get_offset(el)
        return Rect(x + el.clientLeft, y + el.clientTop, el.clientWidth, el.clientHeight)
    }

    const rect_of_content = (el: HTMLElement): Rectangle => {
        const { x, y } = el_get_offset(el)
        return Rect(x + el.clientLeft - el.scrollLeft, y + el.clientTop - el.scrollTop, el.scrollWidth, el.scrollHeight)
    }

    const calc_scale: (w: number, h: number) => number = (() => {
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        return (w: number, h: number) => Math.min(width / w, height / h)
    })()

    const resize_canvas = (w: number, h: number) => {
        canvas.width = w
        canvas.height = h
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
    }

    const viewport = settings.viewport
    const find = (sel: string): HTMLElement[] => {
        const root = viewport || DOC
        const items: HTMLElement[] = Array.from(root.querySelectorAll(sel))
        // console.log(`🔎 found ${items.length} items of ${sel} from`, root)
        return items
    }

    let drag = false
    let root_rect: Rectangle
    let view_rect: Rectangle
    let scale: number
    let drag_rx: number
    let drag_ry: number

    const draw_rect = (rect: Rectangle, col: string | CanvasGradient | CanvasPattern) => {
        if (col) {
            CTX.beginPath()
            CTX.rect(rect.x, rect.y, rect.w, rect.h)
            CTX.fillStyle = col
            CTX.fill()
        }
    }

    const apply_styles = (styles: MinimapStyles) => {
        Object.keys(styles).forEach((sel) => {
            const col = styles[sel]
            find(sel).forEach((el) => {
                const el_rect = rect_of_el(el)
                const el_rect_rel = rect_rel_to(el_rect, root_rect)
                // console.log('>>', root_rect, el_rect, el_rect_rel, col)
                // console.log('>>', el_rect_rel)
                draw_rect(el_rect_rel, col)
            })
        })
    }

    const draw = (): void => {
        root_rect = viewport ? rect_of_content(viewport) : rect_of_doc()
        view_rect = viewport ? rect_of_viewport(viewport) : rect_of_win()
        scale = calc_scale(root_rect.w, root_rect.h)
        // console.log('🔥', root_rect, view_rect, scale)
        resize_canvas(root_rect.w * scale, root_rect.h * scale)

        CTX.setTransform(1, 0, 0, 1, 0, 0)
        CTX.clearRect(0, 0, canvas.width, canvas.height)
        CTX.scale(scale, scale)

        draw_rect(rect_rel_to(root_rect, root_rect), settings.back)
        apply_styles(settings.styles)
        draw_rect(rect_rel_to(view_rect, root_rect), drag ? settings.drag : settings.view)
    }

    const on_drag = (ev: DragEvent) => {
        ev.preventDefault()
        const cr = rect_of_viewport(canvas)
        const x = (ev.pageX - cr.x) / scale - view_rect.w * drag_rx
        const y = (ev.pageY - cr.y) / scale - view_rect.h * drag_ry

        if (viewport) {
            viewport.scrollLeft = x
            viewport.scrollTop = y
        } else {
            WIN.scrollTo(x, y)
        }
        draw()
    }

    const on_drag_end = (ev: DragEvent) => {
        drag = false
        canvas.style.cursor = 'pointer'
        BODY.style.cursor = 'auto'
        off(WIN, 'mousemove', on_drag)
        off(WIN, 'mouseup', on_drag_end)
        on_drag(ev)
    }

    const on_drag_start = (ev: DragEvent) => {
        drag = true

        const cr = rect_of_viewport(canvas)
        const vr = rect_rel_to(view_rect, root_rect)
        drag_rx = ((ev.pageX - cr.x) / scale - vr.x) / vr.w
        drag_ry = ((ev.pageY - cr.y) / scale - vr.y) / vr.h
        if (drag_rx < 0 || drag_rx > 1 || drag_ry < 0 || drag_ry > 1) {
            drag_rx = 0.5
            drag_ry = 0.5
        }

        canvas.style.cursor = 'crosshair'
        BODY.style.cursor = 'crosshair'
        on(WIN, 'mousemove', on_drag)
        on(WIN, 'mouseup', on_drag_end)
        on_drag(ev)
    }

    const init = () => {
        canvas.style.cursor = 'pointer'
        on(canvas, 'mousedown', on_drag_start)
        on(viewport || WIN, 'load resize scroll', draw)
        if (settings.interval && settings.interval > 0) {
            setInterval(() => draw(), settings.interval)
        }
        draw()
    }

    init()

    return {
        redraw: draw,
    }
}
