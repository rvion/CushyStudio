import { ReactNode } from 'react'

export const Text = (p: { size: 300 | 500; children: ReactNode }) => {
    return <span>{p.children}</span>
}

export const Subtitle2 = (p: { children: ReactNode }) => {
    return <span>{p.children}</span>
}
export const Title1 = (p: { children: ReactNode }) => {
    return <h1>{p.children}</h1>
}
export const Title2 = (p: { children: ReactNode }) => {
    return <h2>{p.children}</h2>
}
export const Title3 = (p: { children: ReactNode }) => {
    return <h3>{p.children}</h3>
}

export const Caption1 = (p: { children: ReactNode }) => {
    return <span>{p.children}</span>
}
