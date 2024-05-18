/**
 * a simple Menu entry for when you don't want to resort to commands nor custom widgets
 * label will be used for shortcut binding and fuzzy menu search
 */
export class SimpleMenuAction {
    constructor(
        public label: string,
        public onPick: () => void,
    ) {}
}
