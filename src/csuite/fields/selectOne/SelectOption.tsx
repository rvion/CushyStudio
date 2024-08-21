import type { IconName } from '../../icons/icons'

export type OptionID = string

export type SelectOption_<VALUE extends string> = SelectOption<VALUE, VALUE>

export type SelectOption<
    //
    VALUE,
    KEY extends string,
> = {
    id: KEY
    value: VALUE
    label?: string
    icon?: IconName
    hue?: number
}
// 🔴 this is temp and does not belong here

export type SelectOption_NO_VALUE<
    //
    VALUE,
    KEY extends string,
> = {
    id: KEY
    value?: VALUE
    label?: string
    labelNode?: JSX.Element
    icon?: IconName
    hue?: number
}
