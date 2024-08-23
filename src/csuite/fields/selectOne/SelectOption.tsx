import type { IconName } from '../../icons/icons'

export type SelectOptionID = string
export type SelectOption_<VALUE extends string> = SelectOption<VALUE, VALUE>
export type SelectOption<
    //
    VALUE,
    KEY extends string,
> = {
    // NOT optional
    id: KEY
    value: VALUE

    // optional
    label?: string
    labelNode?: JSX.Element
    icon?: IconName
    hue?: number
}

// Variants ----------------------------------------------------------------------------------------
// probably not really needed

/** SelectOptional variant with optional value */
export type SelectOptionOpt<
    //
    VALUE,
    KEY extends string,
> = {
    // NOT optional
    id: KEY

    // optional
    value?: VALUE
    label?: string
    labelNode?: JSX.Element
    icon?: IconName
    hue?: number
}

/** SelectOptional variant with optional value */
export type SelectOptionNoVal<KEY extends string> = {
    // NOT optional
    id: KEY

    // optional
    label?: string
    labelNode?: JSX.Element
    icon?: IconName
    hue?: number
}
