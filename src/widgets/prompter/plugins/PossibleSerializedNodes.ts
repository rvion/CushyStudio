import type { LoraNodeJSON } from '../nodes/lora/LoraNode'
import type { BooruNodeJSON } from '../nodes/booru/BooruNode'
import type { WildcardNodeJSON } from '../nodes/wildcards/WildcardNode'
import type { EmbeddingNodeJSON } from '../nodes/embedding/EmbeddingNode'
import type { UserNodeJSON } from '../nodes/usertags/UserNode'
import type { ActionNodeJSON } from '../nodes/actions/ActionNode'
import type { BreakNodeJSON } from '../nodes/break/BreakNode'

export type PossibleSerializedNodes =
    | BooruNodeJSON
    | LoraNodeJSON
    | WildcardNodeJSON
    | EmbeddingNodeJSON
    | BreakNodeJSON
    | TextNodeJSON
    | LineBreakJSON
    | UserNodeJSON
    | ActionNodeJSON

type TextNodeJSON = { type: 'text'; text: string }
type ParagraphNodeJSON = { type: 'paragraph'; children: PossibleSerializedNodes[] }
type LineBreakJSON = { type: 'linebreak' }
