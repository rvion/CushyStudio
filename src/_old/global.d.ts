declare module 'x/y' {
    export class Z {
        a: 1
    }
}

declare const zzz: import('x/y').Z
