import type { IWidget } from './IWidget'

export class Spec<W extends IWidget = IWidget> {
    $Widget!: W
    $Type!: W['type']
    $Input!: W['$Input']
    $Serial!: W['$Serial']
    $Output!: W['$Output']

    constructor(
        //
        public readonly type: W['type'],
        public readonly config: W['$Input'],
        /** if specified, bypass the instanciation completely */
        public widget?: W,
    ) {}
}
