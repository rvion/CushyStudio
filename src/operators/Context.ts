import { nanoid } from 'nanoid'

const knownContexts = new Map<string, ContextInstance<any>>()

export class Context<Props> {
    use = (p: Props) => {
        const uid = nanoid()
        const instance = new ContextInstance(this, uid, p)
        knownContexts.set(uid, instance)
        return { 'data-context': uid }
    }
}

export class ContextInstance<Props> {
    constructor(
        //
        public context: Context<Props>,
        public uid: string,
        public props: Props,
    ) {}
}
