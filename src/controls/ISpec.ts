import type { CovariantFn } from './BivariantHack'
import type { CovariantFC } from './CovariantFC'
import type { IWidget } from './IWidget'

export type SchemaDict = { [key: string]: ISpec }

export interface ISpec<W extends IWidget = IWidget> {
    // real fields
    type: W['type']
    config: W['$Config']

    // type utils
    $Widget: W
    $Type: W['type']
    $Config: W['$Config']
    $Serial: W['$Serial']
    $Value: W['$Value']

    LabelExtraUI?: CovariantFC<{ widget: W }> /* 🧮 */
    // Make<X extends IWidget>(type: X['type'], config: X['$Config']): ISpec<X>
}
