import type { CovariantFC } from './CovariantFC'
import type { IWidget } from './IWidget'
import type { BoundKontext, Kontext } from './Kontext'

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

    // -----------
    _withKontext: Set<Kontext<any>>
    withKontext(ck: Kontext<any>): this

    _feedKontext: Maybe<BoundKontext<any, any>>
    feedKontext(_feedKontext: BoundKontext<any, any>): this
}
