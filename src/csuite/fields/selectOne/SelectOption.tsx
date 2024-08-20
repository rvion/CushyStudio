import type { IconName } from '../../icons/icons'

export type OptionID = string

export type SelectOption<
    //
    VALUE = any /* 🔴 */,
    OPTION_ID extends OptionID = OptionID,
> = {
    // 🔴 todo: require 2nd type arg to see bad usages + add extend Id type in FieldSelectOne_config
    id: OPTION_ID
    value: VALUE
    label?: string
    icon?: IconName
    hue?: number
}
// 🔴 this is temp and does not belong here

export type SelectOption_NO_VALUE<VALUE, Id extends OptionID = OptionID> = {
    id: Id
    value?: VALUE
    label?: string
    labelNode?: JSX.Element
    icon?: IconName
    hue?: number
}
