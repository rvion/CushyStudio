import type { MediaImageL } from 'src/models/MediaImage'

// IMAGE ----------------------------------------------------------------------------
export type ImageAnswer = MediaImageL // | ImageAnswer2 | ImageAnswer3 | ImageAnswer4
export type CushyImageAnswer = MediaImageL
export type ImageAnswerForm<Type extends string, Bool extends boolean> = {
    type: Type
    active: Bool
    imageID?: Maybe<MediaImageID>
}
