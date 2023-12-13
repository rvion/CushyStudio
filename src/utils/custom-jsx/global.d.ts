import 'react'

type ClassLike = string | { [cls: string]: any } | null | undefined | boolean

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            tw?: string | ClassLike[]
        }
    }
}

declare module 'react' {
    interface DOMAttributes<T> {
        tw?: string | ClassLike[]
    }
}

declare module '*.css' {}

declare module '@docusaurus/tsconfig' {}
