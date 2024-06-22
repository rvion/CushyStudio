import type { IconName } from '../csuite/icons/icons'

export class Panel<T> {
    $Props!: T

    get name(): string {
        return this.p.name
    }

    get widget(): React.FC<T> {
        return this.p.widget()
    }
    get header() {
        return this.p.header
    }

    constructor(
        public p: {
            //
            name: string
            widget: () => React.FC<T>
            header: (p: NoInfer<T>) => { title: string; icon: Maybe<IconName> }
        },
    ) {}
}
