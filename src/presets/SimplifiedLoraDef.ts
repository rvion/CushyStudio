/**
 * this module must not import anything from src/core-back
 * the LATER type is used to reference types that may or may not be available on users machines, depending
 * on the node suite they have setup
 */

export type SimplifiedLoraDef = {
    name: Enum_LoraLoader_lora_name
    /** defaults to 1 */
    strength_clip?: number
    /** defaults to 1 */
    strength_model?: number
}
