import { createElement, type ReactNode } from 'react'

export const ShellNoop = (): ReactNode => {
    return createElement('div', null, '❌ Default Shell ❌')
}
