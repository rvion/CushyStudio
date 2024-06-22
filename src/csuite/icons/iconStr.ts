import { allIcons, type IconName } from './icons'

export const getIconAsDataSVG = (iconName: Maybe<IconName>): string | undefined => {
    if (!iconName) return undefined
    const iconPath = allIcons[iconName]
    return [
        `data:image/svg+xml,`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">`,
        `<path fill="white" d="${iconPath}"></path>`,
        `</svg>`,
    ].join('')
}
