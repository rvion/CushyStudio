import { ContrastConfig_Ext, ContrastConfig } from './contrastConfig'
import { crToBg } from './crTo'

// TODO: rename that function
export function contrastToConfig(rawContrast: ContrastConfig_Ext): ContrastConfig {
    if (typeof rawContrast === 'number') return crToBg('white', rawContrast)
    if (_isValidContrastConfig(rawContrast)) return rawContrast
    throw new Error('Invalid contrast format')
}

// prettier-ignore
function _isValidContrastConfig(el: object): el is ContrastConfig {
    return (
        'bgColor'       in el && //
        'fgColor'       in el &&
        'cr'            in el &&
        'contrastModel' in el
    )
}
