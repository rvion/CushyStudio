// IMAGE ----------------------------------------------------------------------------
export type ImageAnswer = CushyImageAnswer // | ImageAnswer2 | ImageAnswer3 | ImageAnswer4
export type CushyImageAnswer = { imageID: MediaImageID }
export type ImageAnswerForm<Type extends string, Bool extends boolean> = {
    type: Type
    active: Bool
    imageID?: Maybe<MediaImageID>
}
