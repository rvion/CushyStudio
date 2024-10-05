import { spy } from 'mobx'

export const withSpy = <T>(fn: () => T): T => {
    const cancel = spy((ev) => {
        let indent = 0
        if (ev.type === 'report-end') {
            // console.log(`[🟢] ${ev.name} ${ev.arguments}`)
            indent--
        } else {
            indent++
            if (ev.type === 'add' || ev.type === 'remove') {
                console.log(`[🟢]${'  '.repeat(indent)} ${ev.type} ${(ev as any).name}`, ev)
            } else console.log(`[🟢]${'  '.repeat(indent)} ${ev.type}`, ev)
        }
    })
    const t = fn()
    cancel()
    return t
}
