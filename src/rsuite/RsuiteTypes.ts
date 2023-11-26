export type ItemDataType = {
    value: string
    children?: ItemDataType[]
    label: string
}

export type RSColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue'
export type RSSize = 'sm' | 'xs' | 'md' | 'lg'
export type RSAppearance = 'default' | 'subtle' | 'ghost' | 'link' | 'primary'
export type TypeAttributes = {
    Color: RSColor
    Size: RSSize
    Appearance: RSAppearance
}
